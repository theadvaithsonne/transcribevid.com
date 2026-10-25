# Spike: test fixtures

Full documentation: `frontend/fixtures/README.md`; machine-readable inventory: `frontend/fixtures/manifest.json`.

* Voices: Windows SAPI Microsoft David Desktop (passage-a 73.1 s, passage-c 7.0 s) and Microsoft Zira Desktop (passage-b 22.7 s). No Hindi voice exists, so Hinglish is not covered by these fixtures.
* Committed: `frontend/fixtures/audio/` = 4.93 MB on disk (budget 5 MB), 20 files. Git-ignored but regenerable in about 10 s with `frontend/fixtures/tools/make-fixtures.ps1`: `frontend/fixtures/generated/` (9 larger fixture files plus intermediates). Rebuild is bit-identical (all sha256 unchanged on a second run).
* All 29 manifest files decode with ffmpeg except the two deliberately broken ones (`corrupt.mp4`: "moov atom not found"; `empty.wav`: "Invalid data found when processing input"). `noaudio.mp4` decodes but has no audio stream.
* Measured: speech-over-noise SNR 9.82 dB; quiet-speech peak -35.0 dBFS; silence-30s and the 20 s gap in speech-silence-speech contain exactly zero non-zero samples.
* Long files (not committed), 60 min of passage-a looped, each verified to decode to 01:00:00.00:
  * C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/long/long-60min.wav (115.2 MB)
  * C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/long/long-60min.m4a (22.0 MB)
  * C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/long/long-60min-video.mp4 (22.1 MB)
* Deviations from the brief: (1) the 44.1 kHz stereo WAV is the first 5 s of passage-c, not 20 s (20 s = 3.5 MB would break the 5 MB cap); (2) passage-a compressed variants (mp3, m4a), the E-AC-3 mp4 and the large behaviour WAVs live in the git-ignored tier for the same reason; (3) passage-b is 22.7 s and passage-c 7.0 s (SAPI default speed), slightly off the 20 s / 8 s targets.
* Not made: nothing failed. Not verified: whether Chrome/Edge can decode AC-3, E-AC-3 and AMR in the browser (the files exist so the decode path can be tested; expectedBehaviour allows either a transcription or a clear error).
