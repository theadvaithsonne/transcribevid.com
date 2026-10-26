# engine/audio: any media file -> 16 kHz mono PCM, in the browser

Port of the audio spike's reference code (`docs/in-browser/spike/audio.md`). Pure TypeScript with no Angular imports.
It runs the same in a window and in a dedicated worker. Its only dependency is `mediabunny` (pinned 1.62.1).

## API

```ts
import { decodeMedia, probeMedia, int16ToFloat32, DecodeError } from './engine/audio';

const probe = await probeMedia(file);      // never throws: { ok, container, audioTracks, chosen, canDecode, channels, durationSeconds ... }
const r = await decodeMedia(file, {
  signal,                                  // AbortSignal -> DecodeError CANCELLED (20-80 ms after abort)
  onProgress: (p) => ui(p.fraction),       // { processedSeconds, totalSeconds, fraction, elapsedSeconds, xRealtime, phase }, ~10/s
  onChunk: (chunk, { startSample }) => vad.push(chunk),   // optional: 16 kHz Float32 as it is produced (copy to keep)
  collect: true,                           // false on low-memory devices: pcm comes back empty, use onChunk
});
r.pcm                  // Int16Array, 16 kHz mono
r.scale                // float = pcm[i] * scale (1/32768, or 1/16384 when channels were mixed: headroom bit)
r.durationSeconds      // r.samples / 16000
r.startOffsetSeconds   // first sample's container timestamp: add it to transcript times to line up with the player
r.warnings             // [{ type, message }]: truncated, decode-error, start-offset, gap, multiple-audio-tracks, track-skipped, clipped, format-change
r.path                 // 'webcodecs' | 'webaudio'

const window = int16ToFloat32(r.pcm, r.scale, startSample, endSample);   // what the VAD / Whisper consume
```

Errors are `DecodeError { code, userMessage, technical, codec, container, suggestion }`. The page shows
`userMessage` and the Logs page shows `technical`. Codes: `EMPTY_FILE`, `NOT_MEDIA`, `NO_AUDIO_TRACK`, `CORRUPT`,
`UNSUPPORTED_CODEC`, `DRM_PROTECTED`, `TOO_LARGE` (fallback only), `OUT_OF_MEMORY`, `TOO_SHORT` (< 0.3 s),
`NO_WEBCODECS`, `CANCELLED`, `DECODE_FAILED`. Across a worker boundary, use `serializeError()` and `reviveError()`.

Worker: `new Worker(new URL('./audio.worker', import.meta.url), { type: 'module' })` with the protocol at the top of
`audio-worker-core.ts`: `decode`, `probe` and `cancel` messages; the `File` is passed by reference and the PCM buffer
comes back transferred. The engine worker (`engine/worker/`) can call `decodeMedia` directly instead.

## Files

| File | What |
|---|---|
| `index.ts` | `decodeMedia` (decoder order) and the public exports |
| `decode.ts` | `probeMedia`, `decodeWithWebCodecs`: track choice, streaming loop, damage recovery, warnings |
| `media-source.ts` | `MediaOpener` seam and `openWithMediabunny` (BlobSource 8 MiB windows + AudioSampleSink) |
| `webaudio.ts` | `decodeAudioData` fallback (main thread only) with the memory budget |
| `pipeline.ts` | `Mono16kPipeline`: clean-up at the source rate -> down-mix -> resample |
| `biquad.ts`, `dynaudnorm.ts`, `cleanup.ts` | ffmpeg 7.1 `highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9` |
| `downmix.ts` | ffmpeg's `-ac 1` matrix (and `mean`) |
| `resampler.ts` | streaming polyphase windowed-sinc, libswresample-compatible |
| `pcm.ts` | Int16 packing (`Pcm16Builder`), `int16ToFloat32` |
| `mp3.ts` | LAME / Xing gapless tag (the encoder delay ffmpeg trims) |
| `errors.ts` | error taxonomy, messages, (de)serialisation, `classifyError` |
| `audio-worker-core.ts`, `audio.worker.ts` | worker protocol and entry |
| `golden-fixtures.ts` | ffmpeg 7.1 outputs used by `dsp.spec.ts` (generated, do not edit) |
| `ffmpeg.ts` | the opt-in ffmpeg.wasm converter: pinned core, SHA-256, WORKERFS, segments, error classes |
| `wav.ts`, `preview.ts` | 16 kHz mono WAV Blobs; `buildWavPreview(file)`: the player of a file the browser cannot play (decoded again in the decode worker, no clean-up filters) |

## Defaults (parity with the Python engine)

* `pipeline.cleanup: 'native'`: the three filters run on all channels at the source rate, then the down-mix and
  resampling follow. This is ffmpeg's order. `'post'` (filter at 16 kHz) is about 2x cheaper but measures 10-19 dB
  SNR against ffmpeg; `false` corresponds to "enhance audio" off.
* `pipeline.downmix: 'ffmpeg'`: stereo becomes (L+R)/sqrt(2), as in the Python engine. It is stored with a headroom
  bit. `'mean'` is 3.0 dB quieter for stereo and 10.7 dB quieter for 5.1.
* Track: the first audio track the browser can decode (ffmpeg's `-map 0:a:0`, but an undecodable first track is
  skipped). Other tracks are listed in a warning. `trackIndex` overrides the choice.
* `partialOnError: true`: on damaged data, decoding restarts a fresh decoder 0.25 / 0.5 / 1 / 2 / 4 s further on, up
  to 20 times, and the skipped span becomes silence so later timestamps stay aligned. If the stream breaks for good,
  what was decoded is kept (at least 1 s) and a warning is added.
* `padStart: false` (the offset is reported instead), `gapFill: 'none'`, `minSeconds: 0.3`.

## Decoder order and limits (`spike/audio.md` section 10)

1. **WebCodecs through mediabunny** (Chrome / Edge 94+, Firefox 130+ desktop, Safari 26+, Chrome Android), in a
   window or worker. Formats: WAV, MP3, M4A / MP4 / MOV / ADTS / TS (AAC), FLAC, Ogg Vorbis, Opus (Ogg / WebM / MKV),
   MP2, MediaRecorder output. There is no size limit (2.5 GB tested in the spike). Memory is the page plus 115 MB per
   hour of result. Speed is 240-1150x real time for 16 kHz mono and 55x for 48 kHz stereo PCM.
2. **decodeAudioData**, main thread only, when `AudioDecoder` is missing or could not read the file. Files must be
   under 2 GiB, within a budget of 1.5 GiB on desktop and 384 MiB on phones or devices with `deviceMemory <= 4`
   (about 79 / 20 min of mono audio). This path blocks the UI between chunks and cannot be cancelled inside the
   browser's own decode.
3. **ffmpeg.wasm** (`ffmpeg.ts`), in a worker only and only with `ffmpeg` set, i.e. after the visitor answered yes to
   "This file needs a 9 MB converter that runs in your browser. Load it?" (core/transport ConverterConsent, asked once
   by the upload page; the engine worker gets `plan.converter`). Tried after `NOT_MEDIA`, `UNSUPPORTED_CODEC`,
   `NO_WEBCODECS`, `DECODE_FAILED`, `TOO_LARGE`: AVI, WMA / WMV, FLV, MPG, raw AMR and AMR-in-3GP, GSM, AIFF / AU /
   CAF, Speex, ALAC, AC-3 / E-AC-3 / DTS. `@ffmpeg/core` 0.12.10 (GPL-2.0-or-later, docs/in-browser/LICENCES.md) comes
   from `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/`, is checked against its SHA-256 and runs in this
   worker (WORKERFS mount, nothing copied into the wasm heap; 30 min segments with 6 s discarded overlap above 36 min;
   the Python engine's own `-af` chain). Its answer is final; a failed download is `CONVERTER_UNAVAILABLE`.
4. Otherwise the first error is reported. When WebCodecs is missing, the fallback's own error is reported instead.
   Without the converter, AVI, WMA / WMV, FLV, MPG, raw AMR, GSM, AIFF / AU / CAF end as `NOT_MEDIA`, and AMR-in-3GP,
   ALAC, Speex, AC-3 / E-AC-3 and DTS end as `UNSUPPORTED_CODEC` naming the codec. Both messages say "Convert it to
   MP3, M4A or WAV first".

Errors no other decoder could fix (`EMPTY_FILE`, `NO_AUDIO_TRACK`, `CORRUPT`, `DRM_PROTECTED`, `CANCELLED`,
`TOO_SHORT`, `OUT_OF_MEMORY`) are thrown immediately.

## Differences from the Python engine (complete list, from `spike/audio.md` section 11)

1. Biquad precision on float-decoded sources: float32 in ffmpeg, float64 here (-98 dB between them, not audible, not
   measurable in ASR terms).
2. Decoder implementations: Chrome's AAC / MP3 / Vorbis / FLAC / Opus decoders vs ffmpeg's. Waveforms agree at 75-85 dB
   (Opus: corr 0.987-0.998 with a 35 microsecond sub-sample offset). Expect transcripts to match to the usual
   run-to-run variation, but the golden-file accuracy run (plan step 5) is the proof.
3. End padding: MP3 +14 ms, Opus +12.8 ms, Vorbis +3.3 ms of tail that ffmpeg trims; FLAC loses a final silent frame
   (up to one block) in mediabunny 1.62.1.
4. Start offset: reported, not padded by default (the Python engine ignores it too).
5. Level of stereo / multichannel files: identical to ffmpeg by default (down-mix matrix), stored with a headroom
   bit. If the engine team wants "never louder than 0 dBFS" instead, `downmix: 'mean'` is -3.0 dB (stereo) / -10.7 dB
   (5.1).
6. Truncated WebM / MKV: ffmpeg recovers up to 4 s more.
7. decodeAudioData fallback: filters run after the browser's resampling (11-17 dB SNR for resampled sources).
8. Not reproduced: nothing in the clean-up chain; `-map 0:a:0?` selection is reproduced (with a skip for undecodable
   first tracks).

Changes made in this port, compared with the spike's reference code:

* ffmpeg.wasm is opt-in (M5b, `ffmpeg.ts`); without the visitor's yes `NOT_MEDIA` carries the convert-first advice.
* The `DECODE_FAILED` message no longer embeds the technical reason, so the page never shows it.
* A browser without WebCodecs reports the fallback's error (for example `TOO_LARGE`) instead of `NO_WEBCODECS`.
* `pcm` is an empty `Int16Array` with `collect: false`, not `null`.

## Specs

`dsp.spec.ts` ports the spike's 18 unit tests. Its ffmpeg expectations come from `golden-fixtures.ts`, generated by
`scratchpad/m3-audio/make-golden.mjs` with the Python engine's ffmpeg 7.1. `errors.spec.ts` covers the taxonomy and
`pcm.spec.ts` the Int16 packing. `decode.spec.ts` covers the public API, the fallback, the MP3 tag and the worker
protocol against a fake `MediaOpener`. The real mediabunny + WebCodecs path needs a browser and is covered by the
check below.

```
cd frontend && npx ng test --watch=false --include "**/engine/audio/*.spec.ts"
```

## Browser check (headless Chrome)

The check lives in the session scratchpad (`m3-audio/`), next to the spike's `audio/` project. It needs
`audio/node_modules` (esbuild, playwright-core), Chrome, and the ffmpeg oracle at
`backend/.venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe`.

```
node m3-audio/build.mjs              # bundles browser/tests.ts + this folder's audio.worker.ts into m3-audio/dist
node m3-audio/run-conformance.mjs    # BROWSER_CHANNEL=msedge for Edge
```

For each of the 20 files in `frontend/fixtures/audio` (wav, mp3, m4a, ogg, opus, flac, webm, mp4, mkv, mov, and the
broken ones), it runs `decodeMedia` on the main thread and in the module worker. Decodable files must match the
Python engine's command (SNR >= 60 dB; Opus correlation >= 0.98), and the main thread and worker must produce the same
checksum. Broken files must fail with their documented code: `EMPTY_FILE`, `NO_AUDIO_TRACK`, `CORRUPT`,
`UNSUPPORTED_CODEC` (AMR, AC-3), and `NOT_MEDIA` (AVI, raw AMR). It also checks that cancel is fast and that progress
is monotonic.

## Follow-ups

* **AC-3 / E-AC-3 / DTS:** `@mediabunny/ac3` and `@mediabunny/dts` are not dependencies of the app, so they are not
  wired in. `probeMedia` reports `needsExtension: 'ac3' | 'dts'` for such tracks. Adding them means adding the two
  packages (1.62.1, MPL-2.0, +0.24 / +0.32 MB brotli, lazy chunks), registering the decoder before decoding, and
  allowing `worker-src blob:` in the CSP (spike/audio.md section 10).
* ffmpeg.wasm is in (M5b, opt-in, `ffmpeg.ts`). The MPL `@mediabunny/ac3` / `@mediabunny/dts` extensions would
  decode AC-3 / DTS without the GPL converter and 30x smaller; still not added (two npm packages).
* Spilling PCM to OPFS for very long files on phones: not implemented. Use `collect: false` with `onChunk`.
* Safari and Firefox are untested; the spike measured Chrome and Edge only.
