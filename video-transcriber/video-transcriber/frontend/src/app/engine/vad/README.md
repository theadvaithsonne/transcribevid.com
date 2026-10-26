# engine/vad

Voice-activity detection and audio windowing for the in-browser engine. It does in the visitor's browser what the
Python engine does: Silero VAD (the same model file and the same segmentation code as faster-whisper), then 30 s
windows for Whisper or 25 s chunks for Qwen. That way silence and music never reach the recogniser. Pure TypeScript,
no Angular imports. The only runtime dependency is `onnxruntime-web`, and the caller can pass the namespace it
already loaded instead. Background and measurements: `docs/in-browser/spike/vad.md`.

| file | what it is |
|---|---|
| `types.ts` | `SAMPLE_RATE` 16000, `FRAME` 512, `CONTEXT` 64, `SpeechSegment`, `VadParams`, the presets `WHISPER_VAD`, `WHISPER_VAD_30S`, `QWEN_VAD`, `FASTER_WHISPER_DEFAULTS`, the `FrameModel` interface |
| `segmenter.ts` | port of `faster_whisper.vad.get_speech_timestamps`: `speechTimestampsFromProbs()` (a literal port, used as the oracle) and `SpeechSegmenter` (incremental, same result for any batching) |
| `silero.ts` | `SileroVad`: `silero_vad_v6.onnx` on onnxruntime-web, execution provider pinned to `['wasm']`, many frames per `run()` |
| `canary.ts` | `selfTest(model)`: a 48-frame synthetic canary that catches a wrong execution provider, wrong weights or a broken ORT build |
| `streaming.ts` | `StreamingVad` (`push(chunk) -> segments`, `flush()`, `reset()`, abort signal, `retainFrom`), `detectSpeech()` (one shot), `AudioRing` |
| `windows.ts` | `planWindows()` and the plans `WHISPER_PLAN`, `QWEN_PLAN`, `VAD_OFF_PLAN` / `planWithoutVad()`, `windowAudio()`, `makeTimeMap()`, the literal ports `collectChunks()` and `SpeechTimestampsMap`, `pausesFromProbs()` |
| `energy.ts` | `EnergyVadModel`: a pure TypeScript energy/spectral fallback with the same `FrameModel` interface |
| `fixtures/golden.ts` | generated: faster-whisper's Python outputs and Silero probability traces for 50 clip variants (`fixtures/make-golden.mjs`) |
| `fixtures/helpers.ts` | spec helpers: golden decoding, the five parameter sets, seeded PRNG, a small property runner |

Model: `public/models/vad/silero_vad_v6.onnx` (1,245,151 bytes, sha256 `4cbf549b...17d2`, MIT). This is byte for
byte the file faster-whisper 1.2.1 ships and the server runs (Silero v6.0 weights). Source, hash and the two licence
notices are in `provenance.json` and `LICENSE` next to it.

## API

```ts
import { SileroVad, selfTest, EnergyVadModel, StreamingVad, WHISPER_VAD_30S, planWindows, WHISPER_PLAN,
  windowAudio, makeTimeMap } from './vad';

// 1. model: pass the ORT namespace the engine already loaded (one runtime, one wasm instance), or let it import
//    'onnxruntime-web' and apply `env`. executionProviders is always ['wasm'] (WebGPU gives wrong probabilities).
const bytes = new Uint8Array(await (await fetch('/models/vad/silero_vad_v6.onnx')).arrayBuffer());
let model: FrameModel = await SileroVad.create(bytes, { ort, env: { wasmPaths: '/ort/', numThreads: 1 } });
if (!(await selfTest(model)).ok) model = new EnergyVadModel();   // safety net, not a substitute

// 2. streaming detection while decoding (any chunk size; result identical to a one-shot run)
const vad = new StreamingVad(model, WHISPER_VAD_30S, { signal });
const segments: SpeechSegment[] = [];
for await (const block of decoded16kMono) segments.push(...(await vad.push(block)));
segments.push(...(await vad.flush()));

// 3. windows and time mapping
const windows = planWindows(segments, vad.samplesSeen, WHISPER_PLAN);       // <= 30 s of speech each
for (const w of windows) {
  const result = await whisper(windowAudio(samples, w));
  const map = makeTimeMap(w);                     // window-local seconds -> file seconds
  // map.mapSpan(word.start, word.end, 2)  (SpeechTimestampsMap rules: the piece holding the middle, 2 decimals)
}
```

* `StreamingVad.push()` / `flush()` are serialised internally, so a decoder callback does not have to await. The
  block is copied unless `push(block, false)`. `retainFrom` is the lowest sample a segment that has not been
  returned yet can start at. Trim an `AudioRing` with it.
* A segment comes out as soon as its padded end is known: at most `minSilence + 2 x pad` of audio later, plus one
  batch (`batchFrames`, default 256 frames = 8.2 s).
* Qwen: `new StreamingVad(model, QWEN_VAD)` then `planWindows(segs, n, QWEN_PLAN)`. Windows are contiguous
  (`pieces.length === 1`). `forcedStart` marks a hard cut, where `qwen_engine`'s `overlap` re-decodes 2 s and trims
  the repeated words.
* "VAD off" (the UI option): `planWithoutVad(n, pausesFromProbs(energyProbs))` gives 30 s windows cut at quiet
  valleys found by the energy model. Without pauses it cuts hard every 30 s, and every window after the first has
  `forcedStart`. Python lets Whisper choose its own cut points instead, so this is the closest equivalent, not an
  identical result.
* Run the VAD and Whisper through one run queue. Feed the 16 kHz mono float audio after the engine's clean-up filters
  (the server runs its VAD on the filtered audio).

## Defaults and their Python parameters

| faster-whisper `VadOptions` | `VadParams` | `WHISPER_VAD_30S` (Whisper default) | `WHISPER_VAD` | `QWEN_VAD` | Python source |
|---|---|---|---|---|---|
| `threshold` | `threshold` | 0.45 | 0.45 | 0.5 | `engine.py:482` / `VadOptions` default |
| `neg_threshold` (None = threshold - 0.15) | `negThreshold` | 0.30 (implicit) | 0.30 | 0.35 | faster-whisper default |
| `min_speech_duration_ms` | `minSpeechDurationMs` | 0 | 0 | 0 | default |
| `max_speech_duration_s` | `maxSpeechDurationS` | **30** | inf | inf | Python: inf (see below) |
| `min_silence_duration_ms` | `minSilenceDurationMs` | 500 | 500 | 300 | `engine.py:482`, `qwen_engine.py:78` |
| `speech_pad_ms` | `speechPadMs` | 400 | 400 | 100 | `engine.py:482`, `qwen_engine.py:78` |
| window_size_samples / context | `FRAME` / `CONTEXT` | 512 / 64 | | | `vad.py` |

| plan | `maxWindow` | `mergeGap` | `splice` | `preferBreak` / `strictPreferred` | Python equivalent |
|---|---|---|---|---|---|
| `WHISPER_PLAN` | 30 s | 0 | true (speech packed, silence dropped) | 0 / false | `collect_chunks(max 30 s)` + `SpeechTimestampsMap` |
| `QWEN_PLAN` | 25 s | 2 s (gaps >= 2 s skipped) | false (contiguous) | 0.6 / true | `qwen_engine.chunks(audio, 25)` |
| `VAD_OFF_PLAN` | 30 s | 0 | false | 0 / false (+ `pauses`) | `vad_filter=False` (Whisper picks its own cuts) |

The thresholds are compared as float32 (`Math.fround`), the way numpy 2 does it. Why the 30 s cap differs from
Python's `inf`: the browser decodes each window on its own, so a speech run must fit in one window, and the cap also
bounds the streaming memory. On 50 of the 52 spike clip variants the cap changes nothing. On a synthetic clip with no
pause at all it cuts at multiples of 29.26 s, exactly like faster-whisper's batched pipeline.

Quirks copied on purpose: the stream is padded with `512 - len % 512` zeros, so a multiple of 512 gets one whole
extra zero frame, and the padded tail frame also has its last 64 samples zeroed. `collectChunks(..., faithful =
true)` reproduces faster-whisper 1.2.1 leaving the first segment of every chunk but the first out of its metadata.
The default lists all of them.

## Specs

`ng test --watch=false --include "**/engine/vad/*.spec.ts"` (from `frontend/`). Golden data comes from the real
Python functions (faster-whisper 1.2.1 in `backend/.venv`) on 25 clips, raw and enhanced. The 60 minute file is
covered by the browser benchmark in the spike.

* `segmenter.spec.ts`: literal port == `get_speech_timestamps` on the recorded probability traces for 5 parameter
  sets x 50 variants. The incremental segmenter gives the same result for random batchings, and nothing is emitted
  before `retainFrom`. Properties: incremental == oracle (4000 seeded cases), output invariants (3000). Unit rules:
  float32 thresholds, hysteresis, gap sharing, max-speech split.
* `streaming.spec.ts`: `StreamingVad` replaying the recorded traces == Python for random chunkings and batch sizes
  (all 50 variants, 3 parameter sets). Frame partition and tail zeroing for edge lengths, batch-size independence,
  bounded memory over 1 hour, abort, reset, call serialisation with reused buffers, `AudioRing`, energy fallback.
* `windows.spec.ts`: `QWEN_PLAN` == `qwen_engine.chunks` (VAD on and off), `collectChunks` / `WHISPER_PLAN` ==
  `collect_chunks`, `SpeechTimestampsMap` / `makeTimeMap` == Python on 1,764 probe times, boundary cases, VAD off.
  Properties: never over the max window, coverage is exactly speech plus joined gaps, deterministic and
  order-independent, cuts only at pauses when one is in reach, next-fit packing, incremental stability, time map.
* `silero.spec.ts`: the wrapper against a fake ORT (the wasm EP is forced, env applied, row layout, context and LSTM
  state carried, reset) and the canary.

The real ONNX model is not loaded in vitest, because the jsdom runner has no wasm backend. It is checked in headless
Chrome.

Regenerate the goldens (after a faster-whisper or model change; inputs in the spike scratch folder):
`node fixtures/make-golden.mjs <scratchpad>/vad`.

## Browser check (real model, module worker, headless Chrome)

The driver is in the session scratch folder `m3-vad/browser/`. `run.mjs` bundles `worker.ts` with esbuild (`@vad` is
aliased to this folder's `index.ts`, and `onnxruntime-web` resolves from `frontend/node_modules`). It serves
`frontend/public/models`, `frontend/fixtures` and the ORT wasm files, opens headless Chrome (`channel: 'chrome'`)
and, inside a module Worker, loads `/models/vad/silero_vad_v6.onnx` with `SileroVad.create`, runs `selfTest` and
streams `fixtures/audio/speech-silence-speech.wav` in 1 s blocks. It then checks: canary ok, segments identical to
Python's, nothing inside the 20 s silence, the timeline (speech 0-6.958 s, speech 26.958-49.699 s). It prints the
speed (x real time). The browser and the server are always stopped.

```
node <scratchpad>/m3-vad/browser/run.mjs        # PASS / FAIL + result.json
```

It needs the spike's `vad/reference/node_modules` (esbuild, playwright-core) and an installed Google Chrome.
