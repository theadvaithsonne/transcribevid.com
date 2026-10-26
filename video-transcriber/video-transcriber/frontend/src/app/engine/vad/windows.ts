/**
 * Audio windowing: turn VAD speech segments into recogniser windows (<= 30 s for Whisper, <= 25 s for Qwen).
 *
 * Two shapes are produced by the same planner (option `splice`):
 *
 *  splice = true   faster-whisper's `collect_chunks`: whole speech segments are packed one after the other
 *                  into windows of at most `maxWindow` seconds of speech; the silence between them is dropped,
 *                  so a window is the concatenation of several pieces of the original audio. A word's time
 *                  inside the window is mapped back with a SpeechTimestampsMap-style lookup (makeTimeMap).
 *  splice = false  qwen_engine.chunks(): a window is one contiguous span of the original audio. Gaps shorter
 *                  than `mergeGap` stay inside the window, longer gaps are skipped; over-long spans are cut at
 *                  the middle of a pause, or hard (with `forcedStart` set) when the speech has none.
 *
 * All offsets are absolute sample indices of the 16 kHz stream, so a caller can transcribe a window, then add
 * the offset back (contiguous) or map through the pieces (spliced). planWindows is a pure function.
 */
import { pyRound as exactPyRound } from '../post/py';
import { FRAME, SAMPLE_RATE, SpeechSegment } from './types';

export interface PlanOptions {
  /** Longest audio fed to the recogniser per window, seconds. Default 30 (Whisper's receptive field). */
  maxWindow?: number;
  /** Extra context added to both sides of every input segment, seconds. Default 0 (VAD output is padded). */
  pad?: number;
  /** Segments whose gap is shorter than this are joined into one contiguous piece (gap kept). Default 0. */
  mergeGap?: number;
  /** true: pack several pieces per window (faster-whisper). false: one contiguous piece per window (Qwen). */
  splice?: boolean;
  /**
   * Over-long pieces are cut at the last pause that lies at least `preferBreak * maxWindow` into the window.
   * Default 0: any pause will do (never cut inside speech while a pause exists).
   */
  preferBreak?: number;
  /** true = no pause in the preferred range cuts hard (qwen_engine). false = fall back to an earlier pause. */
  strictPreferred?: boolean;
  /** Extra cut candidates inside long speech (absolute samples), e.g. quiet frames from pausesFromProbs(). */
  pauses?: ArrayLike<number>;
  sampleRate?: number;
}

/** faster-whisper: 30 s windows, speech packed back to back, silence dropped. */
export const WHISPER_PLAN: PlanOptions = { maxWindow: 30, mergeGap: 0, splice: true };
/** qwen_engine.chunks: 25 s contiguous chunks, gaps >= 2 s skipped, cut at a pause >= 60 % in, else hard. */
export const QWEN_PLAN: PlanOptions = {
  maxWindow: 25,
  mergeGap: 2,
  splice: false,
  preferBreak: 0.6,
  strictPreferred: true,
};
/**
 * The UI's "VAD off" option: the whole file is one speech interval cut into 30 s windows. Without a VAD there
 * is no pause information, so the caller passes `pauses` from `pausesFromProbs()` of the energy model and the
 * windows are cut in quiet valleys instead of every 30.000 s (vad.md 6.4). Not identical to Python, where
 * Whisper picks its own cut points from its timestamps; it is the closest browser equivalent.
 */
export const VAD_OFF_PLAN: PlanOptions = { maxWindow: 30, mergeGap: 0, splice: false };

/** `planWindows([{ start: 0, end: totalSamples }], totalSamples, { ...VAD_OFF_PLAN, pauses })`. */
export function planWithoutVad(
  totalSamples: number,
  pauses?: ArrayLike<number>,
  options: PlanOptions = {},
): Window[] {
  const total = Math.max(0, Math.floor(totalSamples));
  return planWindows([{ start: 0, end: total }], total, { ...VAD_OFF_PLAN, ...options, pauses });
}

export interface Piece {
  /** absolute start sample (inclusive) */
  start: number;
  /** absolute end sample (exclusive) */
  end: number;
  /** where this piece begins inside the window's audio (samples) */
  local: number;
}

export interface Window {
  index: number;
  pieces: Piece[];
  /** samples of audio fed to the recogniser (= sum of the piece lengths, <= maxWindow) */
  length: number;
  /** first absolute sample covered */
  start: number;
  /** last absolute sample covered + 1 */
  end: number;
  /**
   * The window begins where the previous one was cut hard (no pause was in reach), so the speech may continue
   * across the boundary: Qwen re-decodes ~2 s of earlier audio and trims the repeated words (`overlap`).
   */
  forcedStart: boolean;
}

interface RawPiece {
  start: number;
  end: number;
  forcedStart: boolean;
}

interface Group {
  start: number;
  end: number;
  breaks: number[];
}

/** The last break <= limit (the breaks are sorted), or -1. */
function lastAtMost(breaks: number[], limit: number): number {
  let lo = 0;
  let hi = breaks.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (breaks[mid] <= limit) lo = mid + 1;
    else hi = mid;
  }
  return lo ? breaks[lo - 1] : -1;
}

export function planWindows(
  speech: readonly SpeechSegment[],
  totalSamples: number,
  options: PlanOptions = {},
): Window[] {
  const sr = options.sampleRate ?? SAMPLE_RATE;
  const max = Math.floor((options.maxWindow ?? 30) * sr);
  if (!(max > 0) || !Number.isFinite(max)) {
    throw new RangeError('maxWindow must be a positive number of seconds');
  }
  const pad = Math.round((options.pad ?? 0) * sr);
  const mergeGap = (options.mergeGap ?? 0) * sr;
  const splice = options.splice ?? true;
  const prefer = options.preferBreak ?? 0;
  const strict = options.strictPreferred ?? false;
  const total = Math.max(0, Math.floor(totalSamples));

  // 1. clamp, pad, sort, fuse overlapping segments. Touching ones stay separate: the VAD ended one there, so
  //    the boundary is a legitimate place to cut (with the defaults 500-800 ms pauses come out as touching
  //    segments).
  const segs: SpeechSegment[] = [];
  for (const s of speech) {
    const start = Math.max(0, Math.floor(s.start) - pad);
    const end = Math.min(total, Math.floor(s.end) + pad);
    if (end > start) segs.push({ start, end });
  }
  segs.sort((a, b) => a.start - b.start || a.end - b.end);
  const fused: SpeechSegment[] = [];
  for (const s of segs) {
    const last = fused[fused.length - 1];
    if (last && s.start < last.end) last.end = Math.max(last.end, s.end);
    else fused.push({ ...s });
  }

  // 2. group segments separated by less than mergeGap; remember the pauses inside a group
  const extra = options.pauses ? Array.from(options.pauses).sort((a, b) => a - b) : [];
  const groups: Group[] = [];
  for (const s of fused) {
    const g = groups[groups.length - 1];
    if (g && s.start - g.end < mergeGap) {
      g.breaks.push(Math.floor((g.end + s.start) / 2)); // middle of the pause, like qwen_engine
      g.end = s.end;
    } else {
      groups.push({ start: s.start, end: s.end, breaks: [] });
    }
  }
  for (const g of groups) {
    for (const p of extra) if (p > g.start && p < g.end) g.breaks.push(Math.floor(p));
    g.breaks = Array.from(new Set(g.breaks)).sort((a, b) => a - b);
  }

  // 3. cut groups longer than the window at the last pause in reach (binary search in the sorted breaks);
  //    if even that one lies before the preferred range there is no preferred pause at all
  const pieces: RawPiece[] = [];
  for (const g of groups) {
    let start = g.start;
    let forced = false;
    while (start < g.end) {
      let end = Math.min(g.end, start + max);
      let nextForced = false;
      if (end < g.end) {
        const p = lastAtMost(g.breaks, end);
        if (p > start && (p >= start + prefer * max || !strict)) end = p;
        else nextForced = true;
      }
      pieces.push({ start, end, forcedStart: forced });
      start = end;
      forced = nextForced;
    }
  }

  // 4. pack
  const windows: Window[] = [];
  const emit = (ps: RawPiece[]): void => {
    const merged: Piece[] = [];
    let local = 0;
    for (const p of ps) {
      const prev = merged[merged.length - 1];
      if (prev && prev.end === p.start) {
        prev.end = p.end; // adjacent pieces of one window are one contiguous span
      } else {
        merged.push({ start: p.start, end: p.end, local });
      }
      local += p.end - p.start;
    }
    windows.push({
      index: windows.length,
      pieces: merged,
      length: local,
      start: merged[0].start,
      end: merged[merged.length - 1].end,
      forcedStart: ps[0].forcedStart,
    });
  };
  if (!splice) {
    for (const p of pieces) emit([p]);
  } else {
    let cur: RawPiece[] = [];
    let curLen = 0;
    for (const p of pieces) {
      const len = p.end - p.start;
      if (cur.length && curLen + len > max) {
        emit(cur);
        cur = [];
        curLen = 0;
      }
      cur.push(p);
      curLen += len;
    }
    if (cur.length) emit(cur);
  }
  return windows;
}

/** The audio of a window: a view for a contiguous window, a copy for a spliced one. */
export function windowAudio(samples: Float32Array, w: Window): Float32Array {
  if (w.pieces.length === 1) return samples.subarray(w.pieces[0].start, w.pieces[0].end);
  const out = new Float32Array(w.length);
  for (const p of w.pieces) out.set(samples.subarray(p.start, p.end), p.local);
  return out;
}

/**
 * Python's round(x, p): half to even on the EXACT binary value (round(2.675, 2) == 2.67). One implementation for the
 * whole engine (post/py.ts); the old local version tested ties after a rounded division and got 2.675 wrong.
 */
export function pyRound(v: number, p: number): number {
  return exactPyRound(v, p);
}

export interface TimeMap {
  /**
   * Window-local time (s) -> absolute time (s). Same rule as faster_whisper.vad.SpeechTimestampsMap: a time
   * that falls exactly on the join of two pieces belongs to the next piece when it is a start and to the
   * previous one when `isEnd`. `precision` rounds like faster-whisper (it uses 2 decimals).
   */
  toAbsolute(t: number, isEnd?: boolean, precision?: number): number;
  /** A word / segment span: both ends are resolved in the piece that contains the middle (faster-whisper). */
  mapSpan(start: number, end: number, precision?: number): { start: number; end: number };
}

export function makeTimeMap(w: Window, sampleRate: number = SAMPLE_RATE): TimeMap {
  const ends = w.pieces.map((p) => p.local + (p.end - p.start)); // like chunk_end_sample
  const pieceAt = (t: number, isEnd: boolean): number => {
    const sample = Math.trunc(t * sampleRate);
    if (isEnd) {
      const k = ends.indexOf(sample);
      if (k >= 0) return k;
    }
    // bisect.bisect: number of piece ends <= sample
    let lo = 0;
    let hi = ends.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sample < ends[mid]) hi = mid;
      else lo = mid + 1;
    }
    return Math.min(lo, ends.length - 1);
  };
  const toAbs = (t: number, k: number, precision?: number): number => {
    const p = w.pieces[k];
    const v = (p.start - p.local) / sampleRate + t;
    return precision === undefined ? v : pyRound(v, precision);
  };
  return {
    toAbsolute: (t, isEnd = false, precision) => toAbs(t, pieceAt(t, isEnd), precision),
    mapSpan: (start, end, precision) => {
      const k = pieceAt((start + end) / 2, false);
      return { start: toAbs(start, k, precision), end: toAbs(end, k, precision) };
    },
  };
}

// ---------------------------------------------------------------------------------------------------------
// Literal ports of faster_whisper.vad.collect_chunks / SpeechTimestampsMap (the oracles for the specs)
// ---------------------------------------------------------------------------------------------------------

export interface ChunkMeta {
  /** start of the merged chunk on the speech-only timeline, seconds */
  offset: number;
  /** length of the merged chunk, seconds */
  duration: number;
  segments: SpeechSegment[];
}

/**
 * faster_whisper.vad.collect_chunks without the audio: how speech segments are merged into chunks of at most
 * `maxDuration` seconds. faster-whisper 1.2.1 forgets to add the first segment of every chunk but the first
 * to `segments` (it only goes into the audio); `faithful` reproduces that, the default lists all of them.
 */
export function collectChunks(
  chunks: readonly SpeechSegment[],
  maxDuration = Infinity,
  sampleRate: number = SAMPLE_RATE,
  faithful = false,
): ChunkMeta[] {
  if (!chunks.length) return [{ offset: 0, duration: 0, segments: [] }];
  const meta: ChunkMeta[] = [];
  let current: SpeechSegment[] = [];
  let currentDuration = 0;
  let totalDuration = 0;
  let first = true;
  for (const chunk of chunks) {
    const len = chunk.end - chunk.start;
    if (currentDuration + len > maxDuration * sampleRate) {
      if (!first || faithful) {
        meta.push({
          offset: totalDuration / sampleRate,
          duration: currentDuration / sampleRate,
          segments: current,
        });
        totalDuration += currentDuration;
      }
      current = faithful ? [] : [chunk];
      currentDuration = len;
    } else {
      current.push(chunk);
      currentDuration += len;
    }
    first = false;
  }
  meta.push({
    offset: totalDuration / sampleRate,
    duration: currentDuration / sampleRate,
    segments: current,
  });
  return meta;
}

/** faster_whisper.vad.SpeechTimestampsMap: speech-only timeline -> original audio. */
export class SpeechTimestampsMap {
  private readonly chunkEnd: number[] = [];
  private readonly silenceBefore: number[] = [];

  constructor(
    chunks: readonly SpeechSegment[],
    private readonly sampleRate: number = SAMPLE_RATE,
    private readonly precision = 2,
  ) {
    let previousEnd = 0;
    let silent = 0;
    for (const c of chunks) {
      silent += c.start - previousEnd;
      previousEnd = c.end;
      this.chunkEnd.push(c.end - silent);
      this.silenceBefore.push(silent / sampleRate);
    }
  }

  getOriginalTime(time: number, chunkIndex?: number, isEnd = false): number {
    const k = chunkIndex ?? this.getChunkIndex(time, isEnd);
    return pyRound(this.silenceBefore[k] + time, this.precision);
  }

  getChunkIndex(time: number, isEnd = false): number {
    const sample = Math.trunc(time * this.sampleRate);
    if (isEnd) {
      const k = this.chunkEnd.indexOf(sample);
      if (k >= 0) return k;
    }
    let lo = 0;
    let hi = this.chunkEnd.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sample < this.chunkEnd[mid]) hi = mid;
      else lo = mid + 1;
    }
    return Math.min(lo, this.chunkEnd.length - 1);
  }
}

/**
 * Pause candidates for `planWindows({ pauses })` when there is no VAD segmentation (vad = false) or when a
 * speech segment is longer than a window: the middle of every run of at least `minFrames` frames whose
 * speech probability is below `negThreshold`. Positions are absolute sample indices. Works with any
 * FrameModel's probabilities (the pure-TypeScript energy model is enough: a quiet valley does not need Silero).
 */
export function pausesFromProbs(
  probs: ArrayLike<number>,
  options: { negThreshold?: number; minFrames?: number; firstFrame?: number } = {},
): number[] {
  const neg = options.negThreshold ?? 0.3;
  const minFrames = options.minFrames ?? 4;
  const base = options.firstFrame ?? 0;
  const out: number[] = [];
  let runStart = -1;
  for (let i = 0; i <= probs.length; i++) {
    const quiet = i < probs.length && probs[i] < neg;
    if (quiet && runStart < 0) runStart = i;
    if (!quiet && runStart >= 0) {
      if (i - runStart >= minFrames) {
        out.push(Math.floor(((base + runStart + base + i) / 2) * FRAME));
      }
      runStart = -1;
    }
  }
  return out;
}
