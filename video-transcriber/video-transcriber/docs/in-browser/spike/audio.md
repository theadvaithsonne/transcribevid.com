# Spike: audio decode and DSP ("any media file -> 16 kHz mono PCM" in the browser)

Track `audio-decode-and-dsp`. Reference code, tests and every raw output live outside the repository in the spike
scratch folder (`<scratchpad>/audio/reference/`, results in `reference/results/`, measurement scripts in
`<scratchpad>/audio/experiments/`); nothing in the repository was changed except this file. Nothing here was
estimated without saying so: figures marked **(not measured)** are arithmetic or documentation, everything else was
run in real Chrome 155 / Edge 156 against the committed fixtures plus extra ones generated for this track.

## 1. Verdict

**Go, with changes.** One decoder design covers everything the Python engine reads today, and the part that matters
for the owner's rule ("do not compromise") is proven rather than assumed: the audio clean-up chain
(`highpass=70, lowpass=7800, dynaudnorm f=200:g=11:p=0.9`) and the 16 kHz resampler were re-implemented in TypeScript
and reproduce ffmpeg 7.1's own output sample for sample.

| Question | Answer (measured) |
| --- | --- |
| Primary decoder | mediabunny 1.62.1 + WebCodecs `AudioDecoder`, streaming from the `File`, in a module worker or the main thread. WebCodecs audio **is** available in dedicated workers (Chrome 155 and Edge 156, headless and headed). |
| 60 min of audio | 830-1160x (PCM WAV), 240-430x (AAC m4a), 310-600x (AAC mp4 with video) real time end to end (open -> clean-up -> 16 kHz Int16), peak renderer memory 227-317 MB (82 MB of that is the empty page), result 110 MB. |
| Files > 2 GB | Work: a 2.5 GB / 3.6 h stereo WAV and a 2.2 GB MP4 decoded completely with 185-597 MB peak; windows match ffmpeg. |
| Cancel / progress | Cancel returns in 18-82 ms during decoding and CPU drops to 0 % within 1 s; progress is monotonic, ~5 updates/s, ends at 100 %. |
| Resampler | Matches libswresample: SNR 100-143 dB, identical output length, 8 to 192 kHz. 140-1320x real time inside a Chrome worker (requirement: 100x). |
| Clean-up chain | Matches ffmpeg: SNR 191-623 dB on the 16 kHz fixtures, 85-124 dB through the full chain at 8-48 kHz, mono / stereo / 5.1 / 7.1; integrated loudness identical at the 0.1 LU ffmpeg prints; band spectra identical to 0.000 dB. |
| Formats | Everything in the fixture set that ffmpeg can read is read by some path. Of the 67 conformance files, 43 are decoded by the primary path (4 of them AC-3 / E-AC-3 / DTS through tiny lazy WASM codecs, 0.24 / 0.32 MB brotli); 12 more (AVI, WMA, WMV, FLV, MPG, raw AMR, AMR in 3GP, AIFF, AU, CAF, ALAC, Speex) only through ffmpeg.wasm (GSM and AMR-WB in the matrix too); the last 12 are deliberately empty / broken / too short and fail with the right message. |
| ffmpeg.wasm | Ship as an **optional, lazy, consent-gated** fallback loaded from jsDelivr (9.3 MB over the wire). It cannot be self-hosted on Cloudflare Pages (the core is 30.7 MiB; the limit is 25 MiB). Its licence (GPL-2.0-or-later core) needs an owner decision, see section 7.2. |
| decodeAudioData fallback | Only for browsers without WebCodecs audio. Main thread only, whole file in memory: 60 min of mono costs 0.5-1.2 GB; refuses (< 2 GiB hard cap) beyond a computed budget. |

Differences that remain, all small and listed honestly in section 11: float32 vs float64 biquads for float-decoded
sources (-98 dB), browser audio decoders vs ffmpeg's (about -75 to -85 dB; Opus has a 35 microsecond sub-sample offset),
a few milliseconds of end padding, one mediabunny FLAC quirk, and no Safari / Firefox measurements (not installed here).

## 2. Environment and method

* Windows 11 (10.0.26300), Ryzen 7 7730U 8C/16T, 15 GB RAM. Chrome 155.0.8059.86 and Edge 156.0.4314.42 driven by
  playwright-core 1.64.1 (`channel: 'chrome'` / `'msedge'`, no browser downloaded). Node 24.12.
* Libraries: mediabunny 1.62.1 (MPL-2.0), @mediabunny/ac3 and @mediabunny/dts 1.62.1, @ffmpeg/ffmpeg 0.12.15,
  @ffmpeg/core 0.12.10, esbuild 0.28, TypeScript 7.0.2 (typecheck clean, `erasableSyntaxOnly`).
* Oracle: the exact Python-engine command on the bundled ffmpeg 7.1:
  `ffmpeg -i f -vn -map 0:a:0? -af highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9 -ac 1 -ar 16000 -f f32le`.
  I also fetched ffmpeg 7.1's `af_dynaudnorm.c`, `af_biquads.c`, `resample.c`, `rematrix.c` and ported from them
  (my first recollection of dynaudnorm was wrong in four places; the source is the truth).
* Fixtures: the 29 files of `frontend/fixtures`; 58 extra files from `tools/make-extra-fixtures.mjs` (legacy codecs,
  DRM-encrypted AAC, truncated and mid-stream damaged files, odd PCM, 5.1 AAC / AC-3 / Opus, late audio start, two audio
  tracks); true-stereo, 5.1 and 7.1 FLACs and 11 sample-rate variants (8 kHz to 192 kHz); a 2.5 GB WAV, a 2.2 GB MP4, two
  20-minute AC-3 / E-AC-3 files; and the three 60-minute files from the fixtures track. All generated, none committed.
* **The machine is shared with other agents** (CPU 16 % to 96 % busy during the work). Wall-clock numbers are
  therefore noisy: where it matters I report best-of-N, CPU time, and the cleanest rounds; first runs under heavy
  load were up to 6x slower (e.g. 46x instead of 361x for the same job) and are not quoted.
* Parity metric: SNR = 10 log10(sum ref^2 / sum (ref - mine)^2) against the oracle, edges excluded; "identical" means
  limited only by float32 rounding.

## 3. Primary path: mediabunny + WebCodecs

`decodeToMono16k(file, { onProgress, signal, onChunk, collect, pipeline, padStart, gapFill, wasmCodecs, ... })`
(`src/decode/decode.ts`) opens the `File` through `BlobSource` (8 MiB read cache, nothing else in memory), picks the
audio track (first decodable one, like `-map 0:a:0`), streams `AudioSample`s through `AudioSampleSink`, converts each
to planar float32, runs the DSP pipeline (clean-up at the source rate -> down-mix -> polyphase resample), and writes
Int16 into a pre-sized buffer (a page list takes over if the duration estimate was too low). `onChunk` receives each
16 kHz Float32 chunk as it exists (back-pressure aware), so the engine can start Whisper before the file is finished
or skip collecting. `decode.worker.ts` wraps the same function: the `File` is passed by reference, progress is posted,
the PCM buffer is transferred, `cancel` aborts.

### 3.1 Worker or window?

`AudioDecoder`, `AudioData`, `EncodedAudioChunk`, `VideoDecoder` exist in a `DedicatedWorker` (probe in
`results/01-capability-probe.json`); `AudioContext`, `OfflineAudioContext` and `MediaRecorder` do not. Supported audio
decoders (identical in headless and headed Chrome and Edge): AAC-LC, HE-AAC, MP3, Opus, Vorbis, FLAC, mu-law, A-law,
PCM; **not** AC-3, E-AC-3, ALAC, AMR-NB/WB, WMA, DTS. Worker output was bit-identical to main-thread output for all
64 decodable files of the full matrix and for the 43 of the conformance suite (checksum compare). Browser support from MDN data (BCD 8.1.7,
`results/18-bcd.json`): `AudioDecoder` Chrome / Edge 94, Firefox 130 (desktop only), Safari 26, iOS Safari 26,
Samsung Internet 17, Firefox Android no. Worker exposure is by spec; I verified it only in Chrome and Edge.

### 3.2 Sixty minutes (`09-long-bench`, three rounds, fresh Chrome per run)

Speed is audio seconds / wall seconds for the whole job. Memory is the renderer process working set (the empty page
is 82 MB; the 110 MB Int16 result is inside the peak).

| File (60 min, 16 kHz mono) | Thread | x real time (min / median / max of 3 rounds) | Peak renderer memory | Time split (1 round) |
| --- | --- | --- | --- | --- |
| long-60min.wav (PCM s16, 110 MB) | window | 830 / 1006 / 1164 | 233-247 MB | decode 0.8 s, DSP 2.7 s |
| long-60min.wav | worker | 835 / 1030 / 1147 | 227-239 MB | decode 0.7 s, DSP 2.4 s |
| long-60min.m4a (AAC, 21 MB) | window | 237 / 365 / 417 | 277-280 MB | decode 6.3-10 s, DSP 3.2-4.3 s |
| long-60min.m4a | worker | 383 / 390 / 429 | 284-297 MB | decode 5.1-5.9 s, DSP 2.9-3.1 s |
| long-60min-video.mp4 (AAC + 1 fps video, 21 MB) | window | 309 / 410 / 467 | 273-309 MB | decode 4.9-7.6 s, DSP 2.6-3.6 s |
| long-60min-video.mp4 | worker | 413 / 413 / 605 | 292-317 MB | decode 3.7-5.3 s, DSP 2.1-3.0 s |

Reading it: the worker is not slower than the window (it is usually faster because the UI thread is free). Memory is
flat: 110 MB result + about 100 MB transient + the page, independent of the file length; the JS heap peak on the main
thread was 5 MB (WAV) / 188 MB (AAC, AudioData objects). Waiting for the AAC decode (Chrome's decoder, one `AudioData` per
64 ms, through mediabunny) costs about 1.4-2.9 ms per second of audio; demux is negligible (56,251 packets listed in 0.64 s = 5600x). I tried a
hand-driven `AudioDecoder` with deeper queues instead of mediabunny's 4-deep pump (10-minute AAC excerpt): 246-335x
(best at depth 16) vs 223-233x for mediabunny, i.e. not worth the extra code (`10-decode-speed`).

### 3.3 Files larger than 2 GB (`13-big-files`)

| File | Result | Peak renderer memory | Notes |
| --- | --- | --- | --- |
| 2,496,000,078 B WAV, 48 kHz stereo, 13,000 s (3.6 h) | decoded completely in a worker, 397 MB result | 549 MB (597 MB with clean-up) | 55x / 40x real time (mediabunny's generic PCM path converts sample by sample; 6x more samples per second than the 16 kHz mono test). The 30 s window at 12,000 s matches ffmpeg: SNR 76.6 dB, corr 0.99999999. |
| 2,192,734,506 B MP4 (MJPEG noise video + AAC, `moov` at the end, 64-bit offsets), 1,300 s | decoded, 40 MB result | 185-220 MB | 63-68x; window at 1,200 s: SNR 54 dB (AAC decoder differences). |

So 2 GB is **not** a limit of the primary path. It is a limit of the two fallbacks (section 6 and 7).

### 3.4 Progress and cancellation (`14-cancel-progress`, `14b-cancel-cpu`, 60-min m4a)

* Cancel latency after `abort()` once decoding runs: window 18, 30, 41 ms; worker 55, 82 ms (outcome always
  `CANCELLED`). During start-up of a fresh worker it takes 0.5-0.6 s because the abort waits for the module to load.
  Renderer CPU: 125-132 % in the second before the cancel, 6-10 % in the first second after, **0 %** from then on.
  The conformance run asserts cancel < 500 ms (window) and < 1.5 s (worker).
* Progress: `{ processedSeconds, totalSeconds, fraction, elapsedSeconds, xRealtime, phase }`, throttled to 10/s (median
  interval 200 ms), monotonic, last value 1.0 after a `finishing` event. `totalSeconds` comes from `computeDuration()`;
  `getDurationFromMetadata()` is **unreliable for MP3 without a Xing tag** (118.8 s promised for a 22.8 s file), so it is
  not used for progress.

### 3.5 What every container / codec does (`06-decode-matrix`, 67 files, Chrome; Edge gives the same 153/153)

SNR is against the Python command after the same clean-up. "Wasm" = lazy @mediabunny codec.

| Container / codec | Result | SNR vs ffmpeg | Remarks |
| --- | --- | --- | --- |
| WAV PCM 8 / 16 / 24 / float32 / WAVE_FORMAT_EXTENSIBLE, mono / stereo | ok | 69-89 dB (the 69 is the -35 dBFS file: int16 noise relative to a quiet signal) | software PCM path inside mediabunny |
| FLAC (mono, stereo, 5.1, 7.1) | ok | 75-85 dB | see 3.6 (final digital-silence frame) |
| MP3 (CBR / VBR / ID3v2 / stereo / MP2 layer II) | ok | 85 dB (stereo 44.1 kHz: 36.5, corr 0.9999) | gapless trim implemented (3.6) |
| AAC in M4A / MP4 / MOV / ADTS / MPEG-TS / fragmented MP4 / faststart | ok | 81-85 dB (5.1: 77) | priming trimmed from the negative first timestamp |
| Vorbis (Ogg) | ok | 85 dB | |
| Opus (Ogg / WebM / MKV / 5.1) | ok | 15.8 dB (corr 0.987); 77 dB for 5.1 mapping family 1 | sub-sample offset, see 3.6 |
| AC-3 / E-AC-3 (MP4, MKV, 5.1) | ok via wasm | 77-83 dB | `@mediabunny/ac3` (WASM build of FFmpeg's decoder); 20 min of AC-3 stereo in 12.3 s (98x), of E-AC-3 5.1 in 23.5 s (51x) in a worker, 259-276 MB peak |
| DTS (MKA) | ok via wasm | 82 dB | `@mediabunny/dts`; 22.7 s mono file 523 ms including the lazy load; long-file speed not measured |
| AAC with CENC encryption | error `DRM_PROTECTED` | - | "Encrypted media samples encountered" |
| ALAC, AMR-NB in 3GP (`samr`), Speex in Ogg | error `UNSUPPORTED_CODEC` | - | ffmpeg.wasm decodes all three |
| AVI, WMA, WMV, FLV, MPG, raw AMR (NB and WB), GSM, AIFF, AU, CAF | error `NOT_MEDIA` | - | mediabunny has no demuxer for them; ffmpeg.wasm decodes all |

### 3.6 Fidelity details worth knowing (all measured, `07-native-alignment`)

* **MP3 gapless.** WebCodecs and mediabunny emit the encoder delay; ffmpeg and `<audio>` trim it. Untreated, every LAME
  MP3 started 69.06 ms late (1,105 samples at 16 kHz) and correlated at -3 dB. `mp3.ts` reads the LAME / Info tag and
  skips `delay + 529` samples exactly like ffmpeg's `mp3dec.c`; SNR went from -2.8 dB to 84.9 dB. The end padding
  (about 14 ms) is not trimmed. Files without a tag are not trimmed by ffmpeg either (verified).
* **AAC priming.** mediabunny reports the first timestamp as -64 ms; dropping those frames gives sample-exact alignment
  (SNR 84.9 dB, length identical to ffmpeg).
* **Opus.** Chrome's decoder output differs from ffmpeg's by a fractional lag of -1.68 samples at 48 kHz (35 microseconds)
  and keeps 12.8 ms of tail that ffmpeg trims via the Ogg granule position. Irrelevant for ASR; it is why Opus parity is
  quoted as correlation 0.987-0.998 rather than SNR. Vorbis keeps 3.3 ms of tail.
* **FLAC tail.** mediabunny 1.62.1 emits 315 of the 316 frames of `passage-b.flac`: the last, 971-sample frame (12 bytes)
  is never produced (packets listed with `EncodedPacketSink`, `08-flac-tail`). Cause, inferred from the source and not
  confirmed upstream: `readNextFlacFrame` asks for at least 16 bytes at the frame start (`requestSliceRange(startPos, 16, ...)`),
  which a 12-byte frame cannot satisfy. A frame that small can only hold a constant (silent) sub-frame, so nothing audible is
  lost (61 ms of trailing silence here); the other four FLAC files were complete. Worth an upstream report.
* **Truncated WebM / MKV.** ffmpeg recovers 0.9-4 s more audio from a half-written cluster than mediabunny does.
* **Start offsets.** `audio-starts-at-2.5s.mp4`: the first sample is at 2.436 s. ffmpeg ignores the offset (the Python
  transcript is 2.4 s early against the player); the reference returns `startOffsetSeconds` and a warning, and
  `padStart: true` pads silence if the engine prefers that. Gaps in the middle are reported (`gapFill: 'silence'` fills).
* **Two audio tracks.** The first decodable track is used (ffmpeg's rule); the others are listed in a warning.
* **Level.** With ffmpeg's down-mix matrix a centred stereo signal peaks at +2 dBFS after dynaudnorm (1.27); ffmpeg keeps
  that in float32. The Int16 store therefore carries a `scale`: 1/32768 for mono, 1/16384 (headroom bit, -90 dBFS noise
  floor) when more than one channel is mixed. Consumers must use `int16ToFloat32(pcm, scale)`.

## 4. Resampler (`src/dsp/resampler.ts`)

Streaming polyphase windowed-sinc: Kaiser beta 9, cut-off 0.97 of the lower Nyquist, `ceil(32 / factor)` taps (even),
one exact table row per output phase (`outRate / gcd` rows) with a 1,024-row interpolated table only when that exceeds
1,024 (e.g. 44,117 Hz). Integer arithmetic for positions, so no drift on multi-hour files; state is the last N-1 samples.
It is deliberately the same design as libswresample's default (`resample.c` read from FFmpeg 7.1), so results can be compared
directly. Hot loops are split into three small functions (8 outputs per pass for integer decimation, 4 per pass for
rational ratios) because one big function was de-optimised by V8 when several rates ran in the same process.

**Parity with ffmpeg** (same decoded input into both resamplers; `02-resampler`): output length identical in every case
(`ceil(n * 16000 / rate)`, also verified for n = 0, 1, 2, 7 by unit test).

| Source rate | 8 k | 11.025 k | 12 k | 22.05 k | 24 k | 32 k | 37.8 k | 44.1 k | 44,117 | 48 k | 88.2 k | 96 k | 192 k |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SNR (dB) | 102 | 102 | 102 | 118 | 104 | 134 | 115 | 124 | 126 | 107 | 130 | 140 | 143 |

Frequency response of both, tones at 44.1 / 48 / 96 kHz: identical to 0.01 dB in the pass band and through the
transition (-0.39 dB at 7 kHz, -3.95 dB at 7.6 kHz, -26 dB at 8.5 kHz, -61 dB at 9 kHz, > -95 dB above 11 kHz).

**Speed inside a Chrome 155 module worker** (30 s of audio, best / median of 5 runs, machine at 16-38 % load,
`19-dsp-bench-browser`): 8 kHz 1322x / 882x, 11.025 kHz 775x / 555x, 22.05 kHz 670x / 469x, 24 kHz 662x / 595x,
32 kHz 997x / 958x, 44.1 kHz 370x / 261x, 48 kHz 659x / 565x, 88.2 kHz 192x / 140x, 96 kHz 309x / 300x.
**All above the 100x requirement, lowest median 140x (88.2 kHz).** Main thread is the same within noise. (Under heavy
load from other processes the same code measured 26x-79x in single runs; those are load artefacts, see section 2.)

## 5. Clean-up chain (`src/dsp/{biquad,dynaudnorm,cleanup,downmix,pipeline}.ts`)

Ported from FFmpeg 7.1 sources: RBJ biquads with ffmpeg's constants (`width` 0.707, not 1/sqrt(2)), a streaming
dynaudnorm including its boundary behaviour (virtual gains before the start, constant synthetic frames after the end, the
11-frame delay), `erf` to 1e-12, and the same "bypass above Nyquist" rule (the 7.8 kHz low-pass is skipped for 8 kHz
sources, exactly as ffmpeg does).

### 5.1 What ffmpeg really does (found by reading `-v debug`)

* The three filters run on **all channels at the source sample rate**, then ffmpeg down-mixes and resamples. With coupled
  channels (default) one gain track is computed from the peak over all channels.
* For sources that decode to **s16** (WAV, FLAC 16-bit) the chain converts to double before the high-pass: everything is
  float64. For sources that decode to **float** (AAC, MP3, Opus, Vorbis, AMR, AC-3: `fltp`) the negotiation inserts the
  conversion to double only *before dynaudnorm*, so the two biquads run in **float32**. That is ffmpeg's behaviour, not
  mine; it is why AAC / MP3 sources agree at 98 dB rather than 200 dB. I compute in float64 throughout.
* The ffmpeg down-mix matrix is **not normalised for float output**: stereo -> mono is (L + R) / sqrt(2), i.e. +3 dB for
  centred material; 5.1 -> mono is FL, FR 0.707, FC 1.0, surrounds 0.5, LFE 0. The `mean` mode (what Web Audio does) is
  3.0 dB lower for stereo and 10.7 dB lower for a 5.1 film whose dialogue sits in the centre channel, 12.9 dB for 7.1.

### 5.2 Parity (`04-cleanup-parity`)

| Check | Result |
| --- | --- |
| High-pass only, high-pass + low-pass vs ffmpeg forced to f64 (`r=f64`), 9 files (16 kHz) | SNR 204-655 dB / 220-589 dB, max difference 1e-9 or below |
| Full chain, 16 kHz mono fixtures (passage-b, quiet-speech, speech-over-noise, passage-a, speech-silence-speech, pink noise, music-like, silence, tone) | SNR 191-623 dB (tone-1k.mp3: 100 dB); silence stays exactly zero |
| Full chain, float-decoded sources (AAC, MP3, Opus, AC-3, AMR) incl. resampling | 85-101 dB (the floor is ffmpeg's own float32 biquads) |
| Full chain, stereo (dual mono and true stereo, 44.1 and 48 kHz), 5.1, 7.1 with speech in the centre channel | 124 / 124 / 108 / 108 / 108 dB; integrated loudness equal to 0.05 LU; peaks equal to 0.01 dB |
| Long-term spectrum in 11 bands from 20 Hz to 8 kHz (passage-a, quiet-speech, speech-over-noise) | difference 0.000 dB in every band |
| Segment boundaries, streaming chunk sizes 1 sample ... 100 000 samples | output bit-identical regardless of chunking |

Pipeline variants measured against `ffmpeg -af chain -ac 1 -ar 16000` (stereo / 5.1 columns show the cost of each choice):

| Variant | Mono 48 kHz | Stereo 44.1 kHz | 5.1 | Verdict |
| --- | --- | --- | --- | --- |
| A: filters at source rate, ffmpeg matrix (**default**) | 85.5 dB | 124 dB | 108 dB | parity |
| B: filters at source rate, mean down-mix | 85.5 dB | gain -3.01 dB (waveform identical, corr 1.0) | gain -10.7 dB | same waveform, quieter |
| C: down-mix, resample, then filter at 16 kHz | 18.6 dB (corr 0.993) | 9.8 dB | 13.0 dB | **not equivalent**: a 7.8 kHz Butterworth at fs = 16 kHz has a very different top octave than at 48 kHz |

C would be about 2x cheaper but changes what the model hears in the fricative band; it stays an option (`cleanup: 'post'`),
not a default. In a Chrome worker, A runs at (best / median) 2308x / 1786x (16 kHz mono), 306x / 256x (48 kHz mono),
227x / 196x (48 kHz stereo), 138x / 122x (96 kHz stereo) and 89x / 85x (48 kHz 5.1); the clean-up alone is 820x (48 kHz mono)
and 130x (5.1).

## 6. Fallback A: `decodeAudioData` (`src/decode/webaudio.ts`, main thread only)

Uses an `OfflineAudioContext(1, 1, 16000)` so the browser resamples while decoding, then the same pipeline. Cannot run
in a worker (no `AudioContext` there) and is not cancellable mid-decode.

* **Coverage in Chrome 155** (it is a subset of the primary path, plus nothing): decodes WAV (all PCM variants), FLAC, MP3
  (Chrome trims the LAME delay itself: length and alignment equal ffmpeg), AAC in M4A / MP4 / MOV / ADTS / fragmented MP4,
  Vorbis, Opus (Ogg / WebM / MKV), stereo and 5.1. **Fails** ("Unable to decode audio data"): AC-3, E-AC-3, DTS, ALAC, AMR,
  AVI, WMA/WMV, FLV, MPG, MPEG-TS, MP2 (WebCodecs reads it, `decodeAudioData` does not), AIFF, AU, CAF, GSM, Speex, CENC,
  damaged files. So in Chrome it never rescues a file the primary path rejects; it exists for browsers without
  `AudioDecoder`. (Safari's Core Audio may read more, e.g. CAF / AIFF / ALAC / AMR / AC-3 **(not measured)**.)
* **Fidelity:** for 16 kHz sources 81-85 dB. For anything it has to resample the filters run after the browser's own
  resampling (variant C above), so SNR is 11-17 dB (corr 0.97+): usable, not identical.
* **Speed:** 22.7 s files in 100-360 ms. 60 minutes: WAV 6.4 s (562x), M4A 12.6 s (286x), MP4 24.9 s (145x).
* **Memory (the real limit):** it holds the compressed file, the decoded float32 audio of every channel and the result.
  Measured peak private memory for 60 min of 16 kHz mono: **506 MB (WAV), 1,224 MB (M4A), 1,164 MB (MP4)**, i.e. 2.2-5.3x
  the decoded size (230 MB). Arithmetic: decoded = seconds x 16,000 x channels x 4 B (64 KB/s per channel). The module's
  budget check uses 5.3x: with the default 1.5 GiB (384 MiB on mobile or <= 4 GB devices) that allows about 79 min mono /
  40 min stereo on desktop and 20 / 10 min on a phone **(budget arithmetic, not measured on a phone)**.
* **Hard caps:** `new ArrayBuffer(2 GiB)` fails in Chrome 155 even with 15 GB of RAM free ("Array buffer allocation failed";
  1 GiB works); `file.arrayBuffer()` on the 2.5 GB WAV throws `NotReadableError`. Files near or above 2 GiB cannot use this path.
* **Browser support (MDN BCD):** `decodeAudioData` everywhere since Safari 6 / Firefox 25 / Chrome 14; `OfflineAudioContext`
  Safari 14.1 (iOS 14.5); `AudioContext({sampleRate})` Chrome 74, Firefox 61, Safari 14.1 (iOS 14.5); `Blob.arrayBuffer`
  Safari 14. So it is safe on every browser the plan targets, subject to the memory budget (iOS kills the tab on memory
  pressure, per the plan).

## 7. Fallback B: ffmpeg.wasm (`src/decode/ffmpegwasm.ts`)

### 7.1 Facts (`17-core-size`, `22-wasm-memory-limits`, `23-ffmpeg-load`, `13-big-files`, `16-ffmpeg-long`, `11-fallbacks`)

| Item | Measured |
| --- | --- |
| `ffmpeg-core.wasm` 0.12.10 | 32,232,419 B = **30.74 MiB** (gzip -9 9.8 MiB, brotli -11 6.85 MiB); jsDelivr serves it as brotli, **9,289,992 B** on the wire; `ffmpeg-core.js` 109 KB (31 KB br); `@ffmpeg/ffmpeg` wrapper 16.7 KB |
| Cloudflare Pages | per-file limit 25 MiB = 26,214,400 B -> **the core cannot be self-hosted unsplit**. jsDelivr and unpkg both serve it with `Access-Control-Allow-Origin: *`, `Cross-Origin-Resource-Policy: cross-origin`, one-year immutable cache, so it also works if the page ever sets COEP |
| Load time | 0.20-0.23 s (6 fresh browsers, localhost, `no-store`, file in the OS cache: fetch + compile + instantiate); 3.2-3.7 s on the first run of the session (cold disk, machine busy). Add the download of 9.3 MB; a phone will compile slower **(not measured)** |
| Wasm memory | single-thread core, memory initial 32 MiB, **max 2 GiB**, not shared (no SharedArrayBuffer / COOP / COEP needed) |
| WORKERFS | mounting a `File` takes 2-7 ms and **copies nothing**: a 2.38 GiB WAV and a 2.0 GiB MP4 were mounted and decoded (30 s windows at 12,000 s and 1,200 s in 2.6 s and 0.5 s) with the renderer growing only 82 -> 231 MB; window output equals native ffmpeg at 140.7 dB |
| MEMFS (`writeFile`) | a 110 MB file costs 2.0 s and +258 MB; a 2.5 GB file cannot be read into an ArrayBuffer at all |
| Maximum practical input | unbounded by WORKERFS (tested 2.4 GiB). Output is the limit: 16 kHz mono float32 = 230 MB per hour in MEMFS, so the module cuts jobs into 30-minute segments (6 s overlap discarded) |
| Throughput | 17-130x for short mono files (includes mount + probe); **60 min in 18-22 s (m4a, 196x) and 24 s (WAV, 149x)**; peak renderer 820-850 MB; multichannel is slow (20 s of 5.1 FLAC in 6 s = 3.3x) because the clean-up runs on six channels at 48 kHz in single-thread wasm |
| Cancel | `terminate()`: returns at the requested time (3.01 s for a cancel at 3 s); the next job reloads the core (0.2-3 s) |
| Parity | SNR 75-85 dB vs native ffmpeg (it is ffmpeg: the filters run inside it). Speex: wasm output has the right length; the native 7.1 binary here doubles it (reference unreliable) |
| Segmentation caveat | segment 2 of an AAC file is time-aligned (lag 0) but not bit-identical to a single pass: PNS noise substitution restarts from a different state, 79 of 3,600 s differ (overall -45 dB). WAV: 82 dB. So segment only above 1 h |
| Licence | `@ffmpeg/core` is **GPL-2.0-or-later** (built with libx264 / libx265); the JS wrapper is MIT; mediabunny is MPL-2.0; the AC-3 / DTS extensions are MPL-2.0 wrappers around a WASM build of FFmpeg's own decoders (their README build flags are `--disable-all --enable-decoder=ac3,eac3`, no `--enable-gpl`, so LGPL terms apply to that code; this is a reading of the README, not legal advice) |

### 7.2 Decision

Ship it as an optional fallback, not in the main bundle:
1. Lazy: nothing is fetched until a file needs it (AVI, WMA/WMV, FLV, MPG, AMR, GSM, AIFF/AU/CAF, Speex, ALAC).
2. Consent: `beforeFfmpegDownload` asks first ("one-time 9 MB download"); declining or being offline shows the
   plain "convert this file to MP3, M4A or WAV first" message. This is what keeps the owner's rule: today the Python
   engine reads anything ffmpeg reads, so removing these formats would be a regression.
3. Host: jsDelivr, pinned to `@ffmpeg/core@0.12.10`, hash-verified after download (fetch + `crypto.subtle`, then pass blob
   URLs), not Pages. Alternative: mirror next to the models on Hugging Face (same dependency the plan already has) **(not
   measured)**, or split the file into two 16 MiB parts on Pages and join them in JS (+30 MB of transient memory).
4. AC-3 / E-AC-3 / DTS do **not** need it: the MPL extensions are 0.24 MB / 0.32 MB brotli (first use only) and decode 20-minute files at 98x (AC-3 stereo) / 51x (E-AC-3 5.1) in a worker.
5. Owner decision: the GPL core. Options: accept GPL obligations (offer the corresponding source, notice in the legal page),
   or build an LGPL-only audio core without x264 / x265 (would also shrink it; I could not build one here, so its size
   is **not measured**), or ship only "convert first".

## 8. Probing and error taxonomy (`probeMedia`, `errors.ts`; 153 conformance checks pass in Chrome and Edge)

`probeMedia(file)` never decodes audio. It returns the container, every audio track (codec, rate, channels, language,
`canDecode`, which WASM codec would help), the duration from the audio track and the track the decoder would pick;
failures come back as `{ ok: false, error, fallbacks }` where `fallbacks` lists other decoders that might read the file.

| Situation (test file) | Code | How it is detected | User-facing message (plain language) | Retry with another decoder? |
| --- | --- | --- | --- | --- |
| 0 bytes (`empty.wav`) | `EMPTY_FILE` | `file.size === 0` | "This file is empty (0 bytes), so there is nothing to transcribe. Check that it finished downloading or saving." | no |
| Not media / unknown container (`garbage.bin`, text or PNG renamed `.mp3` / `.wav`, 1-byte file) | `NOT_MEDIA` | `UnsupportedInputFormatError` | "This does not look like an audio or video file that we can read. It may be damaged, or it may be a different kind of file." | decodeAudioData, then ffmpeg.wasm (AVI, WMA, FLV, AMR... are *in this class too*, so the answer after all fallbacks failed is the same message) |
| Video without sound (`noaudio.mp4`) | `NO_AUDIO_TRACK` | container has tracks, none audio | "This file has no audio track. Videos recorded without sound (some screen recordings, animated clips) cannot be transcribed." | no |
| MP4 / MOV without `moov` (`corrupt.mp4`, cut-off `.m4a`) | `CORRUPT` | recognised ISO-BMFF with zero tracks (mediabunny reports "MP4, no tracks" with no error: **the trap that would otherwise read as "no audio"**) | "The file is corrupted or not a supported media format. It may have been cut off while downloading or saving - try downloading or exporting it again." | no (ffmpeg says "moov atom not found" too) |
| Unsupported codec (AMR in 3GP, ALAC, Speex, DTS/AC-3 with `wasmCodecs:false`, WMA) | `UNSUPPORTED_CODEC` | `canDecode() === false` or `NotSupportedError`; codec from the container id (`samr`, `alac`) | "This file uses the AMR-NB (phone voice) audio format, which your browser cannot decode. Convert it to MP3, M4A or WAV first (for example with VLC, HandBrake or an online converter) and add the converted file." (codec name per `friendlyCodec`) | WASM codec if AC-3 / E-AC-3 / DTS, otherwise ffmpeg.wasm |
| DRM / encrypted (CENC AAC) | `DRM_PROTECTED` | "Encrypted media samples encountered" | "This file is copy-protected (DRM-encrypted), so it cannot be read. Protected purchases and streaming downloads cannot be transcribed; use an unprotected recording instead." | no (ffmpeg.wasm only reports every packet failing; it is classified `CORRUPT` there) |
| Truncated / partly written (`trunc-*`) | ok + warning `truncated` | decoded end < promised duration - 3 % (audio) / 10 % (video); promised = max(header, track scan), or the Xing frame count for MP3 | "The file contains less audio than it promises: 22 s expected, 9 s could be read. It may be an incomplete download or damaged." | no |
| Damaged in the middle (`damaged-mid-*`) | ok + warnings `decode-error` / `truncated` | decoder error after audio was produced | "Damaged audio near 8.8 s was skipped (about 0.25 s replaced by silence)." and, if the demuxer cannot continue, the `truncated` message above | no |
| Shorter than 0.3 s (`short-0.05s.wav`, `valid-empty-data.wav`) | `TOO_SHORT` | decoded duration < 0.3 s | "The audio is too short to transcribe." (the Python engine's sentence) | no |
| Larger than the chosen decoder can hold | `TOO_LARGE` | decodeAudioData budget / 2 GiB cap | "This file is too large for the method your browser has to use to read it. Try a desktop version of Chrome or Edge, which can read files of any size, or split or convert the file first." | ffmpeg.wasm (WORKERFS has no size limit) |
| Out of memory | `OUT_OF_MEMORY` | `RangeError` / allocation failure | "Your device ran out of memory while reading this file. Close other tabs and try again, use a computer instead of a phone, or use a shorter file." | no |
| No `AudioDecoder` | `NO_WEBCODECS` | feature check | "This browser is too old to read this kind of file. Please update it..." (only if decodeAudioData also failed) | decodeAudioData |
| User cancelled | `CANCELLED` | `AbortSignal` | "Cancelled." | no |

* **Larger than 2 GB:** *not an error* on the primary path (section 3.3). `TOO_LARGE` only appears on the fallbacks.
* **Messages never contain a stack trace or `undefined`; `technical` carries the exact reason** for logs (the logs page
  stays browser-local). All messages have a test; two are the Python engine's own sentences, kept word for word.
* **Mid-stream damage** (`21-damage`, 3-6 KB of random bytes written over the middle of a 22 s file). WebCodecs closes a
  decoder after its first error, whereas ffmpeg skips the bad packet and goes on, so the loop restarts a fresh decoder
  0.25 / 0.5 / 1 / 2 / 4 s further on (up to 20 times) and replaces the skipped span with silence, which keeps every later
  timestamp aligned with the player (ffmpeg's own timeline shortens at the damage). Before this the AAC files stopped at
  8.8 s; now: AAC (M4A, MP4) 22.78 s with 4 skips, Opus 22.75 s with 5 skips, MP3 22.0 s (the decoder resyncs by itself,
  ffmpeg 21.96 s), MKV / WebM complete, WAV passes the noise burst through (nothing can detect it). **Ogg Vorbis and FLAC
  stop at the damage** (10.7 s and 10.9 s of 22.7 s; ffmpeg recovers 19.7 s and 22.4 s) because mediabunny's Ogg and FLAC
  demuxers cannot resynchronise; the user gets the `truncated` warning, not a silent short transcript.

## 9. Microphone path (`15-mic`, Chrome 155 with a fake capture device that plays `passage-b-16k-mono.wav`)

`MediaRecorder.isTypeSupported` (Chrome and Edge): `audio/webm` (Opus, the default), `audio/mp4;codecs=mp4a.40.2` and
`audio/mp4` (Opus in MP4) **true**; `audio/ogg;codecs=opus`, `audio/wav`, `audio/aac` false. Safari records
`audio/mp4` (AAC) per MDN **(not measured)**. Both real `getUserMedia` input and a `MediaStreamDestination` fed with a decoded
fixture were recorded for 9 s, in one piece and with `timeslice = 1000` (chunks concatenated): **24 of 24 recordings decoded
through the unchanged `decodeToMono16k`**, no warnings, durations 8.6-9.0 s, WebM / MP4, Opus 48 kHz or AAC 44.1 / 48 kHz,
always 2 channels even from a mono microphone. MediaRecorder WebM has no duration or cues; mediabunny handled it (decode
time 0.3-1.3 s). Content check, 20 ms RMS envelope correlation against the source: AAC 0.99999, Opus 0.973-0.978 (lossy plus
the stereo duplicate); MP4/Opus shows an 80 ms start offset. So the microphone needs no separate decoder: record, then
hand the Blob to the same function. (Live partial decoding while recording was not built.)

## 10. Decision table: situation -> decoder -> limits

| Situation | Decoder | Limits |
| --- | --- | --- |
| Chrome / Edge / Firefox >= 130 desktop / Safari 26+ / Chrome Android: WAV, MP3, M4A / MP4 / MOV / ADTS / TS (AAC), FLAC, Ogg Vorbis, Opus (Ogg, WebM, MKV), MP2, MediaRecorder output | **mediabunny + WebCodecs**, in the engine worker | no size limit (tested 2.5 GB, 3.6 h); memory = page + 110 MB per hour of result; 240-1150x for 16 kHz mono, 55x for 48 kHz stereo PCM |
| AC-3 / E-AC-3 (TV and film rips), DTS | same + lazy WASM codec (`@mediabunny/ac3`, `@mediabunny/dts`) | +0.24 MB / +0.32 MB brotli on first use; 98x (AC-3 stereo) / 51x (E-AC-3 5.1), about 2.4 min for a 2 h film; needs `worker-src blob:` in the CSP (the extension builds its worker from a Blob URL) |
| Browser without `AudioDecoder` (Safari <= 25, Firefox < 130, Firefox Android) | `decodeAudioData` on the main thread | files < 2 GiB; peak 2.2-5.3x decoded size: about 79 min mono / 40 min stereo on desktop (1.5 GiB budget), 20 / 10 min on phones; blocks the UI between chunks; not cancellable inside the browser's decode |
| Container the primary path cannot parse: AVI, WMA / WMV, FLV, MPG, raw AMR / 3GP-AMR, GSM, AIFF / AU / CAF, Speex, ALAC | **ffmpeg.wasm** (consent, jsDelivr) | one-time 9.3 MB download + 0.2 s start (3 s when cold); any input size via WORKERFS (2.4 GiB tested); 20-200x mono, 4-7x for 6 channels; wasm heap 2 GiB; segments of 30 min |
| Declined / offline / unknown format | clear error naming the codec | "convert this file to MP3, M4A or WAV first" |
| DRM, 0-byte, no audio track, cut-off MP4, shorter than 0.3 s | error, no fallback | messages in section 8 |
| Truncated or damaged in the middle | primary path, partial result + warning | what ffmpeg would also produce; flagged to the user |
| Microphone | MediaRecorder -> Blob -> same primary path | WebM/Opus or MP4/AAC-Opus; ~0.5 s decode per 9 s clip |
| Very long on a phone (> 1 h) | primary path with `collect:false` + `onChunk` | the engine keeps only its window; spilling PCM to OPFS is **not implemented** |

## 11. Differences from the Python engine (complete list)

1. Biquad precision on float-decoded sources: float32 in ffmpeg, float64 here (-98 dB between them, not audible, not
   measurable in ASR terms).
2. Decoder implementations: Chrome's AAC / MP3 / Vorbis / FLAC / Opus decoders vs ffmpeg's. Waveforms agree at 75-85 dB
   (Opus: corr 0.987-0.998 with a 35 microsecond sub-sample offset). Expect transcripts to match to the usual
   run-to-run variation, but the golden-file accuracy run (plan step 5) is the proof; I could not run Whisper here.
3. End padding: MP3 +14 ms, Opus +12.8 ms, Vorbis +3.3 ms of tail that ffmpeg trims; FLAC loses a final silent frame
   (up to one block) in mediabunny 1.62.1.
4. Start offset: reported, not padded by default (the Python engine ignores it too).
5. Level of stereo / multichannel files: identical to ffmpeg by default (down-mix matrix), stored with a headroom bit. If
   the engine team wants "never louder than 0 dBFS" instead, `downmix: 'mean'` is -3.0 dB (stereo) / -10.7 dB (5.1).
6. Truncated WebM / MKV: ffmpeg recovers up to 4 s more.
7. decodeAudioData fallback: filters run after the browser's resampling (11-17 dB SNR for resampled sources).
8. Not reproduced: nothing in the clean-up chain; `-map 0:a:0?` selection is reproduced (with a skip for undecodable first tracks).

## 12. Risks and unknowns

* **Safari and Firefox were not tested** (only Chrome and Edge exist here). Everything about them is from MDN data or
  documentation: WebCodecs audio in Safari 26 / Firefox 130, worker exposure, iOS memory, `MediaRecorder` AAC.
* mediabunny is a single-maintainer MPL-2.0 library at 1.62; the FLAC short-frame quirk shows it has edge cases. The
  reference works around nothing silently; pin the version and keep the conformance suite in CI.
* Throughput numbers were taken on a shared machine; the repeated 60-minute runs are the most reliable. Phones will be
  several times slower **(not measured)**.
* HE-AAC (SBR) decoding was not verified: ffmpeg's native encoder cannot make a valid HE-AAC file (no libfdk_aac) and the
  fixture it produced was invalid, so it is excluded; Chrome reports `mp4a.40.5` as supported.
* CSP: the AC-3 / DTS extensions and `decode.worker` need `worker-src 'self' blob:`; ffmpeg.wasm needs
  `script-src 'wasm-unsafe-eval'` and `connect-src https://cdn.jsdelivr.net`. COOP / COEP are not required by anything here.
* GPL core for ffmpeg.wasm (section 7), jsDelivr as a third-party fetch (the user's IP reaches the CDN; the file never leaves
  the device).
* The reference stores the whole 16 kHz result in memory (110 MB / h; 4 h = 440 MB). Fine on desktop, not on a phone.

## 13. What the engine team needs from this

* Call `decodeMedia(file, { signal, onProgress, ffmpegWasm?, beforeFfmpegDownload? })` inside the engine worker; keep
  `result.pcm` (Int16) and `result.scale`; feed Whisper / VAD windows with `int16ToFloat32(pcm, scale, start, end)`.
  Add `result.startOffsetSeconds` to timestamps if the player should line up, and surface `result.warnings` in the UI.
* Defaults to keep: `cleanup: 'native'`, `downmix: 'ffmpeg'` (parity), `partialOnError`, first-decodable-track policy.
* Map `DecodeError.code` -> UI with `userMessage`; log `technical`.
* The Qwen3-ASR engine takes the same 16 kHz mono float input: nothing audio-specific differs.
* Reproduce: `node tools/make-extra-fixtures.mjs && node tools/build.mjs && node --test "test/node/*.test.ts" &&
  node test/browser/run-conformance.mjs` (about 45 s, 18 unit tests, 153 browser checks; `BROWSER_CHANNEL=msedge` for Edge).
