# engine/post: transcript post-processing

Pure TypeScript ports of the server's segment post-processing (no Angular, no I/O). Every function keeps the Python
name's meaning; the constants carry their Python source line in a comment. Spec: `post.spec.ts`, against golden
cases produced by the production Python code (`post-goldens.ts`, generated).

| File | Function / constant | Python source |
|---|---|---|
| `py.ts` | `pyRound` (round-half-even on the exact binary value; `pyRound(x)` = `round(x)` int, `pyRound(x, n)` = `round(x, n)`), `pyFloatRepr`, `pyStr`, `pyLen`, `pySlice`, `pyStrip`, `PY_SPACE`, `pyJsonDumps` / `pyJsonString` / `FLOAT_KEYS` | builtins, `json.dumps(ensure_ascii=False, indent=2)` |
| `text.ts` | `norm` | `engine._norm` (engine.py:367) |
| | `fixNumberText` | `engine.fix_number_text` (engine.py:371-379) |
| | `mergeNumberPieces` | `engine.merge_number_pieces` (engine.py:382-398) |
| `segment.ts` | `segmentDict` (confidence = mean word probability, else `exp(clamp(avg_logprob, -10, 0))`) | `engine._segment_dict` (engine.py:401-413) |
| | `SegmentFilter` (empty, no-speech `> 0.6 and < -1.0`, repetition loop: 4th identical line dropped), `postprocessSegments`, `shouldRomanize`, `withOriginalText`, `segmentProgress`, `recognitionResult` | `engine._recognise` (engine.py:490-525) |
| `guards.ts` | `TEMPERATURES`, `BEST_OF`, `COMPRESSION_RATIO_THRESHOLD`, `LOG_PROB_THRESHOLD`, `NO_SPEECH_THRESHOLD`, `HALLUCINATION_SILENCE_THRESHOLD` | engine.py:472-480 |
| | `generateWithFallback` / `generateWithFallbackAsync`, `needsFallback`, `avgLogprobFromScore` | faster-whisper `generate_with_fallback` (transcribe.py:1402-1530) |
| | `compressionRatio`, `deflatedSize`, `compressionRatioFromSizes` | `get_compression_ratio` (transcribe.py:1879) |
| | `shouldSkipWindow` | no-speech window skip (transcribe.py:1215-1235) |
| | `wordAnomalyScore`, `isSegmentAnomaly`, `nextWordsSegment`, `hallucinationGuard`, `getEnd` | transcribe.py:1242-1263, 1293-1343; utils.py:148 |
| `words.ts` | `mergePunctuations` | `merge_punctuations` (transcribe.py:1910-1941) |
| | `addWordTimestamps` (word clean-up after the DTW alignment) | `add_word_timestamps` (transcribe.py:1567-1696) |
| | `SpeechTimestampsMap`, `restoreSpeechTimestamps` | vad.py:246-285, transcribe.py:1844-1870 |
| `stats.ts` | `computeStats`, `STOP_WORDS`, `LOW_CONFIDENCE` | `formats.compute_stats`, `_STOP` (formats.py:197-223) |
| `job-rules.ts` | `applyEdits` | `JobStore.update_segments` (jobs.py:415-445) |
| | `cleanTitle` | `JobStore.update_title` (jobs.py:405-413) |
| | `etaSeconds`, `storedProgress` | `_run.on_segment` (jobs.py:534-536) |
| `review.ts` | `wordLevel` (< 0.5 low, < 0.75 mid), `isLowConfidence`, `segmentFlag`, `qualityConcern`, `REVIEW_MESSAGES` | frontend `transcript.ts:46-47, 152, 310`, `job.ts:195-209` (parity EN-077) |

Shapes are the UI's (`core/models.ts`: `Segment`, `Word`, `Stats`, `Keyword`, `SegmentEdit`), so the transcript page and
the exports need no change.

## Regenerating the goldens

```
cd backend
.venv/Scripts/python.exe -I -X utf8 tools/dump_engine_goldens.py
```

`backend/tools/dump_engine_goldens.py` runs the real functions: `engine.transcribe` with a stand-in recogniser (as in
`tests/test_engine.py`), `formats.compute_stats`, `JobStore.update_segments` / `update_title`, faster-whisper's
`generate_with_fallback` and `add_word_timestamps` with a stand-in model / alignment, `merge_punctuations`,
`restore_speech_timestamps`. The no-speech skip, the anomaly scores and the hallucination guard are inline code of
`generate_segments`; the script cuts those blocks out of the installed library source by their first and last lines and
executes them unchanged. It writes 214 post cases (and 111 export cases, see `../export`).

## Known differences

* `deflatedSize` / `compressionRatio` use the browser's `CompressionStream('deflate')`. Its zlib build can choose
  different matches than Python's zlib, so the compressed size can differ by a few bytes (the spec allows 3). That only
  matters for texts within about 1 % of the 2.4 limit (parity/engine.md EN-035 note 3). The gate logic itself is tested
  with the Python ratios and is exact.
* Hinglish conversion is asynchronous in the browser (IndicXlit runs in a worker). `postprocessSegments` accepts a
  synchronous converter (the spec uses `convertSegmentBasic`); the worker should run `SegmentFilter.accept`, then its
  async `convertSegment`, then `withOriginalText`, which is the same order as engine.py:512-515.
* `Math.exp` (in `segmentDict`) may differ from C's `exp` in the last bit. After rounding to 3 decimals this can only
  matter on an exact rounding boundary. None of the goldens hit one.
* `applyEdits` treats a `null` start / end like a missing one (the API drops nulls with `exclude_none`). It returns
  copies; the Python mutates the stored dicts.
