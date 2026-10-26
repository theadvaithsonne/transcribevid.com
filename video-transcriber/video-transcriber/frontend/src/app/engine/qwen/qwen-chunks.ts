/**
 * The chunk plan and the per-chunk loop of backend/app/qwen_engine.py (`chunks()` and `QwenEngine.transcribe`), for
 * the browser. Nothing here touches a model runtime: the loop drives a caller-supplied `decode(startSample,
 * endSample)` (the QwenEngine in the worker, a fake in the specs).
 *
 * The plan comes from engine/vad (`StreamingVad(QWEN_VAD)` + `planWindows(..., QWEN_PLAN)`), which reproduces
 * `chunks()`: 25 s chunks cut at the last pause after 60 % of the window, gaps of 2 s or more skipped, `overlap` only
 * for a forced cut inside continuous speech; offsets always refer to the original audio. `planChunks` below is the
 * spike's literal port of `chunks()`, kept as the oracle of the specs.
 *
 * Segments have exactly the server's shape: chunk timing (`timing: 'chunk'`), `words: null`, `confidence: null`,
 * `text` = `original_text`, `recognition_text`, `overlap_words_removed`, `boundary_resolution`, `review_reasons`, and
 * `overlap_recognition_text` after a boundary retry. The Hinglish step is the page's (it owns the IndicXlit worker):
 * every segment carries the language the server would convert it with (`detected or language`).
 */
import type { Segment } from '../../core/models';
import { pyRound } from '../post/py';
import type { Window } from '../vad/windows';
import { pyWsStrip, repeatedPhrase, trimOverlap } from './qwen-text';

export const SAMPLE_RATE = 16000;
/** qwen_engine.chunks(seconds=25) */
export const CHUNK_SECONDS = 25;

export interface QwenChunk {
  start: number;
  end: number;
  /** a forced cut inside continuous speech: re-decode up to 2 s before it and trim the repeated words */
  overlap: boolean;
}

/** The server's Qwen segment (core/models Segment plus the adapter's review fields). */
export interface QwenSegment extends Segment {
  original_text: string;
  recognition_text: string;
  overlap_words_removed: number;
  boundary_resolution: 'pause' | 'exact_overlap' | 'audio_retry';
  review_reasons: string[];
  overlap_recognition_text?: string;
  timing: 'chunk';
  words: null;
  confidence: null;
  edited: false;
}

/** What one model pass returns: the parsed text and the language code it detected (null when unknown). */
export interface ChunkDecodeResult {
  text: string;
  language: string | null;
}

export class QwenCancelled extends Error {
  constructor() {
    super('cancelled');
    this.name = 'CancelledError';
  }
}

/** Literal port of qwen_engine.chunks() (the spike's planChunks); `speech` null = VAD off (the whole file). */
export function planChunks(
  totalSamples: number,
  speech: readonly { start: number; end: number }[] | null,
  seconds = CHUNK_SECONDS,
): QwenChunk[] {
  const step = Math.trunc(seconds * SAMPLE_RATE);
  if (step <= 0) throw new RangeError('Chunk duration must be positive.');
  const iv = speech ?? [{ start: 0, end: totalSamples }];
  if (!iv.length) return [];
  const groups: { start: number; end: number }[][] = [];
  let group: { start: number; end: number }[] = [];
  for (const interval of iv) {
    if (group.length && interval.start - group[group.length - 1].end >= 2 * SAMPLE_RATE) {
      groups.push(group);
      group = [];
    }
    group.push(interval);
  }
  groups.push(group);
  const plan: QwenChunk[] = [];
  for (const g of groups) {
    let start = g[0].start;
    const stop = g[g.length - 1].end;
    const breaks: number[] = [];
    for (let i = 0; i + 1 < g.length; i++) {
      if (g[i + 1].start > g[i].end) breaks.push(Math.floor((g[i].end + g[i + 1].start) / 2));
    }
    let overlap = false;
    while (start < stop) {
      let end = Math.min(stop, start + step);
      const nearby = breaks.filter((p) => start + step * 0.6 <= p && p <= end);
      let forced = end < stop;
      if (forced && nearby.length) {
        end = nearby[nearby.length - 1];
        forced = false;
      }
      plan.push({ start, end, overlap });
      start = end;
      overlap = forced;
    }
  }
  return plan;
}

/** The QWEN_PLAN windows of engine/vad as the adapter's chunks (they are contiguous: one piece each). */
export function chunksFromWindows(windows: readonly Window[]): QwenChunk[] {
  return windows.map((w) => ({ start: w.start, end: w.end, overlap: w.forcedStart }));
}

/** Where a recycled loop continues (plain data, it crosses the worker boundary). */
export interface QwenLoopState {
  /** index of the next chunk of the plan */
  next: number;
  /** recognition text of the last chunk with text ('' after an empty one) */
  previousText: string;
  /** the job language (forced, or the first one detected) */
  language: string | null;
  /** segments emitted so far (the next segment id) */
  emitted: number;
  /** chunks decoded so far in the whole run (for the recycle) */
  chunksDone: number;
}

export interface QwenLoopOptions {
  totalSamples: number;
  plan: readonly QwenChunk[];
  decode: (start: number, end: number) => Promise<ChunkDecodeResult>;
  /** the language the user chose (null = detect) */
  language?: string | null;
  state?: QwenLoopState;
  /**
   * Called for every segment, in order: `progress` = chunk end / audio length (the server's on_segment progress),
   * `romanizeLanguage` = `detected or language`, the language the server converts that segment with.
   */
  onSegment?: (seg: QwenSegment, progress: number, info: { language: string | null; romanizeLanguage: string | null }) => void;
  shouldCancel?: () => boolean;
  /** stop after this many decoded chunks in this call and hand back the state (0 = never) */
  recycleEvery?: number;
}

export type QwenLoopOutcome =
  | { kind: 'done'; language: string | null; segments: QwenSegment[]; state: QwenLoopState }
  | { kind: 'recycle'; state: QwenLoopState; segments: QwenSegment[] };

/**
 * The per-chunk loop of QwenEngine.transcribe: decode, exact overlap trim (or one retry of the non-overlapping audio),
 * review reasons, the server's segment dict. Throws QwenCancelled at the server's cancel points (before a chunk,
 * after every inference, so a cancel after the overlapped pass prevents the retry).
 */
export async function transcribeChunks(o: QwenLoopOptions): Promise<QwenLoopOutcome> {
  const st: QwenLoopState = o.state
    ? { ...o.state }
    : { next: 0, previousText: '', language: o.language ?? null, emitted: 0, chunksDone: 0 };
  const out: QwenSegment[] = [];
  const check = () => {
    if (o.shouldCancel?.()) throw new QwenCancelled();
  };
  let here = 0;
  while (st.next < o.plan.length) {
    check();
    if (o.recycleEvery && here >= o.recycleEvery) return { kind: 'recycle', state: st, segments: out };
    const { start, end, overlap } = o.plan[st.next];
    const overlapSamples = Math.min(2 * SAMPLE_RATE, Math.floor((end - start) / 4));
    const audioStart = st.previousText && overlap ? Math.max(0, start - overlapSamples) : start;
    let response = await o.decode(audioStart, end);
    check();
    let rawText = pyWsStrip(response.text);
    let text = rawText;
    let removed = 0;
    if (audioStart < start) [text, removed] = trimOverlap(st.previousText, rawText);
    let boundary: QwenSegment['boundary_resolution'] = 'pause';
    const reasons: string[] = [];
    let overlapText: string | null = null;
    if (audioStart < start) {
      if (removed) boundary = 'exact_overlap';
      else {
        // text-only fuzzy matching can delete real speech, names or code-switching: retry the non-overlapping audio
        overlapText = rawText;
        response = await o.decode(start, end);
        check();
        rawText = text = pyWsStrip(response.text);
        boundary = 'audio_retry';
        reasons.push('boundary_retry');
      }
    }
    st.next++;
    st.chunksDone++;
    here++;
    const detected = response.language ?? null;
    st.language = st.language ?? detected;
    if (!text) {
      st.previousText = '';
      continue;
    }
    st.previousText = rawText;
    if (repeatedPhrase(text)) reasons.push('repeated_phrase');
    const seg: QwenSegment = {
      id: st.emitted,
      start: pyRound(start / SAMPLE_RATE, 2),
      end: pyRound(end / SAMPLE_RATE, 2),
      text,
      original_text: text,
      recognition_text: rawText,
      overlap_words_removed: removed,
      boundary_resolution: boundary,
      review_reasons: reasons,
      words: null,
      confidence: null,
      timing: 'chunk',
      edited: false,
    };
    if (overlapText !== null) seg.overlap_recognition_text = overlapText;
    st.emitted++;
    out.push(seg);
    o.onSegment?.(seg, end / o.totalSamples, { language: st.language, romanizeLanguage: detected || st.language });
  }
  check();
  return { kind: 'done', language: st.language, segments: out, state: st };
}

/** qwen_asr pads chunks shorter than 0.5 s with zeros at the end (MIN_ASR_INPUT_SECONDS). */
export function padChunk(audio: Float32Array, minSeconds = 0.5): Float32Array {
  const min = Math.floor(minSeconds * SAMPLE_RATE);
  if (audio.length >= min) return audio;
  const out = new Float32Array(min);
  out.set(audio);
  return out;
}
