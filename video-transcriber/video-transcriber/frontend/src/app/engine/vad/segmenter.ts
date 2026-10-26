/**
 * Speech segmentation on top of per-frame speech probabilities: a faithful TypeScript port of
 * `faster_whisper.vad.get_speech_timestamps` (faster-whisper 1.2.1, the version in backend/.venv), in two shapes:
 *
 *  - speechTimestampsFromProbs(): a literal, non-incremental port. It is the oracle the specs compare against
 *    (and it is itself checked against the real Python output on every golden fixture).
 *  - SpeechSegmenter: the same state machine fed probability batches as they arrive. Segments come out as soon
 *    as their padded end is known; the concatenation of everything it returns equals the oracle's output for
 *    any batching (property-tested).
 *
 * Semantics worth knowing (all inherited from faster-whisper, deliberately kept):
 *  - the probability array covers floor(len / 512) + 1 frames: the stream is zero-padded to a multiple of 512
 *    and a stream whose length is already a multiple gets one extra all-zero frame;
 *  - hysteresis: speech starts at prob >= threshold, a pause only counts once prob < negThreshold;
 *  - max speech: past maxSpeechDurationS the segment is cut at the last pause longer than 98 ms, else hard;
 *  - minSpeechDurationMs only filters the pause-terminated branch and the trailing segment, not max-speech cuts;
 *  - padding: first segment start - pad, last segment end + pad, neighbours share a gap smaller than 2 x pad.
 */
import { FRAME, SAMPLE_RATE, SpeechSegment, VadParams } from './types';

/** faster-whisper: min_silence_samples_at_max_speech = sampling_rate * 98 / 1000 */
const MIN_SILENCE_AT_MAX_MS = 98;

interface Derived {
  threshold: number;
  negThreshold: number;
  minSpeechSamples: number;
  padSamples: number;
  maxSpeechSamples: number;
  minSilenceSamples: number;
  minSilenceAtMax: number;
}

function derive(p: VadParams, sampleRate: number): Derived {
  // numpy 2 (NEP 50) compares a float32 probability with a Python float after converting the float to
  // float32, so the effective thresholds are the float32-rounded values.
  const threshold = Math.fround(p.threshold);
  const neg = p.negThreshold ?? Math.max(p.threshold - 0.15, 0.01);
  const padSamples = (sampleRate * p.speechPadMs) / 1000;
  return {
    threshold,
    negThreshold: Math.fround(neg),
    minSpeechSamples: (sampleRate * p.minSpeechDurationMs) / 1000,
    padSamples,
    maxSpeechSamples: sampleRate * p.maxSpeechDurationS - FRAME - 2 * padSamples,
    minSilenceSamples: (sampleRate * p.minSilenceDurationMs) / 1000,
    minSilenceAtMax: (sampleRate * MIN_SILENCE_AT_MAX_MS) / 1000,
  };
}

// ---------------------------------------------------------------------------------------------------------
// Literal port (oracle)
// ---------------------------------------------------------------------------------------------------------

/**
 * @param probs one probability per 512-sample frame, exactly as faster-whisper computes them (zero-padded tail)
 * @param audioLengthSamples the real number of samples (not the padded one)
 */
export function speechTimestampsFromProbs(
  probs: ArrayLike<number>,
  audioLengthSamples: number,
  params: VadParams,
  sampleRate: number = SAMPLE_RATE,
): SpeechSegment[] {
  const d = derive(params, sampleRate);
  let triggered = false;
  const speeches: SpeechSegment[] = [];
  let curStart: number | undefined;
  let tempEnd = 0;
  let prevEnd = 0;
  let nextStart = 0;

  for (let i = 0; i < probs.length; i++) {
    const speechProb = probs[i];
    const pos = FRAME * i;

    if (speechProb >= d.threshold && tempEnd) {
      tempEnd = 0;
      if (nextStart < prevEnd) nextStart = pos;
    }

    if (speechProb >= d.threshold && !triggered) {
      triggered = true;
      curStart = pos;
      continue;
    }

    if (triggered && pos - (curStart as number) > d.maxSpeechSamples) {
      if (prevEnd) {
        speeches.push({ start: curStart as number, end: prevEnd });
        curStart = undefined;
        if (nextStart < prevEnd) {
          triggered = false;
        } else {
          curStart = nextStart;
        }
        prevEnd = nextStart = tempEnd = 0;
      } else {
        speeches.push({ start: curStart as number, end: pos });
        curStart = undefined;
        prevEnd = nextStart = tempEnd = 0;
        triggered = false;
        continue;
      }
    }

    if (speechProb < d.negThreshold && triggered) {
      if (!tempEnd) tempEnd = pos;
      if (pos - tempEnd > d.minSilenceAtMax) prevEnd = tempEnd;
      if (pos - tempEnd < d.minSilenceSamples) {
        continue;
      }
      if (tempEnd - (curStart as number) > d.minSpeechSamples) {
        speeches.push({ start: curStart as number, end: tempEnd });
      }
      curStart = undefined;
      prevEnd = nextStart = tempEnd = 0;
      triggered = false;
      continue;
    }
  }

  if (curStart !== undefined && audioLengthSamples - curStart > d.minSpeechSamples) {
    speeches.push({ start: curStart, end: audioLengthSamples });
  }

  // padding / neighbour sharing
  const pad = d.padSamples;
  for (let i = 0; i < speeches.length; i++) {
    const s = speeches[i];
    if (i === 0) s.start = Math.trunc(Math.max(0, s.start - pad));
    if (i !== speeches.length - 1) {
      const next = speeches[i + 1];
      const silence = next.start - s.end;
      if (silence < 2 * pad) {
        const half = Math.floor(silence / 2);
        s.end += half;
        next.start = Math.trunc(Math.max(0, next.start - half));
      } else {
        s.end = Math.trunc(Math.min(audioLengthSamples, s.end + pad));
        next.start = Math.trunc(Math.max(0, next.start - pad));
      }
    } else {
      s.end = Math.trunc(Math.min(audioLengthSamples, s.end + pad));
    }
  }
  return speeches;
}

// ---------------------------------------------------------------------------------------------------------
// Incremental segmenter
// ---------------------------------------------------------------------------------------------------------

interface Pending {
  /** padded start, final */
  paddedStart: number;
  /** raw (unpadded) end */
  rawEnd: number;
}

export class SpeechSegmenter {
  private readonly d: Derived;
  private frames = 0; // frames consumed so far
  private triggered = false;
  private curStart: number | undefined;
  private tempEnd = 0;
  private prevEnd = 0;
  private nextStart = 0;
  /** last accepted raw segment, waiting for its end padding */
  private prev: Pending | null = null;
  /** padded start of the open segment when it was already settled while emitting `prev` early */
  private stashedStart: number | undefined;
  private finished = false;

  constructor(
    private readonly params: VadParams,
    private readonly sampleRate: number = SAMPLE_RATE,
  ) {
    this.d = derive(params, sampleRate);
  }

  /** Number of frames consumed (the next frame has index framesConsumed). */
  get framesConsumed(): number {
    return this.frames;
  }

  /** First sample no frame has been judged for yet. */
  get position(): number {
    return this.frames * FRAME;
  }

  /**
   * Lowest sample index that a segment not yet returned can still start at. Audio before it is no longer
   * needed to cut future segments (a decoder may drop it).
   */
  get retainFrom(): number {
    const d = this.d;
    // a segment that has not started yet starts at >= position and is padded by at most `pad` on the left
    let low = Math.max(0, Math.trunc(this.position - d.padSamples));
    if (this.prev) low = Math.min(low, this.prev.paddedStart);
    if (this.triggered && this.curStart !== undefined) {
      low = Math.min(low, Math.max(0, Math.trunc(this.curStart - d.padSamples)));
    }
    return low;
  }

  /**
   * Feed the next probabilities. Returns the segments that are now complete (padded, final).
   * `last` marks the batch that ends the stream (it holds the zero-padded tail frame): early emission is
   * skipped because a segment opened on the very last frame may still be dropped by finish().
   */
  pushProbs(probs: ArrayLike<number>, last = false): SpeechSegment[] {
    if (this.finished) throw new Error('SpeechSegmenter: already finished');
    const d = this.d;
    const out: SpeechSegment[] = [];
    for (let k = 0; k < probs.length; k++) {
      const speechProb = probs[k];
      const pos = FRAME * this.frames;
      this.frames++;

      if (speechProb >= d.threshold && this.tempEnd) {
        this.tempEnd = 0;
        if (this.nextStart < this.prevEnd) this.nextStart = pos;
      }

      if (speechProb >= d.threshold && !this.triggered) {
        this.triggered = true;
        this.curStart = pos;
        continue;
      }

      if (this.triggered && pos - (this.curStart as number) > d.maxSpeechSamples) {
        if (this.prevEnd) {
          this.accept(this.curStart as number, this.prevEnd, out);
          this.curStart = undefined;
          if (this.nextStart < this.prevEnd) {
            this.triggered = false;
          } else {
            this.curStart = this.nextStart;
          }
          this.prevEnd = this.nextStart = this.tempEnd = 0;
        } else {
          this.accept(this.curStart as number, pos, out);
          this.curStart = undefined;
          this.prevEnd = this.nextStart = this.tempEnd = 0;
          this.triggered = false;
          continue;
        }
      }

      if (speechProb < d.negThreshold && this.triggered) {
        if (!this.tempEnd) this.tempEnd = pos;
        if (pos - this.tempEnd > d.minSilenceAtMax) this.prevEnd = this.tempEnd;
        if (pos - this.tempEnd < d.minSilenceSamples) continue;
        if (this.tempEnd - (this.curStart as number) > d.minSpeechSamples) {
          this.accept(this.curStart as number, this.tempEnd, out);
        }
        this.curStart = undefined;
        this.prevEnd = this.nextStart = this.tempEnd = 0;
        this.triggered = false;
        continue;
      }
    }
    if (!last) this.tryEmit(out);
    return out;
  }

  /** End of stream. `totalSamples` is the real sample count. Returns the remaining segments. */
  finish(totalSamples: number): SpeechSegment[] {
    if (this.finished) throw new Error('SpeechSegmenter: already finished');
    this.finished = true;
    const d = this.d;
    const out: SpeechSegment[] = [];
    if (this.curStart !== undefined && totalSamples - this.curStart > d.minSpeechSamples) {
      this.accept(this.curStart, totalSamples, out);
    }
    this.curStart = undefined;
    this.triggered = false;
    if (this.prev) {
      out.push({
        start: this.prev.paddedStart,
        end: Math.trunc(Math.min(totalSamples, this.prev.rawEnd + d.padSamples)),
      });
      this.prev = null;
    }
    return out;
  }

  /** A raw segment [start, end) has been decided. */
  private accept(start: number, end: number, out: SpeechSegment[]): void {
    const pad = this.d.padSamples;
    let paddedStart: number;
    if (this.stashedStart !== undefined) {
      paddedStart = this.stashedStart;
      this.stashedStart = undefined;
    } else if (this.prev) {
      const silence = start - this.prev.rawEnd;
      if (silence < 2 * pad) {
        const half = Math.floor(silence / 2);
        out.push({ start: this.prev.paddedStart, end: this.prev.rawEnd + half });
        paddedStart = Math.trunc(Math.max(0, start - half));
      } else {
        out.push({ start: this.prev.paddedStart, end: Math.trunc(this.prev.rawEnd + pad) });
        paddedStart = Math.trunc(Math.max(0, start - pad));
      }
      this.prev = null;
    } else {
      // very first segment, or the previous one was already closed because the gap is >= 2 x pad
      paddedStart = Math.trunc(Math.max(0, start - pad));
    }
    this.prev = { paddedStart, rawEnd: end };
  }

  /**
   * Emit `prev` early when nothing that can still happen changes its padded end:
   *  - the open segment starts >= 2 x pad after it (end + pad, whatever becomes of the open segment), or
   *  - the open segment is certain to be kept (minSpeech = 0) and starts closer: share the gap, or
   *  - nothing is open and the stream position is already >= 2 x pad past it.
   */
  private tryEmit(out: SpeechSegment[]): void {
    const prev = this.prev;
    if (!prev) return;
    const pad = this.d.padSamples;
    if (this.triggered && this.curStart !== undefined) {
      const gap = this.curStart - prev.rawEnd;
      if (gap >= 2 * pad) {
        out.push({ start: prev.paddedStart, end: Math.trunc(prev.rawEnd + pad) });
        this.prev = null;
      } else if (this.d.minSpeechSamples <= 0) {
        const half = Math.floor(gap / 2);
        out.push({ start: prev.paddedStart, end: prev.rawEnd + half });
        this.stashedStart = Math.trunc(Math.max(0, this.curStart - half));
        this.prev = null;
      }
    } else if (this.position >= prev.rawEnd + 2 * pad) {
      out.push({ start: prev.paddedStart, end: Math.trunc(prev.rawEnd + pad) });
      this.prev = null;
    }
  }
}
