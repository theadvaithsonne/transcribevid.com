# engine/export: transcript exporters

Pure TypeScript ports of `backend/app/formats.py` (no Angular, no I/O). For the same job data the output is
byte-identical to the server's export (same string, UTF-8 without BOM). Spec: `export.spec.ts`, against golden output of
the production Python code (`export-goldens.ts`, generated).

| File | Function / constant | Python source |
|---|---|---|
| `timestamps.ts` | `fmtTs(sec, 'short' \| 'srt' \| 'vtt')` (ms rounded half to even, negatives -> 0) | `formats.fmt_ts` (formats.py:26-36) |
| `cues.ts` | `SENTENCE_END`, `CLAUSE_END` (Python `$` also matches before a final newline) | formats.py:12-13 |
| | `tokens` (word timing, or even spread by characters for edited lines) | `formats._tokens` (formats.py:41-57) |
| | `wrap` (at most 2 balanced lines) | `formats._wrap` (formats.py:60-74) |
| | `buildCues(segments, {maxChars = 42, maxLines = 2, maxDur = 6, minDur = 0.8})` | `formats.build_cues` (formats.py:77-115) |
| `formats.ts` | `toSrt`, `toVtt` | formats.py:118-128 |
| | `toTxt(segments, timestamps = true)` | formats.py:133-135 |
| | `paragraphs` (pause 1.6 s, 600 characters), `toPlain` | formats.py:138-156 |
| | `toMarkdown` | formats.py:159-167 |
| | `toJson` (Python float printing via `post/py.ts pyJsonDumps`; key order title, filename, language, language_probability, duration, options, stats, segments; `original_text`, `original_word`, `romanizer`, Qwen fields pass through) | formats.py:184-188 |
| | `render(job, format, cueOptions)`, `EXPORT_FORMATS` (MIME, extension; unknown format -> txt) | formats.py:15-23, 170-192 |
| | `exportFilename(title, format)` = `${title}.${ext}`, `pyQuote` (the `filename*=UTF-8''` form) | main.py:599-614 |

The UI's line length setting maps to `maxChars` (20..80, default 42); `maxLines` (1..3) is in the API only. Both apply
to SRT / VTT only, as on the server.

## PDF

There is no PDF generator here. `render(job, 'pdf')` throws `PDF_EXPORT_NOTE`. The browser edition prints a
print-styled transcript page (`window.print()`, the visitor picks "Save as PDF"). The `@page` rules were checked in
Chrome 155: running title from page 2, "Page X of Y" footer, A4 margins (parity/engine.md EN-089, section 2.5). The
page uses `paragraphs()` from here, so it groups text the way the Python PDF does. Firefox / Safari margin boxes and
Devanagari copy and paste still need a check in a real viewer (EN-089). The self-hosted server keeps the fpdf2 PDF.

## Regenerating the goldens

```
cd backend
.venv/Scripts/python.exe -I -X utf8 tools/dump_engine_goldens.py
```

The script writes 111 export cases: 69 `fmt_ts`, 14 `_wrap`, 18 `build_cues`, and 10 jobs. Each job is rendered in
every format, with SRT 20x1 and 80x3, VTT 30x2, TXT without timestamps, the paragraph grouping and the file names. The
jobs are: Appendix B3, a Hindi to Hinglish pipeline job with `original_text` / `original_word`, edited lines, a long
transcript, edge cases (overlaps, an empty line, a very long word, Arabic, CJK, emoji, an hour offset, control and
U+2028 characters), Qwen chunks, an empty transcript, and three Markdown option cases.

## Known differences

None in the output. The JSON export prints a number as a float (`2.0`) when its key is one of `post/py.ts FLOAT_KEYS`
(`start`, `end`, `probability`, `confidence`, `no_speech_prob`, `duration`, `language_probability`, `speech_seconds`,
`avg_confidence`), which are floats in every job the pipeline produces. It prints other integers as integers. A
hand-made job that keeps integer times under those keys would print `0` in Python and `0.0` here. Parsed JSON is
identical either way.
