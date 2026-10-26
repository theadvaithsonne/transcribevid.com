/**
 * The speech timeline the Whisper seek loop reads (all speech pieces of the original audio back to back, or the whole
 * file with VAD off), in two forms:
 *
 * - `SpeechTimeline` (pipeline.ts): the whole decoded PCM is in memory (`collect: true`), everything is known at once.
 * - `StreamingTimeline` (here): devices with `deviceMemory <= 4` (ARCHITECTURE section 3). The decoder runs with
 *   `collect: false`; every 16 kHz chunk goes through the VAD, and only the speech the VAD has confirmed is kept, from
 *   the current window on. The seek loop waits until its window is there; the decoder waits (back-pressure) while
 *   more than `maxAhead` samples are buffered past the window. Memory is a few windows of Float32 instead of
 *   115 MB of Int16 per hour.
 *
 * Both give the seek loop the same samples (Float32 straight from the decoder instead of the Int16 round trip, a
 * -96 dB difference) and the same speech chunks: `appendSpeechChunk` fuses the VAD's segments exactly like
 * pipeline.ts `speechChunks()` does after the fact (overlapping and touching segments become one chunk).
 */
import type { SpeechChunk } from '../post/words';
import { AudioRing } from '../vad/streaming';
import type { SpeechSegment } from '../vad/types';

export const SAMPLE_RATE = 16000;

/** What the seek loop needs from a timeline. */
export interface TimelineLike {
  /** timeline samples known so far (all of them once `done`) */
  readonly samples: number;
  /** decoding (and the VAD) has finished: `samples` is the total */
  readonly done: boolean;
  /** the speech pieces (original sample ranges) found so far; null = VAD off */
  readonly chunks: readonly SpeechChunk[] | null;
  /** resolves once `samples >= n` or decoding is done; rejects when decoding failed */
  waitFor(n: number): Promise<void>;
  /** timeline samples [from, to) */
  slice(from: number, to: number): Float32Array;
  /** samples before `n` will not be read again */
  release(n: number): void;
}

/**
 * Adds one VAD segment to the chunk list (speechChunks' rule: a segment that overlaps or touches the last chunk extends
 * it). Returns the original sample range that is new speech, or null.
 */
export function appendSpeechChunk(chunks: SpeechChunk[], seg: SpeechSegment, limit = Infinity): SpeechChunk | null {
  const start = Math.max(0, Math.floor(seg.start));
  const end = Math.min(limit, Math.floor(seg.end));
  if (end <= start) return null;
  const last = chunks[chunks.length - 1];
  if (last && start <= last.end) {
    if (end <= last.end) return null;
    const added = { start: last.end, end };
    last.end = end;
    return added;
  }
  chunks.push({ start, end });
  return { start, end };
}

export class StreamingTimeline implements TimelineLike {
  readonly chunks: SpeechChunk[] | null;
  /** decoded audio (original sample index) the VAD may still need */
  private readonly raw = new AudioRing();
  /** kept timeline samples (timeline index) */
  private readonly kept = new AudioRing();
  private known = 0;
  private floor = 0;
  private finished = false;
  private closed = false;
  private error: unknown = null;
  private waiters: { n: number; resolve: () => void; reject: (e: unknown) => void }[] = [];
  private spaceWaiters: (() => void)[] = [];

  /**
   * @param vad false = VAD off: every decoded sample is speech
   * @param maxAhead samples the decoder may run ahead of the released point before it has to wait
   */
  constructor(
    vad: boolean,
    private readonly maxAhead = 150 * SAMPLE_RATE,
  ) {
    this.chunks = vad ? [] : null;
  }

  get samples(): number {
    return this.known;
  }

  get done(): boolean {
    return this.finished;
  }

  get frames(): number {
    return Math.floor(this.known / 160);
  }

  /** Samples held in memory right now (for the logs and the specs). */
  get buffered(): number {
    return this.kept.retainedSamples + this.raw.retainedSamples;
  }

  /** A decoded 16 kHz chunk (copied: the decoder reuses its buffers). VAD off: it is speech at once. */
  pushDecoded(chunk: Float32Array): void {
    if (this.chunks) this.raw.append(chunk, true);
    else this.keep(chunk.slice());
  }

  /** Speech the VAD confirmed (original sample range). */
  pushSpeech(seg: SpeechSegment): void {
    if (!this.chunks) return;
    const added = appendSpeechChunk(this.chunks, seg, this.raw.end);
    if (!added) return;
    const from = Math.max(added.start, this.raw.start);
    if (from === added.start) {
      this.keep(this.raw.slice(added.start, added.end));
    } else {
      // never expected (the VAD's retainFrom keeps this audio): keep the timeline aligned with silence
      const block = new Float32Array(added.end - added.start);
      if (added.end > from) block.set(this.raw.slice(from, added.end), from - added.start);
      this.keep(block);
    }
  }

  /** The VAD will not need decoded audio before this original sample any more. */
  trimRaw(retainFrom: number): void {
    this.raw.discardBefore(retainFrom);
  }

  finish(): void {
    this.finished = true;
    this.wake();
  }

  /** The seek loop ended (done, recycle, error, cancel): never hold the decoder back again. */
  close(): void {
    this.closed = true;
    for (const w of this.spaceWaiters.splice(0)) w();
  }

  fail(e: unknown): void {
    this.error ??= e;
    this.finished = true;
    this.wake();
  }

  waitFor(n: number): Promise<void> {
    if (this.error) return Promise.reject(this.error);
    if (this.known >= n || this.finished) return Promise.resolve();
    return new Promise<void>((resolve, reject) => this.waiters.push({ n, resolve, reject }));
  }

  /** The decoder's back-pressure: resolves once the buffer ahead of the released point has room. */
  waitForSpace(): Promise<void> {
    if (this.known - this.floor <= this.maxAhead || this.finished || this.closed) return Promise.resolve();
    return new Promise<void>((resolve) => this.spaceWaiters.push(resolve));
  }

  slice(from: number, to: number): Float32Array {
    const a = Math.max(0, from, this.floor);
    const b = Math.min(this.known, to);
    if (from < this.floor && to > from) {
      throw new RangeError(`timeline samples before ${this.floor} were released (asked ${from}-${to})`);
    }
    if (b <= a) return new Float32Array(0);
    return this.kept.slice(a, b);
  }

  release(n: number): void {
    if (n <= this.floor) return;
    this.floor = n;
    this.kept.discardBefore(n);
    if (this.known - this.floor <= this.maxAhead) {
      const ws = this.spaceWaiters.splice(0);
      for (const w of ws) w();
    }
  }

  /** Appends timeline samples; a block wholly below the released point (a resumed run skipping ahead) is dropped. */
  private keep(block: Float32Array): void {
    this.known += block.length;
    this.kept.append(block);
    if (this.floor) this.kept.discardBefore(this.floor);
    this.wake();
  }

  private wake(): void {
    const still: typeof this.waiters = [];
    for (const w of this.waiters) {
      if (this.error) w.reject(this.error);
      else if (this.known >= w.n || this.finished) w.resolve();
      else still.push(w);
    }
    this.waiters = still;
    if (this.finished) for (const w of this.spaceWaiters.splice(0)) w();
  }
}
