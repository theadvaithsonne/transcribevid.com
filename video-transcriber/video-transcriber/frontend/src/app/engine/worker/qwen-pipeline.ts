/**
 * The Qwen3-ASR job pipeline: backend/app/qwen_engine.py `QwenEngine.transcribe` in the engine worker.
 *
 *   decodeMedia (+ clean-up, 16 kHz) --chunks--> StreamingVad(QWEN_VAD) ............ phase 'extracting'
 *   planWindows(QWEN_PLAN) -> chunks (25 s, cut at pauses, overlap only on forced cuts)
 *   no chunk (silence): done, the model is never loaded (as on the server)
 *   ModelManager.ensureQwen -> QwenEngine.load .................................... phase 'loading_model'
 *   per chunk: decode, exact overlap trim or one retry, review reasons ........... phase 'transcribing'
 *     -> one 'segments' event per chunk, with the language its Hinglish step uses (`detected or language`)
 *
 * Differences from the Whisper pipeline, all the server's: translation is refused, the model loads after the plan
 * (not in parallel with the decoding), segments carry chunk timing with `words: null` and `confidence: null`, and the
 * result has no language probability. On WebGPU the worker is recycled every `recycleEvery` chunks like Whisper's.
 */
import { CancelledError } from '../asr/types';
import { int16ToFloat32 } from '../audio/pcm';
import { pyRound } from '../post/py';
import { QWEN_DEVICE_REASON } from '../qwen/qwen-capability';
import { chunksFromWindows, QwenCancelled, QwenChunk, transcribeChunks } from '../qwen/qwen-chunks';
import { codeForQwenName, isQwenLanguage, qwenLanguageName } from '../qwen/qwen-languages';
import type { SpeechSegment } from '../vad/types';
import { QWEN_VAD } from '../vad/types';
import { QWEN_PLAN, planWindows } from '../vad/windows';
import { PipelineContext, PipelineDeps, PipelineError, PipelineOutcome, throwIfAborted } from './pipeline-common';
import type { ResumeState, RunRequest } from './protocol';

/** qwen_engine.py, raised before anything is decoded. */
export const QWEN_NO_TRANSLATE = 'Qwen supports transcription here; select Whisper for English translation.';
export const QWEN_LANGUAGE_UNSUPPORTED = 'This language is not supported by the Qwen adapter.';

const NO_DROPS = { empty: 0, no_speech: 0, repetition: 0 };

export async function runQwenPipeline(req: RunRequest, deps: PipelineDeps, ctx: PipelineContext): Promise<PipelineOutcome> {
  const { id, options: o, plan } = req;
  const { signal, emit } = ctx;
  const log = (level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR', message: string) => emit({ type: 'log', id, level, message });
  if (o.task !== 'transcribe') throw new PipelineError('unsupported', QWEN_NO_TRANSLATE);
  if (o.language && !isQwenLanguage(o.language)) throw new PipelineError('unsupported', QWEN_LANGUAGE_UNSUPPORTED);
  if (!deps.createQwenEngine || !deps.ensureQwen || plan.backend !== 'webgpu' || !plan.shaderF16) {
    throw new PipelineError('unsupported', QWEN_DEVICE_REASON, `backend ${plan.backend}, shader-f16 ${plan.shaderF16}`);
  }

  // ---------------------------------------------------------------- 1. audio + VAD -> chunk plan (not on a resume)
  let state: ResumeState;
  if (req.resume?.qwen) {
    state = req.resume;
  } else {
    emit({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
    const vad = o.vad ? await deps.createVad(signal, QWEN_VAD) : null;
    const speech: SpeechSegment[] = [];
    const decoded = await deps.decode(req.file, {
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
    // qwen_engine.chunks(): VAD off = the whole file is one speech interval
    const intervals = vad ? speech : [{ start: 0, end: decoded.samples }];
    const chunkPlan: QwenChunk[] = chunksFromWindows(planWindows(intervals, decoded.samples, QWEN_PLAN));
    log(
      'INFO',
      `audio: ${duration.toFixed(1)} s via ${decoded.path}; ${chunkPlan.length} Qwen chunk(s)` +
        (vad ? ` from ${speech.length} speech segment(s)` : ' (VAD off)'),
    );
    state = {
      pcm: decoded.pcm,
      scale: decoded.scale,
      samples: decoded.samples,
      duration,
      chunks: null,
      seek: 0,
      emitted: 0,
      filter: { repeats: 0, lastNorm: null, kept: 0, dropped: { ...NO_DROPS } },
      language: o.language || null,
      languageProbability: 0,
      context: '',
      lastSpeechTimestamp: 0,
      windowsDone: 0,
      wordTimestamps: false,
      qwen: {
        plan: chunkPlan,
        loop: { next: 0, previousText: '', language: o.language || null, emitted: 0, chunksDone: 0 },
      },
    };
  }
  const q = state.qwen!;
  const duration = state.duration;
  if (!q.plan.length) {
    // silence: no segments and the model is never loaded (qwen_engine `if not spans`)
    log('INFO', 'no speech found');
    return {
      kind: 'done',
      result: { language: o.language || null, language_probability: null, duration: pyRound(duration, 2), dropped: { ...NO_DROPS }, windows: 0 },
    };
  }

  // ---------------------------------------------------------------- 2. model (one engine alive at a time)
  emit({ type: 'phase', id, phase: 'loading_model', progress: 0, eta: null });
  const engine = deps.createQwenEngine();
  ctx.onEngine?.(engine);
  try {
    await deps.ensureQwen(o.model, engine, {
      gpu: { shaderF16: plan.shaderF16 },
      signal,
      onProgress: (p) => emit({ type: 'progress', id, kind: 'download', loaded: p.loaded, total: p.total, file: p.file }),
    });
    throwIfAborted(signal);

    // ---------------------------------------------------------------- 3. recognition
    emit({ type: 'phase', id, phase: 'transcribing', progress: 0, eta: null });
    const forced = qwenLanguageName(o.language);
    const context = o.prompt ?? '';
    const pcm = state.pcm;
    const scale = state.scale;
    let outcome;
    try {
      outcome = await transcribeChunks({
        totalSamples: state.samples,
        plan: q.plan,
        state: q.loop,
        language: o.language || null,
        recycleEvery: plan.recycleEvery,
        shouldCancel: () => signal.aborted,
        decode: async (start, end) => {
          const r = await engine.transcribeChunk(int16ToFloat32(pcm, scale, start, end), {
            language: forced,
            context,
            onPartial: (text) => emit({ type: 'partial', id, text }),
          });
          if (r.hitMaxTokens) log('WARNING', `a chunk at ${(start / 16000).toFixed(1)} s reached the 512-token limit`);
          return { text: r.text, language: codeForQwenName(r.language) };
        },
        onSegment: (seg, progress, info) =>
          emit({
            type: 'segments',
            id,
            segments: [seg],
            since: seg.id,
            progress: Math.min(progress, 1),
            language: info.language,
            duration,
            romanizeLanguage: info.romanizeLanguage,
          }),
      });
    } catch (e) {
      if (e instanceof QwenCancelled) throw new CancelledError();
      throw e;
    }
    q.loop = outcome.state;
    state.emitted = outcome.state.emitted;
    state.windowsDone = outcome.state.chunksDone;
    state.language = outcome.state.language;
    if (outcome.kind === 'recycle') {
      log('DEBUG', `recycling the worker after ${plan.recycleEvery} Qwen chunks`);
      return { kind: 'recycle', state };
    }
    return {
      kind: 'done',
      result: {
        language: outcome.language,
        language_probability: null,
        duration: pyRound(duration, 2),
        dropped: { ...NO_DROPS },
        windows: outcome.state.chunksDone,
      },
    };
  } finally {
    ctx.onEngine?.(null);
    await engine.dispose().catch(() => undefined);
  }
}
