/**
 * Streaming VAD: push(chunk) -> completed speech segments, flush() at the end of the stream.
 *
 * The decoder can hand over audio in any chunk size (WebCodecs gives ~20 ms packets, a WAV reader may give
 * 1 s blocks); the output is identical to running the whole file at once, bit for bit, because
 *   - frames are cut from the absolute sample position (512 per frame), never from chunk boundaries,
 *   - the model is always called with the same frame partition (batches of `batchFrames` frames, the rest at
 *     flush) whatever the chunking of push(),
 *   - the segmenter is the incremental port of faster-whisper's state machine (see segmenter.ts).
 * Memory is bounded: a batch buffer of batchFrames x 512 floats (default 512 KB) plus the segmenter state.
 * The caller keeps the audio it needs in an AudioRing and trims it with `retainFrom`.
 */
import { SpeechSegmenter } from './segmenter';
import { CONTEXT, FRAME, FrameModel, SAMPLE_RATE, SpeechSegment, VadParams } from './types';

export interface StreamingVadOptions {
  /** Frames per model call (default 256 = 8.2 s of audio). Changing it changes timing, not results. */
  batchFrames?: number;
  sampleRate?: number;
  /** Diagnostics: called with every batch of probabilities (index of the first frame, the probabilities). */
  onProbs?: (firstFrame: number, probs: Float32Array) => void;
  /** Cancel: push() / flush() reject before the next model call once the signal is aborted. */
  signal?: AbortSignal;
}

export interface VadStats {
  samples: number;
  frames: number;
  modelCalls: number;
  modelMs: number;
}

export class StreamingVad {
  private seg: SpeechSegmenter;
  private readonly batchFrames: number;
  private readonly onProbs?: (firstFrame: number, probs: Float32Array) => void;
  private readonly signal?: AbortSignal;
  private readonly buf: Float32Array;
  private fill = 0; // samples currently in buf
  private total = 0; // samples pushed so far
  private done = false;
  private calls = 0;
  private modelMs = 0;
  private framesRun = 0;
  /** Calls are serialised: a decoder callback may call push() without awaiting the previous one. */
  private tail: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly model: FrameModel,
    private readonly params: VadParams,
    opts: StreamingVadOptions = {},
  ) {
    if ((opts.sampleRate ?? SAMPLE_RATE) !== SAMPLE_RATE) {
      throw new Error('Silero VAD needs 16 kHz audio');
    }
    this.batchFrames = Math.max(1, Math.floor(opts.batchFrames ?? 256));
    this.onProbs = opts.onProbs;
    this.signal = opts.signal;
    this.buf = new Float32Array(this.batchFrames * FRAME);
    this.seg = new SpeechSegmenter(params);
    // a new StreamingVad is a new stream: never inherit LSTM state / context from a previous one
    this.model.reset();
  }

  /** Samples pushed so far. */
  get samplesSeen(): number {
    return this.total;
  }

  /** Audio before this sample index can no longer belong to a segment that is still to be returned. */
  get retainFrom(): number {
    return this.seg.retainFrom;
  }

  get stats(): VadStats {
    return {
      samples: this.total,
      frames: this.framesRun,
      modelCalls: this.calls,
      modelMs: this.modelMs,
    };
  }

  /** Start a new stream with the same model and options. */
  reset(): void {
    this.model.reset();
    this.seg = new SpeechSegmenter(this.params);
    this.fill = 0;
    this.total = 0;
    this.done = false;
    this.calls = 0;
    this.modelMs = 0;
    this.framesRun = 0;
  }

  /**
   * Feed the next block of 16 kHz mono float samples (any length, including 0).
   * By default the block is copied, so the caller may reuse its buffer as soon as push() returns. Pass
   * `copy = false` only if the block stays untouched until the returned promise resolves.
   */
  push(chunk: Float32Array, copy = true): Promise<SpeechSegment[]> {
    const block = copy ? chunk.slice() : chunk;
    return this.enqueue(() => this.pushNow(block));
  }

  /** End of stream: judge the zero-padded tail frame and close the open segment. */
  flush(): Promise<SpeechSegment[]> {
    return this.enqueue(() => this.flushNow());
  }

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const p = this.tail.then(fn, fn);
    this.tail = p.catch(() => undefined);
    return p;
  }

  private async pushNow(chunk: Float32Array): Promise<SpeechSegment[]> {
    if (this.done) throw new Error('StreamingVad: stream already flushed (call reset())');
    const out: SpeechSegment[] = [];
    let off = 0;
    while (off < chunk.length) {
      const take = Math.min(this.buf.length - this.fill, chunk.length - off);
      this.buf.set(chunk.subarray(off, off + take), this.fill);
      this.fill += take;
      this.total += take;
      off += take;
      if (this.fill === this.buf.length) {
        const probs = await this.run(this.buf, this.batchFrames);
        for (const s of this.seg.pushProbs(probs)) out.push(s);
        this.fill = 0;
      }
    }
    return out;
  }

  private async flushNow(): Promise<SpeechSegment[]> {
    if (this.done) throw new Error('StreamingVad: stream already flushed (call reset())');
    this.done = true;
    const out: SpeechSegment[] = [];
    const whole = Math.floor(this.fill / FRAME);
    const rem = this.fill - whole * FRAME;
    // faster-whisper pads with 512 - len % 512 zeros: a stream that is already a multiple of 512 gets a
    // full extra frame of zeros. The padded frame also has its last 64 samples zeroed (a quirk of its
    // context code, copied so that the tail frame is bit-identical).
    const last = this.buf.subarray(whole * FRAME, (whole + 1) * FRAME);
    last.fill(0, rem);
    last.fill(0, FRAME - CONTEXT);
    const probs = await this.run(this.buf, whole + 1);
    for (const s of this.seg.pushProbs(probs, true)) out.push(s);
    for (const s of this.seg.finish(this.total)) out.push(s);
    return out;
  }

  private async run(frames: Float32Array, n: number): Promise<Float32Array> {
    this.signal?.throwIfAborted();
    const t0 = performance.now();
    const input = n === this.batchFrames ? frames : frames.subarray(0, n * FRAME);
    const probs = await this.model.predict(input, n);
    this.modelMs += performance.now() - t0;
    this.onProbs?.(this.framesRun, probs);
    this.calls++;
    this.framesRun += n;
    return probs;
  }
}

/** Convenience: whole file in one go (push + flush). */
export async function detectSpeech(
  model: FrameModel,
  samples: Float32Array,
  params: VadParams,
  opts: StreamingVadOptions = {},
): Promise<SpeechSegment[]> {
  const vad = new StreamingVad(model, params, opts);
  const out = await vad.push(samples, false);
  out.push(...(await vad.flush()));
  return out;
}

/**
 * Keeps only the part of a stream that a pending segment can still need, so that decoding a 3-hour file
 * does not require 700 MB of float32. append() every decoded block, slice() a segment,
 * discardBefore(vad.retainFrom).
 */
export class AudioRing {
  private blocks: { start: number; data: Float32Array }[] = [];
  private tailEnd = 0;

  /** Absolute index one past the last appended sample. */
  get end(): number {
    return this.tailEnd;
  }

  /** Absolute index of the first retained sample. */
  get start(): number {
    return this.blocks.length ? this.blocks[0].start : this.tailEnd;
  }

  get retainedSamples(): number {
    return this.tailEnd - this.start;
  }

  /** The block is kept by reference unless `copy` is true (use it if the decoder reuses its buffers). */
  append(block: Float32Array, copy = false): void {
    if (block.length === 0) return;
    this.blocks.push({ start: this.tailEnd, data: copy ? block.slice() : block });
    this.tailEnd += block.length;
  }

  /** Copy of samples [start, end). Throws if part of the range was discarded or is not decoded yet. */
  slice(start: number, end: number): Float32Array {
    if (start < this.start || end > this.tailEnd || start > end) {
      throw new RangeError(
        `AudioRing.slice(${start}, ${end}) outside retained [${this.start}, ${this.tailEnd})`,
      );
    }
    const out = new Float32Array(end - start);
    let o = 0;
    for (const b of this.blocks) {
      const bEnd = b.start + b.data.length;
      if (bEnd <= start) continue;
      if (b.start >= end) break;
      const from = Math.max(start, b.start) - b.start;
      const to = Math.min(end, bEnd) - b.start;
      out.set(b.data.subarray(from, to), o);
      o += to - from;
    }
    return out;
  }

  /** Drop whole blocks that end at or before `sample`. */
  discardBefore(sample: number): void {
    let drop = 0;
    while (
      drop < this.blocks.length &&
      this.blocks[drop].start + this.blocks[drop].data.length <= sample
    ) {
      drop++;
    }
    if (drop) this.blocks.splice(0, drop);
  }
}
