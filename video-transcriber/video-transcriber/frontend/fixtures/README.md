# Test fixtures

Small, deterministic, license-clean speech and audio files for testing the in-browser transcriber.
All speech is synthesised locally with Windows SAPI (Microsoft David Desktop = male, Microsoft Zira Desktop = female), so there is no third-party recording and no licence to track. There is no Hindi voice, so Hinglish cannot be tested with these files (use a separately sourced clip).

| Passage | Voice | Length | Content |
|---|---|---|---|
| a | David | 73.1 s | 6 paragraphs, 14 sentences: 1,250 dollars, March 3rd, 14 days, 2 weeks, 85 percent, 200 milliseconds, Kubernetes, PostgreSQL, Hyderabad, a question, a three-step list, contractions |
| b | Zira | 22.7 s | intro with a question, "3 simple recipes", "20 minutes", contractions |
| c | David | 7.0 s | "Friday, April 12th" |

`texts/passage-X.txt` is the spoken text; `texts/passage-X.normalized.txt` is what a recogniser should produce after normalisation: lowercase, punctuation removed (apostrophes kept), numbers as spoken words (`1,250` = one thousand two hundred fifty, `March 3rd` = march third).

## Layout and tiers

* `audio/` committed, 4.93 MB on disk (limit 5 MB). Container/codec variants are mostly of passage-b (22.7 s) to stay small.
* `generated/` git-ignored. Larger files that would not fit the 5 MB budget: `passage-a-16k-mono.wav` (2.3 MB), `passage-a.mp3`, `passage-a.m4a`, `passage-b-eac3.mp4`, `silence-30s.wav`, `noise-pink-30s.wav`, `music-like-30s.wav`, `speech-over-noise.wav`, `quiet-speech.wav`, plus the SAPI masters (`master-*.wav`, 22.05 kHz) and `speech-*-16k.wav` intermediates. Recreate with `tools/make-fixtures.ps1` (takes about 10 s).
* `manifest.json` lists every file of both tiers: name, container, audioCodec, durationSeconds (really decoded with ffmpeg; `headerDurationSeconds` is the container header), sampleRate, channels, bytes, sha256, voice, passage, expectedText (normalised, or null), expectedBehaviour, and for `speech-silence-speech.wav` the exact timeline. Rebuilding is bit-for-bit reproducible on this machine (all sha256 unchanged on a second run).

## Files

Speech baselines: `passage-b-16k-mono.wav`, `passage-c-44k-stereo.wav` (stereo 44.1 kHz; only the first 5 s of passage-c, not the "first 20 s", because a 20 s 44.1 kHz stereo WAV is 3.5 MB and would break the budget; output must be a prefix of the expected text), `generated/passage-a-16k-mono.wav`.

Codec/container variants of passage-b: `.mp3` (64k), `.m4a` (AAC 48k), `.ogg` (Vorbis), `.opus`, `.flac`, `.webm` (Opus), `-video.mp4` (H.264 160x90 1 fps black + AAC), `-video.mkv` (H.264 + Opus), `-video.avi` (MPEG-4 + MP3), `-video.mov` (H.264 + AAC), `-ac3.mp4` and `generated/-eac3.mp4` (unsupported-codec path), `.3gp` and `.amr` (AMR-NB 8 kHz; ffmpeg built these without trouble). The sample rates are not all 16 kHz in the manifest (Opus 48 kHz, AC-3 32 kHz, AMR 8 kHz) because those codecs have fixed rate sets.

Behaviour: `generated/silence-30s.wav` (digital zero), `generated/noise-pink-30s.wav`, `generated/music-like-30s.wav` (4 synthesised triads), `speech-silence-speech.wav` (passage-c 0-6.958 s, silence 6.958-26.958 s, passage-b 26.958-49.699 s), `generated/speech-over-noise.wav` (measured SNR 9.8 dB), `generated/quiet-speech.wav` (peak -35.0 dBFS), `noaudio.mp4` (10 s, video only), `corrupt.mp4` (first 40 % of passage-b-video.mp4, moov atom missing), `empty.wav` (0 bytes), `tone-1k.mp3` (3 s).

ffmpeg behaviour on the deliberately broken ones: `corrupt.mp4` fails with "moov atom not found / Invalid data found when processing input"; `empty.wav` fails with "Invalid data found when processing input"; `noaudio.mp4` opens fine but has no audio stream (the app must detect that itself).

## Tools

* `tools/make-fixtures.ps1 [-Ffmpeg path]` recreates everything from `texts/` (needs the two SAPI voices and an ffmpeg with libx264, libopus, libvorbis, libmp3lame, aac, ac3, eac3, libopencore_amrnb) and then runs `make-manifest.mjs`. It deletes and rewrites `audio/` and `generated/`. SAPI rate is 0 (default).
* `tools/make-manifest.mjs <ffmpeg>` re-probes, hashes and rewrites `manifest.json`.
* `tools/make-long.mjs <minutes> <outDir> [ffmpeg]` loops passage-a into `long-<N>min.wav` (16 kHz mono), `.m4a` (AAC 48k), `-video.mp4` (1 fps video + AAC). Not committed. Example: `node tools/make-long.mjs 60 <dir>` (60 min: 115 MB wav, 22 MB m4a, 22 MB mp4, about 90 s).

If you edit a passage text, also rewrite its `.normalized.txt` by hand (there is no tool for it) before running make-fixtures.ps1.
