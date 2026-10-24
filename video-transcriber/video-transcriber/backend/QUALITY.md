# Recognition, Hinglish, and cancellation

The API runs transcription in one reusable spawned worker process. Native decoder
work and ffmpeg extraction are stopped by terminating that worker tree on cancel.
Completed jobs reuse its model; the next job after a cancellation loads a fresh
worker. Partial segments stay in the visitor's session. A final cancellation check
prevents a cancelled request from being counted as a completed transcription.
The API no longer loads a second default model for warm-up.

## Engines

Whisper remains the default. Qwen is selectable under **More options > Recognition
engine** once its optional package is installed. Both use the same phase, segment,
and result contract in `app/backends.py`.

```powershell
cd backend
.venv/Scripts/python.exe -m pip install -r requirements-qwen.txt
```

Qwen models: `qwen3-asr-0.6b` and `qwen3-asr-1.7b`. Their weights download on first
use. Qwen is an experimental transcription adapter, not an English translation
engine. It uses speech detection with 300 ms pauses and 100 ms padding to choose
natural chunk boundaries, at most 25 seconds apart. Silence gaps of two seconds or
longer are skipped without changing original sample offsets. Silent audio returns
no segments without loading the recognition model. Disabling VAD keeps all audio.
Only cuts inside continuous speech use up to two seconds of preceding audio.
Exact suffix/prefix matches of at least three words are removed (ignoring case and
punctuation). If no reliable match exists, the non-overlapping audio is recognized
once more instead of deleting fuzzy matches or appending ambiguous overlap text.
These retries add processing time on continuous speech. Short or uncertain
repetitions inside the recognized passage are retained. Raw per-chunk output is stored as
`recognition_text`; `original_text` keeps the Hindi text after overlap removal so
restyling does not reintroduce duplicates. Retried overlap text is preserved in
`overlap_recognition_text`; `boundary_resolution` records the processing decision.
`review_reasons` flags boundary retries and long repeated phrases for listening,
without inventing confidence scores or automatically rewriting the speaker.
This is language-independent processing, not a claim of universal accuracy.
Hindi word alignment
is not supported by Qwen's released forced aligner, so this adapter intentionally
returns approximate chunk timing, `words: null`, and `confidence: null`.
It does not fabricate word timestamps or confidence scores.

CLI example:

```powershell
.venv/Scripts/python.exe cli.py talk.mp4 --engine qwen --lang hi --format json -o talk.json
```

## Trained Roman Hindi conversion

The default `romanizer=auto` uses prepared IndicXlit weights, with common Hindi and
English-loanword spelling normalization. Existing Latin text is left intact.
Unfamiliar words use the trained model rather than character-by-character rules.
The Basic option remains an explicit fallback; a visible warning accompanies its
Hindi output. Recognition mistakes are not corrected by script conversion.

Preparation on Windows (no Fairseq build required):

```powershell
.venv/Scripts/python.exe -m pip install -r requirements-indicxlit.txt
.venv/Scripts/python.exe -m tools.prepare_indicxlit
```

Preparation downloads the official AI4Bharat IndicXlit v1 Indic-to-Roman archive,
checks its checkpoint hash, maps the original tensors using CTranslate2's Fairseq
conversion helpers, validates vocabulary dimensions, and checks known words before
publishing the converted folder. Torch and OmegaConf are only needed during this
conversion. The website's converter runs on CTranslate2. Provenance and the MIT
license reference are recorded in `data/models/indicxlit-ct2/provenance.json`.
Language token order comes from the official `ai4bharat-transliteration==1.1.3`
package. No visitor words are cached across sessions; only model weights are kept.

Every new segment preserves original recognition text. JSON includes
`original_text` and, when needed, `original_word`. **More > Re-transcribe > Apply
style only** changes script/converter using this saved recognition, without
processing the audio again. Edited lines are retained. A failed conversion or
concurrent edit leaves the current transcript unchanged.

## Reproducible real-audio comparison

```powershell
.venv/Scripts/python.exe -m tools.compare_engines talk.mp4 --start 4 --seconds 60 --timeout 300 --download
```

This creates the same clip for both engines, records options, runtime, raw text,
segments, and timeouts, and kills a worker that exceeds its runtime budget.
It defaults to original script and unfiltered audio to isolate recognition.
Run again with `--enhance-audio` to compare filtering separately. Model downloads
and first loading count against the budget; use cached weights for timing tests.

For an accuracy regression, independently verify a reference transcript for the
same audio window, then pass `--reference reference.txt --reference-verified`.
The tool reports WER only with an explicitly verified reference. Unit tests,
confidence values, and readable output do not establish an accuracy percentage.

Local trial on the user's Self Discipline video (start 4 s, length 12 s, CPU):
Whisper small completed in 16.83 s, Qwen 0.6B in 69.62 s. Qwen recovered several
words more readably, but still misrecognized an English phrase. This sample has
not been independently audio-verified, so no WER or general accuracy claim is
made. The initial 60-second trials reached their 300-second limits. Reports are
under `output/review/engine-comparison*` at the project root.

References: [Qwen3-ASR](https://github.com/QwenLM/Qwen3-ASR),
[IndicXlit](https://github.com/AI4Bharat/IndicXlit),
[CTranslate2](https://github.com/OpenNMT/CTranslate2).
