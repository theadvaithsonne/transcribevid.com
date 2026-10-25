# IndicXlit browser port - independent verification (track indicxlit-verify)

Date: 2026-10-25, 22:35-23:05. Machine: Ryzen 7 7730U, 15 GB RAM, Windows 11, Node 24.12, Chrome 155.0.8059.86.
Scratch: `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/indicxlit-verify/`
(scripts, `out/*.json`, `logs/*.log`). Everything below was measured; nothing is taken from the builder's report.
No earlier verifier output existed on disk (the scratch dir did not exist), so this round did the work itself in
about 35 minutes of wall-clock; the two items it did not reach are listed in section 7.

## Verdict: go-with-changes

The port reproduces the server for every realistic input: **3,332 / 3,332 words of up to 256 symbols identical at
beam 4 and 3,338 / 3,338 at beam 1** on a fresh list the builder never saw, plus 6,400 random texts through the rule
layer with 0 differences. It is **not** bit-exact for Devanagari runs longer than 256 symbols (6 / 6 such inputs
differ at beam 4), because the shipped position table was cut to 256 rows and the rows beyond are recomputed with
double-precision math that does not match the fairseq float32 table CT2 uses. One memory-corruption bug exists for
beam sizes above 4 (not reachable from the app). Both have small, well-defined fixes (section 5).

## 1. Fresh evaluation list (`words.json`, 3,338 strings; 3,193 not in the builder's 24,959-word reference)

| Category | n | Source |
| --- | ---: | --- |
| subs | 900 | OpenSubtitles frequency words the builder did not use (9,253 unused; seed 7_2026_10_25) |
| wiki | 800 | Hindi Wikipedia titles not in the reference (126,362 candidates) |
| aksh | 798 | Aksharantar words not in the reference (300,352 candidates) |
| morph | 602 | stem + suffix (+ suffix) combinations of 100 common stems and 46 suffixes |
| tricky | 238 | hand-made: conjuncts, nukta (precomposed / decomposed / doubled), chandrabindu, anusvara, visarga, avagraha, numerals, English loanwords, ZWJ / ZWNJ, single letters and bare signs, the empty string, whitespace, Latin / emoji / mixed tokens, punctuation attached, NFD input, words of 96-2,000 symbols |

`backend/tests/golden/*.json` contain no Devanagari (checked: 0 code points), so they could not supply words.
The 145 overlaps with the reference are common words that the tricky / morph lists produce by construction.

Reference: `make_reference.py` run with the builder's venv (CTranslate2 4.8.3, read-only) and
`PYTHONPATH=backend`, through the production classes `app.indicxlit.IndicXlit` (beam 4) and `app.hinglish`
(`romanize(w, 'indicxlit')`, `romanize(w, 'basic')`, `convert_segment` on a two-word segment), plus a direct
greedy decode with the same settings. 0 Python-side errors (the server converts even a 2,000-symbol run).

## 2. Results, TypeScript runtime under Node 24 (kernel `wasm-simd`, word cache OFF) - `parity-summary.json`

| Check (3,338 strings) | Identical | Notes |
| --- | ---: | --- |
| `transliterate` beam 4 vs server `translit_word` | **3,332 / 3,338 (99.82 %)** | the 6 misses are the 6 inputs longer than 256 symbols |
| same, inputs of at most 256 symbols | **3,332 / 3,332 (100 %)** | |
| `transliterate` beam 1 vs CT2 greedy | **3,338 / 3,338** | |
| `romanize(w, 'indicxlit')` vs Python (text + error class) | 3,332 / 3,338 | same 6 |
| `convertSegment(seg, 'indicxlit')` vs Python `convert_segment` (whole dict) | 3,332 / 3,338 | same 6 |
| `romanizeBasic` and `convertSegment(..., 'basic')` vs Python | 3,338 / 3,338 | |
| Determinism (beam 4 run twice) | 3,338 / 3,338 | |
| per category subs / wiki / aksh / morph | 900 / 800 / 798 / 602, all 100 % | |
| tricky | 232 / 238 beam 4, 238 / 238 beam 1 | |

Mismatches (all `tricky`): `अ` x 257 -> browser `aaaaaaaaaaaaaaa` (15) vs server 16 a's; `अ` x 1022 / 1023 / 1024 /
1100 -> 12 vs 13 a's; `क` x 2000 -> different 96-symbol strings. Greedy agrees on all six, so the error is a
near-tie flip, not garbage.

Differential test of `hinglish.ts` against `hinglish.py` (`diff_basic.py` / `diff_basic.mjs`): the five tables
(SPELLINGS 196, VOWELS 18, MARKS 17, CONSONANTS 34, NUKTA 8) are identical entry for entry and in order;
6,000 random texts (Devanagari block incl. unassigned code points, Latin, digits, punctuation, ZWJ / ZWNJ, emoji,
NFC / NFD mixes): `romanize('basic')` 6,000 / 6,000, `convert_segment('basic')` 6,000 / 6,000,
`restyle_segment` to hinglish and to devanagari 6,000 / 6,000 each; 400 random mixed texts through the model:
`romanize('indicxlit')`, `convert_segment('indicxlit')` and `'auto'` 400 / 400 each. `'auto'` without a model falls
back to `basic` with the server's warning text; `'indicxlit'` without a model throws `RomanizerUnavailable`.

Speed under Node (4 shards + the ng test + Chrome shared the CPU, so these are upper bounds, not a benchmark):
77.7 ms/word beam 4, 51.1 ms/word beam 1 over the whole list; slowest string (`क` x 2000) 57.7 s in a contended
shard, 22.2 s alone (`probes.json`); `अ` x 1100 9.0 s alone.

Unit tests: `npx ng test --watch=false --include "**/engine/hinglish/*.spec.ts"` -> 2 files, **94 passed**, 24.5 s
(`logs/ngtest.log`, run concurrently with the shards).

## 3. Real browser - headless Chrome 155, Web Worker, 1 worker (`logs/browser-chrome-w1.log`)

Vite dev server on :5198 serving the repo's `public/models/indicxlit` **without COOP / COEP** (`crossOriginIsolated:
false`, the production situation with ads). The four Node shards were still running during this pass, so the
timings are inflated; the exactness numbers are not affected.

| Measurement | Value |
| --- | --- |
| 853-string subset (all 238 tricky + every 5th other, strings up to 600 symbols), beam 4, word cache ON | **852 / 853 identical** (the miss is `अ` x 257) |
| same, beam 1 | **853 / 853** |
| same batch twice | 853 / 853 identical (deterministic) |
| 15-word mixed segment through `convertSegment(..., 'auto', { neural: client })` | 143 ms, text and words as expected, romanizer `indicxlit` |
| cold load (fetch 11.8 MB + SHA-256), first visit | 684 ms (602 ms inside the worker); progress callback fired 159 times |
| 5 x `new IndicXlitClient().load()` / convert / `dispose()` | 364, 285, 288, 256, 255 ms; after `dispose()` every call rejects with `Call load() before transliterate().`; JS heap 2.26 MB after the cycles vs 1.78 MB baseline (`performance.memory`, worker memory not included because the page is not isolated) |
| `load('/models/does-not-exist/')` | rejects after 290 ms, no hang, but the message is `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON` (defect 5); the client then answers `Call load() before transliterate().` |
| abort of a 853-word batch (first word in flight was long, words run longest-first) | `AbortError` 1,457 ms after `abort()`; client usable afterwards |
| abort of a batch whose first run is 1,500 symbols | `AbortError` only after **28.7 s** (defect 3) |

Not run (time-box): the 4-worker pool and Edge 156 in this harness. The builder's harness for those exists at
`scratchpad/indicxlit/page` and was not re-executed.

Asset-fetch failure matrix in Node with an injected `fetch` (`probes.json`, P7) - every case rejects at once with a
clear `indicxlit: ...` message: header 404 (55 ms), network error (0 ms), `.bin` 404 (3 ms), truncated body
(`download is incomplete`), one flipped byte (`failed its SHA-256 check`, after one `cache: 'reload'` retry), body
longer than the header says, wrong `format`. Only an HTML body for `indicxlit.json` produces a raw `SyntaxError`.

## 4. Code review findings (`probes.mjs`, `probe_layout.mjs`, `check_positions.mjs`)

* **Positions.** `model.bin` holds `decoder/position_encodings/encodings` of shape (1024, 256) (fairseq's float32
  sinusoidal table, shared by the encoder). `export_indicxlit_browser.py` ships only `POSITION_ROWS = 256`; for
  positions 256..1023 `IndicXlitModel.position()` recomputes `fround(sin/cos((pos + 2) * exp(-(ln 10000 / 127) * (d % 128))))`
  in double precision. Compared with the real table, **all 1,024 rows differ in 204,981 of 262,144 cells, max
  |diff| 5.8e-5** (the first 256 rows are taken from the file, so only rows 256+ matter at run time). That is the
  cause of the six mismatches; the builder's long inputs (`त्र` x 150, `है` x 100, `अ` x 150) happened not to flip.
  Input truncation also differs: CT2 cuts the token list to `max_input_length` = 1024 and then appends `</s>`
  (T = 1025) whereas `translateWord` cuts to 1024 including `</s>`; it cannot be separated from the position error
  until that is fixed.
* **Scratch layout (`layout()`).** `rows` is computed before the previous layout's `beam` is folded in. Sequence
  `transliterate(['क'], {beamSize: 16})`, `transliterate(['विश्वविद्यालय'], {beamSize: 2})`,
  `transliterate(['नमस्ते'], {beamSize: 16})` returns **`nae`** (fresh model: `namaste`); with beam 27 / 4 / 27 and a
  20-symbol middle word: `nae`, `zindgi`, `ceeeee`, `rashtrea`, `cmputer`, `antarrasea`. The decoder writes `R = beam`
  rows into buffers sized for `rows < beam` and overruns into the next buffers. With beam <= 4, `rows >= 4 >= beam`
  always, so the app path (hinglish.ts hard-codes `SERVER_BEAM = 4`) is safe; the public API is not.
* **Huge inputs.** One Devanagari run is one uninterruptible unit of work: 1,100 symbols 9.0 s, 2,000 symbols
  22.2 s (Node, alone). The worker checks `cancel` only between words, so a batch containing such a run cannot be
  aborted for that long (28.7 s observed in Chrome). The server accepts the same inputs (CT2 has no cap below 1,024
  tokens), so output parity is not the issue; responsiveness is.
* **Memory growth.** Wasm memory per model: 13,041,664 B after load, 16.8 MB after 400 ordinary words (one growth
  step), **45.6 MB after one 1,100-symbol word and 51.9 MB after a 2,000-symbol one, never released** (the scratch
  layout only grows; `maxLen` caches are laid out for the largest T seen). Beam 27 with a 300-symbol word: 43.0 MB.
  With `recommendedWorkers()` = 4 that is up to 200 MB kept until `dispose()`. No leak across calls otherwise: 12
  load / dispose cycles in Node end at 7 MB JS heap; 5 cycles in Chrome end 0.5 MB above baseline.
* **Unicode.** NFC is applied in `Runtime.transliterate` and in both `hinglish.ts` paths exactly where Python does it;
  NFD inputs give the same result as NFC (5 / 5 nukta words, and all `tricky` NFD rows). Lone surrogates, emoji,
  BOM, NUL and control characters are mapped to `<unk>` by both sides (the pipeline never lets them reach the model
  because `_WORDS` only matches the Devanagari block). Empty string -> `haa` on both sides. Order and duplicates are
  preserved.
* **Options.** beam 0 / 28 / 1.5 / NaN -> `RangeError`; beams 2, 3, 5, 27 run; `maxDecodingLength` 0 -> `RangeError`,
  1 / 2 / 5 truncate as expected. Beams other than 1 and 4 were not compared with CT2 (no reference computed).
* **Word cache.** 10,000 entries; 271 sampled entries equal the network's own output 271 / 271; beam 1 bypasses the
  cache (60 / 60 equal the network); a table with another SHA-256, a truncated table and an empty text are rejected
  (`null`).
* **Worker protocol / client.** `cancel` for an id that already finished leaves a stale entry in the worker's
  `cancelled` set (never cleared; one number per late cancel - harmless but unbounded in theory). `load()` on a
  bad base URL leaves the worker alive and the client unusable with a clear message. Errors in one slot cancel the
  others. `transliterate` before `load` and after `dispose` both throw clear errors.
* **hinglish.ts vs hinglish.py, line by line:** identical semantics including `_SPELLINGS.get(NFC) or neural`,
  the per-call cache keyed on the raw run, digit translation after substitution, the `romanizer` /
  `conversion_warning` / `original_text` / `original_word` rules, `edited` short-circuit in restyle, and the
  `[A-Za-z'-]+` output validation (both throw `RomanizerUnavailable`). The only divergence found by reading
  (`segment.get("original_text", text)` returns `None` when the key exists with value `None`; TS `??` falls back
  to `text`) is unreachable for data the app produces.

## 5. Defects, reproductions and proposed fixes

1. **Not bit-exact beyond 256 symbols** (positions). Repro: `transliterate(['अ'.repeat(257)])` -> 15 a's, server 16.
   Fix: set `POSITION_ROWS = 1024` in `backend/tools/export_indicxlit_browser.py` and re-export (+786,432 B raw in
   `indicxlit.bin`, sinusoids compress well), update `position_rows` / SHA-256 / `provenance.json` / `wordcache.tsv`
   pin, and make `position()` throw instead of extrapolating; then align truncation with CT2 (keep 1,023 symbols +
   language token, append `</s>`, T = 1025) and re-run `अ` x 1022..1100 and `क` x 2000 against the reference.
   Alternative without a re-export: replicate fairseq's float32 arithmetic (float32 `exp`, float32 product, float32
   `sin` / `cos` as torch computes them) - harder to prove.
2. **Memory corruption for `beamSize` > 4.** Repro in 4 above (`probe_layout.mjs`). Fix in `layout()`: fold first,
   then size: `beam = Math.max(beam, s?.beam ?? 0); const rows = Math.max(T, beam, s?.rows ?? 0, 4);` and add a
   spec that runs beam 16 / 2 / 16 with a 13-symbol middle word against a fresh model.
3. **Uncancellable long runs.** Fix: in `createWorkerHandler.convert` (or `IndicXlitClient`) cap a single run (for
   example 256 symbols, which also bounds defect 4) and return the rule-based `basic` spelling or the input unchanged
   for longer runs with a `conversion_warning`; or poll a cancellation flag inside the decode loop.
4. **Scratch memory never shrinks.** Fix: after a word that needed `cap = maxLen` or `T > 64`, reset
   `this.scratch = null` (next word re-lays out at the default size), or cap input length as in 3.
5. **Unclear error for a wrong asset URL.** Fix: in `load()`, check `headRes.headers.get('content-type')` includes
   `json` (or wrap `.json()` in try / catch) and throw `indicxlit: ${url} is not the model header`.
6. Stale ids in the worker's `cancelled` set after late cancels. Fix: `cancelled.delete(target)` when the target is
   not the request in flight, or clear the set when `convert` returns.
7. Report accuracy: `docs/in-browser/spike/indicxlit.md` says the port returns "exactly what the server returns";
   that should read "for runs of at most 256 symbols" until defect 1 is fixed, and the 22 ms abort latency should be
   qualified (it is the time to the end of the word in flight).

## 6. Builder claims checked

| Claim | Verified? |
| --- | --- |
| 24,959 / 24,959 at beam 4 and 1 | not re-run; independently consistent: 3,332 / 3,332 fresh words <= 256 symbols |
| 94 / 94 specs pass with `ng test` | yes (24.5 s under load) |
| no new runtime dependency | yes (`entry.ts` bundles from the engine folder only; `package.json` untouched) |
| assets fetched only by `load()` | yes (first `/models/` request is from the worker's load) |
| cold load 160 ms / warm 100 ms | 684 ms cold and 255-364 ms warm here, measured during heavy CPU contention; not contradicted, not confirmed |
| 28.2 ms/word beam 4 in Chrome | not reproducible in this run (170 ms/word under contention); not contradicted |
| abort after 22 ms | scenario-dependent: 1,457 ms and 28,679 ms observed (see defect 3) |
| memory ~19 MB per worker | 13-17 MB for ordinary words, up to 52 MB after one huge word (defect 4) |

## 7. Not done

* 4-worker pool and Edge 156 under this harness; beams 2, 3, 5-27 against CT2; the builder's 24,959-word run.
* Timings were measured while four Node shards shared the CPU; a quiet re-run is needed before quoting speed.
