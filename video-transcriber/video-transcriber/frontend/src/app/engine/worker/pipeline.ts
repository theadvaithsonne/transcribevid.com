/**
 * The job pipeline of the in-browser engine (ARCHITECTURE.md section 3), as one async function with its I/O passed in
 * (`PipelineDeps`), so the worker runs it with the real decoder / VAD / Whisper and the specs with fakes.
 *
 *   model manager: ensure the files (Cache API) --> WhisperEngine.load (+ the word-timing aligner) ... started first,
 *                                                     in parallel with the decoding (engine.py _BackgroundLoad)
 *   decodeMedia (+ clean-up, 16 kHz) --chunks--> StreamingVad --> speech chunks ............ phase 'extracting'
 *   wait for the model ..................................................................... phase 'loading_model'
 *   faster-whisper's seek loop over the speech timeline (all speech pieces back to back) . phase 'transcribing'
 *     detect the language on up to 4 x 30 s (unless the user chose one)
 *     transcribeWindow(30 s from `seek`) -> no-speech window skip -> seek rule (consumedSeconds, last word)
 *     -> hallucination-silence guard (word timing on) -> times back to the original timeline
 *     -> segment filter (empty / made-up silence / repetition loop), confidence, original_text -> 'segments' event
 *
 * It mirrors faster-whisper 1.2.1 `transcribe(vad_filter=True)` + `generate_segments` and backend/app/engine.py
 * `_recognise`: the VAD's speech is joined into one timeline, windows restart at `seek` (never fixed 30 s steps), and
 * times are restored with SpeechTimestampsMap. VAD off = the whole file is the timeline.
 *
 * Low-memory devices (`plan.lowMemory`, deviceMemory <= 4) decode with `collect: false` into a StreamingTimeline that
 * keeps only the speech around the current window; the seek loop runs while the file is still being decoded.
 * Qwen3-ASR has its own pipeline (qwen-pipeline.ts), chosen here by `options.engine === 'qwen'`.
 */
import type { Segment } from '../../core/models';
import type { LanguageResult, ProgressInfo, WindowResult } from '../asr/types';
import { isCancelled } from '../asr/types';
import type { DecodeResult } from '../audio';
import { int16ToFloat32 } from '../audio/pcm';
import { GuardSegment, getEnd, hallucinationGuard, shouldSkipWindow } from '../post/guards';
import { pyRound, pyStrip } from '../post/py';
import { RawSegment, SegmentFilter, segmentProgress, withOriginalText } from '../post/segment';
import { SpeechChunk, restoreSpeechTimestamps } from '../post/words';
import type { SpeechSegment } from '../vad/types';
import { WHISPER_PLAN, planWindows } from '../vad/windows';
import {
  AsrEngine,
  PipelineContext,
  PipelineDeps,
  PipelineError,
  PipelineOutcome,
  throwIfAborted,
  untilAborted,
} from './pipeline-common';
import type { FilterState, ResumeState, RunRequest } from './protocol';
import { runQwenPipeline } from './qwen-pipeline';
import { StreamingTimeline, TimelineLike } from './timeline';

export * from './pipeline-common';

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
/**
 * Low-memory mode reads this much past a window before deciding it (so the hallucination guard's "content ends within
 * 2 s" test sees the same answer as with the whole file).
 */
const LOOKAHEAD_SAMPLES = 3 * SAMPLE_RATE;
export const NO_WORD_TIMING = 'Word timing is not available for this model size; times are per line.';

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
export class SpeechTimeline implements TimelineLike {
  readonly samples: number;
  readonly done = true;
  private readonly offsets: number[] = [];

  constructor(
    private readonly pcm: Int16Array,
    private readonly scale: number,
    readonly chunks: readonly SpeechChunk[] | null,
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

  waitFor(): Promise<void> {
    return Promise.resolve();
  }

  release(): void {
    // everything stays in memory in this mode
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

export async function runPipeline(req: RunRequest, deps: PipelineDeps, ctx: PipelineContext): Promise<PipelineOutcome> {
  if (req.options.engine === 'qwen' || req.options.model.startsWith('qwen3-asr-')) return runQwenPipeline(req, deps, ctx);
  return runWhisperPipeline(req, deps, ctx);
}

/** Download progress of the main model, then the aligner's continuing the same total (the job page shows one bar). */
function downloadReporter(emit: (loaded: number, total: number, file?: string, note?: string) => void) {
  let mainTotal = 0;
  return {
    main: (p: ProgressInfo) => {
      mainTotal = Math.max(mainTotal, p.total);
      emit(p.loaded, p.total, p.file, p.note);
    },
    aligner: (p: ProgressInfo) => emit(mainTotal + p.loaded, mainTotal + p.total, p.file, p.note),
  };
}

/** The part of the state a reloaded page needs to continue: everything but the audio (decoded again on resume). */
function checkpointOf(state: ResumeState, filter: SegmentFilter, streaming: boolean): ResumeState {
  return { ...state, pcm: new Int16Array(0), chunks: null, filter: filterState(filter), streaming, redecode: true, qwen: undefined };
}

async function runWhisperPipeline(req: RunRequest, deps: PipelineDeps, ctx: PipelineContext): Promise<PipelineOutcome> {
  const { id, options: o, plan } = req;
  const { signal, emit } = ctx;
  const log = (level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR', message: string) => emit({ type: 'log', id, level, message });
  const streaming = req.resume ? !!req.resume.streaming : !!plan.lowMemory;
  const wantWords = req.resume ? req.resume.wordTimestamps : o.word_timestamps;

  // ---------------------------------------------------------------- 0. the model, in parallel with the decoding
  const engine = deps.createEngine();
  ctx.onEngine?.(engine);
  let aligner: AsrEngine | null = null;
  let loadSettled = false;
  const progress = downloadReporter((loaded, total, file, note) =>
    emit({ type: 'progress', id, kind: 'download', loaded, total, file, ...(note ? { note } : {}) }),
  );
  const loading = (async (): Promise<AsrEngine | null> => {
    await deps.ensureModel(o.model, plan.backend, engine, { gpu: { shaderF16: plan.shaderF16 }, onProgress: progress.main, signal });
    const alignerId = wantWords && !engine.hasWordTimestamps && engine.attachAligner ? (deps.alignerFor?.(o.model) ?? null) : null;
    if (!alignerId) return null;
    const a = deps.createEngine();
    try {
      await deps.ensureModel(alignerId, plan.backend, a, { gpu: { shaderF16: plan.shaderF16 }, onProgress: progress.aligner, signal });
      engine.attachAligner!(a);
      log('INFO', `word timing: ${o.model} is aligned with the ${alignerId} timing model`);
      return a;
    } catch (e) {
      await a.dispose().catch(() => undefined);
      if (isCancelled(e)) throw e;
      log('WARNING', `the ${alignerId} word-timing model could not be loaded: ${(e as Error)?.message ?? e}`);
      return null;
    }
  })();
  loading.then(
    (a) => {
      aligner = a;
      loadSettled = true;
    },
    () => (loadSettled = true),
  );

  const decodeAbort = new AbortController();
  const onAbort = () => decodeAbort.abort();
  signal.addEventListener('abort', onAbort, { once: true });
  let decoding: Promise<unknown> | null = null;
  let stream: StreamingTimeline | null = null;
  try {
    // ---------------------------------------------------------------- 1. audio + VAD (skipped on a plain resume)
    let state: ResumeState;
    let timeline: TimelineLike;
    let durationNow: () => number;
    if (streaming) {
      const s = await startStreaming(req, deps, ctx, decodeAbort.signal, log);
      state = s.state;
      timeline = stream = s.timeline;
      durationNow = s.duration;
      decoding = s.decoding;
    } else {
      state = !req.resume
        ? await decodeAll(req, deps, ctx, log)
        : req.resume.redecode
          ? continueFrom(await decodeAll(req, deps, ctx, log), req.resume)
          : req.resume;
      timeline = new SpeechTimeline(state.pcm, state.scale, state.chunks);
      const d = state.duration;
      durationNow = () => d;
    }

    // no speech at all: nothing reaches the recogniser (silence and music are never sent), and nobody waits for the
    // model download the run started
    await timeline.waitFor(MIN_WINDOW_SAMPLES);
    throwIfAborted(signal);
    if (timeline.done && Math.floor(timeline.samples / FRAME_SAMPLES) * FRAME_SAMPLES < MIN_WINDOW_SAMPLES) {
      log('INFO', 'no speech found');
      if (decoding) await decoding;
      return {
        kind: 'done',
        result: {
          language: state.language,
          language_probability: pyRound(state.languageProbability, 3),
          duration: pyRound(durationNow(), 2),
          dropped: { ...state.filter.dropped },
          windows: state.windowsDone,
        },
      };
    }

    // ---------------------------------------------------------------- 2. model
    emit({ type: 'phase', id, phase: 'loading_model', progress: 0, eta: null });
    await untilAborted(loading, signal);
    throwIfAborted(signal);
    const words = state.wordTimestamps && engine.hasWordTimestamps;
    if (state.wordTimestamps && !engine.hasWordTimestamps) {
      emit({ type: 'warning', id, code: 'no-word-timing', message: NO_WORD_TIMING });
      state.wordTimestamps = false;
    }

    // ---------------------------------------------------------------- 3. recognition
    emit({ type: 'phase', id, phase: 'transcribing', progress: 0, eta: null });
    const window = async (seek: number, frames: number) => {
      await timeline.waitFor((seek + frames) * FRAME_SAMPLES + LOOKAHEAD_SAMPLES);
      throwIfAborted(signal);
      const known = Math.floor(timeline.samples / FRAME_SAMPLES);
      const n = Math.max(0, Math.min(frames, known - seek));
      return timeline.slice(seek * FRAME_SAMPLES, (seek + n) * FRAME_SAMPLES);
    };
    const knownFrames = () => Math.floor(timeline.samples / FRAME_SAMPLES);

    if (!state.language) {
      const seen = new Map<string, number[]>();
      let first: LanguageResult | null = null;
      for (let i = 0; i < LANGUAGE_DETECTION_SEGMENTS; i++) {
        const from = i * WINDOW_FRAMES;
        const audio = await window(from, WINDOW_FRAMES);
        if (from >= knownFrames()) break;
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
    let checkpointed = state.windowsDone;
    for (;;) {
      throwIfAborted(signal);
      const previousSeek = state.seek;
      timeline.release(previousSeek * FRAME_SAMPLES);
      const audio = await window(previousSeek, WINDOW_FRAMES);
      if (timeline.done && previousSeek >= knownFrames()) break;
      if (plan.recycleEvery > 0 && windowsHere >= plan.recycleEvery) {
        state.filter = filterState(filter);
        log('DEBUG', `recycling the worker after ${windowsHere} windows`);
        if (streaming) state.chunks = null; // the fresh worker decodes again and finds them itself
        return { kind: 'recycle', state };
      }
      // the whole content is known once a window is not full (streaming) or always (whole file)
      const contentFrames = timeline.done ? knownFrames() : Number.POSITIVE_INFINITY;
      const segFrames = Math.min(WINDOW_FRAMES, knownFrames() - previousSeek);
      if (audio.length < MIN_WINDOW_SAMPLES) break;
      // another window follows and everything before it is emitted: a page that reloads from now on continues here
      if (state.windowsDone > checkpointed) {
        checkpointed = state.windowsDone;
        emit({ type: 'checkpoint', id, state: checkpointOf(state, filter, streaming) });
      }
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
          // streaming: what is known is at least 3 s past this window, which answers the guard's "< 2 s" test alike
          contentDuration: timeline.samples / SAMPLE_RATE,
          contentFrames: Number.isFinite(contentFrames) ? contentFrames : knownFrames(),
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

      const duration = durationNow();
      const raws = segments.map((s) => toRaw(s, words));
      const restored = timeline.chunks ? restoreSpeechTimestamps(raws, timeline.chunks) : raws;
      const kept: Segment[] = [];
      let segProgress = 0;
      for (const raw of restored) {
        const seg = filter.accept(raw);
        if (!seg) continue;
        kept.push(withOriginalText(seg, raw));
        segProgress = duration > 0 ? segmentProgress(raw, duration) : 0;
      }
      if (kept.length) {
        emit({
          type: 'segments',
          id,
          segments: kept,
          since: state.emitted,
          progress: segProgress,
          language: state.language,
          duration,
        });
        state.emitted += kept.length;
      }
      if (o.condition_on_previous) {
        state.context = r.temperature > PROMPT_RESET_ON_TEMPERATURE ? '' : pyStrip(`${state.context} ${r.text}`);
      }
    }
    if (decoding) await decoding;
    const summary = filter.summary();
    if (summary) log('INFO', summary);
    return {
      kind: 'done',
      result: {
        language: state.language,
        language_probability: pyRound(state.languageProbability, 3),
        duration: pyRound(durationNow(), 2),
        dropped: { ...filter.dropped },
        windows: state.windowsDone,
      },
    };
  } finally {
    signal.removeEventListener('abort', onAbort);
    decodeAbort.abort();
    (stream as StreamingTimeline | null)?.close(); // a decoder waiting for room must not wait forever
    if (decoding) await decoding.catch(() => undefined);
    ctx.onEngine?.(null);
    if (!loadSettled) {
      // engine.py's loader is a daemon thread that simply finishes; here the page replaces the worker instead
      ctx.markDirty?.();
      void loading.then(
        (a) => a?.dispose(),
        () => undefined,
      ).finally(() => engine.dispose().catch(() => undefined));
    } else {
      const a = aligner as AsrEngine | null;
      await a?.dispose().catch(() => undefined);
      await engine.dispose().catch(() => undefined);
    }
  }
}

/** Whole-file mode: decode with `collect: true`, VAD on the chunks as they come, the speech chunks at the end. */
async function decodeAll(
  req: RunRequest,
  deps: PipelineDeps,
  ctx: PipelineContext,
  log: (level: 'INFO', message: string) => void,
): Promise<ResumeState> {
  const { id, options: o, plan } = req;
  const { signal, emit } = ctx;
  emit({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
  const vad = o.vad ? await deps.createVad(signal) : null;
  const speech: SpeechSegment[] = [];
  const decoded: DecodeResult = await deps.decode(req.file, {
    signal,
    collect: true,
    pipeline: { cleanup: o.enhance_audio ? 'native' : false },
    ffmpeg: plan.converter ? {} : undefined,
    onProgress: (p) => {
      if (p.totalSeconds) emit({ type: 'progress', id, kind: 'decode', loaded: p.processedSeconds, total: p.totalSeconds });
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
  return {
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

/** A checkpoint on freshly decoded audio: the audio, its length and speech chunks are new, where to go on is the checkpoint's. */
function continueFrom(fresh: ResumeState, checkpoint: ResumeState): ResumeState {
  return {
    ...fresh,
    seek: checkpoint.seek,
    emitted: checkpoint.emitted,
    filter: checkpoint.filter,
    language: checkpoint.language,
    languageProbability: checkpoint.languageProbability,
    context: checkpoint.context,
    lastSpeechTimestamp: checkpoint.lastSpeechTimestamp,
    windowsDone: checkpoint.windowsDone,
    wordTimestamps: checkpoint.wordTimestamps,
  };
}

/**
 * Low-memory mode: the decoder streams into a StreamingTimeline (VAD-confirmed speech only, from the current window
 * on) while the seek loop runs. A resumed run (after a WebGPU recycle) decodes again and skips to its `seek`.
 */
async function startStreaming(
  req: RunRequest,
  deps: PipelineDeps,
  ctx: PipelineContext,
  decodeSignal: AbortSignal,
  log: (level: 'INFO', message: string) => void,
): Promise<{ state: ResumeState; timeline: StreamingTimeline; duration: () => number; decoding: Promise<unknown> }> {
  const { id, options: o, plan } = req;
  const { signal, emit } = ctx;
  const resumed = req.resume ?? null;
  if (!resumed) emit({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
  const timeline = new StreamingTimeline(o.vad);
  if (resumed) timeline.release(resumed.seek * FRAME_SAMPLES);
  const vad = o.vad ? await deps.createVad(signal) : null;
  let estimate: number | null = resumed?.duration || null;
  let final: number | null = null;
  const state: ResumeState = resumed
    ? { ...resumed, chunks: null }
    : {
        pcm: new Int16Array(0),
        scale: 1 / 32768,
        samples: 0,
        duration: 0,
        chunks: null,
        seek: 0,
        emitted: 0,
        filter: filterState(new SegmentFilter()),
        language: o.language || null,
        languageProbability: o.language ? 1 : 0,
        context: '',
        lastSpeechTimestamp: 0,
        windowsDone: 0,
        wordTimestamps: o.word_timestamps,
        streaming: true,
      };
  const decoding = deps
    .decode(req.file, {
      signal: decodeSignal,
      collect: false,
      pipeline: { cleanup: o.enhance_audio ? 'native' : false },
      ffmpeg: plan.converter ? {} : undefined,
      onProgress: (p) => {
        if (!p.totalSeconds) return;
        estimate = p.totalSeconds;
        if (!resumed) emit({ type: 'progress', id, kind: 'decode', loaded: p.processedSeconds, total: p.totalSeconds });
      },
      onChunk: async (chunk) => {
        timeline.pushDecoded(chunk);
        if (vad) {
          for (const s of await vad.push(chunk)) timeline.pushSpeech(s);
          if (vad.retainFrom !== undefined) timeline.trimRaw(vad.retainFrom);
        }
        await timeline.waitForSpace();
      },
    })
    .then(async (decoded) => {
      if (vad) for (const s of await vad.flush()) timeline.pushSpeech(s);
      final = decoded.durationSeconds;
      state.duration = final;
      state.samples = decoded.samples;
      if (!resumed) for (const w of decoded.warnings) emit({ type: 'warning', id, code: w.type, message: w.message });
      log(
        'INFO',
        `audio: ${final.toFixed(1)} s via ${decoded.path} (low-memory mode, ${(timeline.buffered / SAMPLE_RATE).toFixed(0)} s buffered at the end); ` +
          `speech ${timeline.chunks ? `${timeline.chunks.length} piece(s)` : 'not filtered (VAD off)'}`,
      );
      timeline.finish();
    })
    .catch((e) => {
      timeline.fail(e);
      throw e;
    });
  decoding.catch(() => undefined); // observed through the timeline; awaited by the caller
  return {
    state,
    timeline,
    decoding,
    duration: () => final ?? estimate ?? timeline.samples / SAMPLE_RATE,
  };
}
