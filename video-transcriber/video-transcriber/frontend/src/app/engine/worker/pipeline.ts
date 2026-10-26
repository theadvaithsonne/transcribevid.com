/**
 * The job pipeline of the in-browser engine (ARCHITECTURE.md section 3), as one async function with its I/O passed in
 * (`PipelineDeps`), so the worker runs it with the real decoder / VAD / Whisper and the specs with fakes.
 *
 *   decodeMedia (+ clean-up, 16 kHz) --chunks--> StreamingVad --> planWindows  .......... phase 'extracting'
 *   model manager: ensure the files (Cache API) --> WhisperEngine.load  ................. phase 'loading_model'
 *   faster-whisper's seek loop over the speech timeline (all speech pieces back to back) . phase 'transcribing'
 *     detect the language on up to 4 x 30 s (unless the user chose one)
 *     transcribeWindow(30 s from `seek`) -> no-speech window skip -> seek rule (consumedSeconds, last word)
 *     -> hallucination-silence guard (word timing on) -> times back to the original timeline
 *     -> segment filter (empty / made-up silence / repetition loop), confidence, original_text -> 'segments' event
 *
 * It mirrors faster-whisper 1.2.1 `transcribe(vad_filter=True)` + `generate_segments` and backend/app/engine.py
 * `_recognise`: the VAD's speech is joined into one timeline, windows restart at `seek` (never fixed 30 s steps), and
 * times are restored with SpeechTimestampsMap. VAD off = the whole file is the timeline.
 */
import type { Segment } from '../../core/models';
import type { LanguageResult, LoadInfo, LoadOptions, ProgressInfo, TranscribeOptions, WindowResult } from '../asr/types';
import { CancelledError } from '../asr/types';
import type { DecodeMediaOptions, DecodeResult } from '../audio';
import { int16ToFloat32 } from '../audio/pcm';
import { GuardSegment, getEnd, hallucinationGuard, shouldSkipWindow } from '../post/guards';
import { pyRound, pyStrip } from '../post/py';
import { RawSegment, SegmentFilter, segmentProgress, withOriginalText } from '../post/segment';
import { SpeechChunk, restoreSpeechTimestamps } from '../post/words';
import type { SpeechSegment } from '../vad/types';
import { WHISPER_PLAN, planWindows } from '../vad/windows';
import type { EngineEvent, FilterState, JobResult, ResumeState, RunRequest } from './protocol';

export const SAMPLE_RATE = 16000;
/** faster-whisper works in 10 ms mel frames: 160 samples */
export const FRAME_SAMPLES = 160;
export const FRAMES_PER_SECOND = 100;
/** one Whisper window: 30 s = 3000 frames */
export const WINDOW_FRAMES = 3000;
/** engine.py: language_detection_segments=4, language_detection_threshold=0.5 */
export const LANGUAGE_DETECTION_SEGMENTS = 4;
export const LANGUAGE_DETECTION_THRESHOLD = 0.5;
/** faster-whisper prompt_reset_on_temperature */
export const PROMPT_RESET_ON_TEMPERATURE = 0.5;
/** the engine needs at least 0.1 s of audio per window */
const MIN_WINDOW_SAMPLES = SAMPLE_RATE / 10;
export const QWEN_NOT_YET = 'Qwen3-ASR in the browser is being added; use Whisper for now.';

/** What the pipeline needs from WhisperEngine (engine/asr). */
export interface AsrEngine {
  readonly hasWordTimestamps: boolean;
  load(o: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo>;
  detectLanguage(audio: Float32Array): Promise<LanguageResult>;
  transcribeWindow(audio: Float32Array, o?: TranscribeOptions): Promise<WindowResult>;
  cancel(): void;
  dispose(): Promise<void>;
}

export interface VadLike {
  push(chunk: Float32Array): Promise<SpeechSegment[]>;
  flush(): Promise<SpeechSegment[]>;
}

export interface PipelineDeps {
  decode(file: Blob, o: DecodeMediaOptions): Promise<DecodeResult>;
  /** Silero (with the canary self-test and the energy fallback) behind StreamingVad(WHISPER_VAD) */
  createVad(signal: AbortSignal): Promise<VadLike>;
  createEngine(): AsrEngine;
  /** engine/models ModelManager.ensure: quota check, per-file download progress, then engine.load */
  ensureModel(
    id: string,
    device: 'webgpu' | 'wasm',
    engine: AsrEngine,
    o: { gpu: { shaderF16: boolean }; onProgress: (p: ProgressInfo) => void },
  ): Promise<unknown>;
}

export interface PipelineContext {
  signal: AbortSignal;
  emit: (e: EngineEvent) => void;
  /** the engine of this run, so a cancel message can reach its decoder loop */
  onEngine?: (engine: AsrEngine | null) => void;
}

export type PipelineOutcome = { kind: 'done'; result: JobResult } | { kind: 'recycle'; state: ResumeState };

/** An error with the page's text (userMessage) and the Logs page's text (technical). */
export class PipelineError extends Error {
  constructor(
    readonly code: string,
    readonly userMessage: string,
    readonly technical = userMessage,
  ) {
    super(userMessage);
    this.name = 'PipelineError';
  }
}

function filterState(f: SegmentFilter): FilterState {
  // SegmentFilter keeps its loop-breaker state private; it is plain data, read here for a recycle
  const s = f as unknown as { repeats: number; lastNorm: string | null; kept: number };
  return { repeats: s.repeats, lastNorm: s.lastNorm, kept: s.kept, dropped: { ...f.dropped } };
}

function restoreFilter(state: FilterState): SegmentFilter {
  const f = new SegmentFilter();
  Object.assign(f as unknown as Record<string, unknown>, {
    repeats: state.repeats,
    lastNorm: state.lastNorm,
    kept: state.kept,
  });
  Object.assign(f.dropped, state.dropped);
  return f;
}

/** The speech timeline: the speech pieces of the original audio back to back (or the whole file). */
export class SpeechTimeline {
  readonly samples: number;
  private readonly offsets: number[] = [];

  constructor(
    private readonly pcm: Int16Array,
    private readonly scale: number,
    private readonly chunks: readonly SpeechChunk[] | null,
  ) {
    if (!chunks) {
      this.samples = pcm.length;
      return;
    }
    let total = 0;
    for (const c of chunks) {
      this.offsets.push(total);
      total += c.end - c.start;
    }
    this.samples = total;
  }

  get frames(): number {
    return Math.floor(this.samples / FRAME_SAMPLES);
  }

  /** Timeline samples [from, to) as float audio for the recogniser. */
  slice(from: number, to: number): Float32Array {
    const a = Math.max(0, from);
    const b = Math.min(this.samples, to);
    if (!this.chunks) return int16ToFloat32(this.pcm, this.scale, a, b);
    const out = new Float32Array(Math.max(0, b - a));
    for (let i = 0; i < this.chunks.length; i++) {
      const c = this.chunks[i];
      const start = this.offsets[i];
      const end = start + (c.end - c.start);
      if (end <= a) continue;
      if (start >= b) break;
      const lo = Math.max(a, start);
      const hi = Math.min(b, end);
      out.set(int16ToFloat32(this.pcm, this.scale, c.start + (lo - start), c.start + (hi - start)), lo - a);
    }
    return out;
  }
}

/** The speech pieces planWindows packs (WHISPER_PLAN), in order: the chunks of SpeechTimestampsMap. */
export function speechChunks(speech: readonly SpeechSegment[], totalSamples: number): SpeechChunk[] {
  const out: SpeechChunk[] = [];
  for (const w of planWindows(speech, totalSamples, WHISPER_PLAN)) {
    for (const p of w.pieces) {
      const last = out[out.length - 1];
      // a speech run cut at a window edge is one chunk again (SpeechTimestampsMap sees the VAD's own segments)
      if (last && last.end === p.start) last.end = p.end;
      else out.push({ start: p.start, end: p.end });
    }
  }
  return out;
}

function toRaw(s: WindowResult['segments'][number], words: boolean): RawSegment {
  return {
    start: s.start,
    end: s.end,
    text: s.text,
    words: words && s.words.length ? s.words.map((w) => ({ start: w.start, end: w.end, word: w.word, probability: w.probability })) : null,
    avg_logprob: s.avgLogprob,
    no_speech_prob: s.noSpeechProb,
  };
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw new CancelledError();
}

export async function runPipeline(req: RunRequest, deps: PipelineDeps, ctx: PipelineContext): Promise<PipelineOutcome> {
  const { id, options: o, plan } = req;
  const { signal, emit } = ctx;
  const log = (level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR', message: string) => emit({ type: 'log', id, level, message });
  if (o.engine === 'qwen' || o.model.startsWith('qwen3-asr-')) {
    throw new PipelineError('unsupported', QWEN_NOT_YET);
  }

  // ---------------------------------------------------------------- 1. audio + VAD (skipped on a resume)
  let state = req.resume;
  if (!state) {
    emit({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
    const vad = o.vad ? await deps.createVad(signal) : null;
    const speech: SpeechSegment[] = [];
    const decoded = await deps.decode(req.file, {
      signal,
      collect: true,
      pipeline: { cleanup: o.enhance_audio ? 'native' : false },
      onProgress: (p) => {
        if (p.totalSeconds) {
          emit({ type: 'progress', id, kind: 'decode', loaded: p.processedSeconds, total: p.totalSeconds });
        }
      },
      onChunk: vad ? (chunk) => vad.push(chunk).then((segs) => void speech.push(...segs)) : undefined,
    });
    if (vad) speech.push(...(await vad.flush()));
    throwIfAborted(signal);
    for (const w of decoded.warnings) emit({ type: 'warning', id, code: w.type, message: w.message });
    const duration = decoded.durationSeconds;
    if (duration < 0.3) throw new PipelineError('too-short', 'The audio is too short to transcribe.');
    const chunks = vad ? speechChunks(speech, decoded.samples) : null;
    log('INFO', `audio: ${duration.toFixed(1)} s via ${decoded.path}; speech ${vad ? `${speech.length} segment(s)` : 'not filtered (VAD off)'}`);
    state = {
      pcm: decoded.pcm,
      scale: decoded.scale,
      samples: decoded.samples,
      duration,
      chunks,
      seek: 0,
      emitted: 0,
      filter: filterState(new SegmentFilter()),
      language: o.language || null,
      languageProbability: o.language ? 1 : 0,
      context: '',
      lastSpeechTimestamp: 0,
      windowsDone: 0,
      wordTimestamps: o.word_timestamps,
    };
  }

  const timeline = new SpeechTimeline(state.pcm, state.scale, state.chunks);
  const duration = state.duration;
  const contentFrames = timeline.frames;
  if (contentFrames * FRAME_SAMPLES < MIN_WINDOW_SAMPLES) {
    // no speech at all: nothing reaches the recogniser (silence and music are never sent)
    log('INFO', 'no speech found');
    return {
      kind: 'done',
      result: {
        language: state.language,
        language_probability: pyRound(state.languageProbability, 3),
        duration: pyRound(duration, 2),
        dropped: { ...state.filter.dropped },
        windows: state.windowsDone,
      },
    };
  }

  // ---------------------------------------------------------------- 2. model
  emit({ type: 'phase', id, phase: 'loading_model', progress: 0, eta: null });
  const engine = deps.createEngine();
  ctx.onEngine?.(engine);
  try {
    await deps.ensureModel(o.model, plan.backend, engine, {
      gpu: { shaderF16: plan.shaderF16 },
      onProgress: (p) => emit({ type: 'progress', id, kind: 'download', loaded: p.loaded, total: p.total, file: p.file }),
    });
    throwIfAborted(signal);
    const words = state.wordTimestamps && engine.hasWordTimestamps;
    if (state.wordTimestamps && !engine.hasWordTimestamps) {
      emit({
        type: 'warning',
        id,
        code: 'no-word-timing',
        message: 'Word timing is not available for this model size; times are per line.',
      });
      state.wordTimestamps = false;
    }

    // ---------------------------------------------------------------- 3. recognition
    emit({ type: 'phase', id, phase: 'transcribing', progress: 0, eta: null });
    const window = (seek: number, frames: number) =>
      timeline.slice(seek * FRAME_SAMPLES, (seek + frames) * FRAME_SAMPLES);

    if (!state.language) {
      const seen = new Map<string, number[]>();
      let first: LanguageResult | null = null;
      for (let i = 0; i < LANGUAGE_DETECTION_SEGMENTS; i++) {
        const from = i * WINDOW_FRAMES;
        if (from >= contentFrames) break;
        const audio = window(from, Math.min(WINDOW_FRAMES, contentFrames - from));
        if (audio.length < MIN_WINDOW_SAMPLES) break;
        const r = await engine.detectLanguage(audio);
        throwIfAborted(signal);
        first ??= r;
        const list = seen.get(r.language) ?? [];
        list.push(r.probability);
        seen.set(r.language, list);
        if (r.probability > LANGUAGE_DETECTION_THRESHOLD) break;
      }
      // faster-whisper: the language found most often, with its best probability
      let best: string | null = null;
      for (const [lang, ps] of seen) if (!best || ps.length > seen.get(best)!.length) best = lang;
      if (best) {
        state.language = best;
        state.languageProbability = Math.max(...seen.get(best)!);
        emit({
          type: 'language',
          id,
          language: best,
          probability: state.languageProbability,
          candidates: (first?.probabilities ?? []).slice(0, 5).map(([language, probability]) => ({ language, probability })),
        });
      }
    }

    const filter = restoreFilter(state.filter);
    const initialPrompt = pyStrip(o.prompt ?? '');
    let windowsHere = 0;
    while (state.seek < contentFrames) {
      throwIfAborted(signal);
      if (plan.recycleEvery > 0 && windowsHere >= plan.recycleEvery) {
        state.filter = filterState(filter);
        log('DEBUG', `recycling the worker after ${windowsHere} windows`);
        return { kind: 'recycle', state };
      }
      const previousSeek = state.seek;
      const segFrames = Math.min(WINDOW_FRAMES, contentFrames - previousSeek);
      const audio = window(previousSeek, segFrames);
      if (audio.length < MIN_WINDOW_SAMPLES) break;
      const timeOffset = previousSeek / FRAMES_PER_SECOND;
      const prompt = [initialPrompt, o.condition_on_previous ? state.context : ''].filter(Boolean).join(' ');
      const r = await engine.transcribeWindow(audio, {
        language: state.language,
        task: o.task,
        beamSize: o.beam_size,
        prompt: prompt || null,
        wordTimestamps: words,
        offsetSeconds: timeOffset,
        onPartial: (p) => emit({ type: 'partial', id, text: p.text }),
      });
      windowsHere++;
      state.windowsDone++;
      throwIfAborted(signal);

      // transcribe.py:1215-1235: a silent window is skipped whole
      if (shouldSkipWindow(r.noSpeechProb, r.avgLogprob)) {
        state.seek = previousSeek + segFrames;
        continue;
      }
      let segments: WindowResult['segments'] = r.segments;
      let seek = previousSeek + Math.round(r.consumedSeconds * FRAMES_PER_SECOND);
      if (words && !r.singleTimestampEnding) {
        const lastWordEnd = getEnd(segments as unknown as GuardSegment[]);
        if (lastWordEnd !== null && lastWordEnd > timeOffset) seek = Math.round(lastWordEnd * FRAMES_PER_SECOND);
      }
      if (words) {
        const g = hallucinationGuard({
          segments: segments as unknown as GuardSegment[],
          timeOffset,
          segmentDuration: segFrames / FRAMES_PER_SECOND,
          windowEndTime: (previousSeek + WINDOW_FRAMES) / FRAMES_PER_SECOND,
          contentDuration: timeline.samples / SAMPLE_RATE,
          contentFrames,
          previousSeek,
          seek,
          lastSpeechTimestamp: state.lastSpeechTimestamp,
        });
        state.lastSpeechTimestamp = g.lastSpeechTimestamp;
        if (g.skipWindow) {
          state.seek = Math.max(g.seek, previousSeek + 1);
          continue;
        }
        segments = g.segments as unknown as WindowResult['segments'];
        seek = g.seek;
      }
      // never stall on a window that consumed nothing
      state.seek = seek > previousSeek ? Math.min(seek, contentFrames) : previousSeek + segFrames;

      const raws = segments.map((s) => toRaw(s, words));
      const restored = state.chunks ? restoreSpeechTimestamps(raws, state.chunks) : raws;
      const kept: Segment[] = [];
      let progress = 0;
      for (const raw of restored) {
        const seg = filter.accept(raw);
        if (!seg) continue;
        kept.push(withOriginalText(seg, raw));
        progress = segmentProgress(raw, duration);
      }
      if (kept.length) {
        emit({
          type: 'segments',
          id,
          segments: kept,
          since: state.emitted,
          progress,
          language: state.language,
          duration,
        });
        state.emitted += kept.length;
      }
      if (o.condition_on_previous) {
        state.context = r.temperature > PROMPT_RESET_ON_TEMPERATURE ? '' : pyStrip(`${state.context} ${r.text}`);
      }
    }
    const summary = filter.summary();
    if (summary) log('INFO', summary);
    return {
      kind: 'done',
      result: {
        language: state.language,
        language_probability: pyRound(state.languageProbability, 3),
        duration: pyRound(duration, 2),
        dropped: { ...filter.dropped },
        windows: state.windowsDone,
      },
    };
  } finally {
    ctx.onEngine?.(null);
    await engine.dispose().catch(() => undefined);
  }
}
