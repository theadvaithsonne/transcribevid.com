# IndicXlit in the browser - spike report (track indicxlit-finish)

Date: 2026-10-25. Machine: Ryzen 7 7730U (8C/16T), 15 GB RAM, Windows 11, Node 24.12, Chrome 155.0.8059.86,
Edge 156.0.4314.42. Everything below was measured on this machine; nothing is estimated.

## Verdict

The trained AI4Bharat IndicXlit v1 (Indic -> Roman) model that the server runs through CTranslate2 now runs in a
Web Worker with **no dependency on any server and no new npm dependency**. On the reference lists it matched the
server word for word: 24,959 / 24,959 words at beam 4 and at beam 1 (longest input 450 symbols), the decoder's
log-probability scores bit-exact on 4,000 words, and on the verifier's fresh list 3,332 / 3,332 words of up to 256
symbols. That is evidence on the tested inputs, not a proof for every input. The first build was **not** exact
for runs longer than 256 symbols, because only 256 position rows were shipped (6 / 6 such inputs differed). The
section "Fixes after verification" covers that and five other defects the independent check
(`indicxlit-verify.md`) found. Those fixes are implemented, but the parity runs and specs that prove them have
**not been re-run yet** (see "To verify"). One deliberate difference remains in the app path: a Devanagari run
longer than 256 symbols gets the rule-based spelling plus a conversion warning, not the model's answer. Such a run
is not a word, and one of them would cost ~10 s and ~40 MB in the browser.

## 1. Design

Files (all new, untracked on `feature/in-browser`):

| Path | Role |
| --- | --- |
| `frontend/src/app/engine/hinglish/indicxlit.ts` | the model: header parsing, arena memory, encoder, decoder, beam search; same ops in the same order as CTranslate2 4.8 int8 |
| `frontend/src/app/engine/hinglish/float32.ts` | float32 primitives that reproduce CT2's AVX2 code paths bit for bit (Cephes `exp`, Abramowitz-Stegun `erf` GELU, 16-accumulator layer norm, 8-lane softmax / log-softmax) |
| `frontend/src/app/engine/hinglish/kernels.ts` | kernel contract; `JsKernels` (portable TypeScript) and `WasmKernels` (the compiled AssemblyScript), interchangeable and bit-identical |
| `frontend/src/app/engine/hinglish/indicxlit-kernels.wasm.ts` | GENERATED: the SIMD (5,221 B) and portable (3,751 B) wasm modules, base64, so no bundler plugin and no extra request |
| `frontend/public/models/indicxlit/kernels/indicxlit-kernels.as.ts` | AssemblyScript source of the kernels (int8 GEMM with oneDNN u8s8s32 pair-saturation semantics, quantisation, GELU epilogue, layer norm, attention) |
| `frontend/src/app/engine/hinglish/wordcache.ts` | parser of the optional exact lookup table `wordcache.tsv` |
| `frontend/src/app/engine/hinglish/indicxlit-worker-core.ts`, `indicxlit.worker.ts` | worker protocol (load / convert / cancel / dispose, 20 ms slices so cancel is prompt) and the `new Worker(new URL(...))` entry |
| `frontend/src/app/engine/hinglish/indicxlit-client.ts` | main-thread `IndicXlitClient` (worker pool 1..4, chunking, AbortSignal, progress); implements `NeuralConverter` |
| `frontend/src/app/engine/hinglish/hinglish.ts`, `hinglish-data.ts` | faithful port of `backend/app/hinglish.py` (rule layer, spelling dictionary, 'basic' / 'indicxlit' / 'auto') |
| `*-fixtures.ts`, `indicxlit.spec.ts`, `hinglish.spec.ts` | server-generated fixtures and unit tests (94 in the first build, 102 after the verification fixes) |

Assets in `frontend/public/models/indicxlit/` (served statically, fetched only when a conversion needs the model):

Sizes after the verification fixes (the first build's numbers are in "Fixes after verification"):

| File | Bytes | gzip -9 | What |
| --- | ---: | ---: | --- |
| `indicxlit.bin` | 12,636,256 | 11,661,366 | 273 tensors, 16-byte aligned: int8 weights with per-row float32 scales, float32 biases, layer norms, all 1,024 rows of the model's sinusoidal position table |
| `indicxlit.json` | 50,961 | 5,915 | header: dims (d_model 256, 4 heads, ffn 1024, 6+6 layers, `position_rows` 1024), specials, both vocabularies (806 source / 54 target symbols), tensor table, decoding defaults, SHA-256 of the .bin |
| `wordcache.tsv` | 246,137 | 90,860 | 10,000 frequent words -> server output (beam 4, max 96), pinned to the .bin SHA-256 |
| `LICENSE`, `provenance.json` | 1,088 / 2,482 | | MIT notice; origin, hashes and rebuild commands |
| `kernels/indicxlit-kernels.as.ts` | 20,803 | | build-time source only (nothing fetches it) |
| **total folder** | **12,957,727** | | |

How a word is converted: tokens `['__hi__', ...NFC(word)]` -> embeddings x 16 + positions -> 6 encoder layers -> beam
search (beam 4, one hypothesis, length penalty 1, at most 96 symbols, `</s>` terminated) over 6 decoder layers with
int8 GEMMs on activations quantised per row to u8 exactly as CT2 does, float32 everywhere else. Inputs are cut to
CT2's `max_input_length` of 1,024 tokens (language token, the first 1,022 symbols, `</s>`), which is exactly the
length of the position table. A position outside the table throws an `indicxlit:` error and is never
recomputed. Memory is one growable `WebAssembly.Memory` holding the weights and all activations (an `Arena`). A
word longer than the 32-symbol soft cap re-lays the scratch area and is decoded again. `Runtime.transliterate`
first looks the NFC word up in the word cache (only when the requested settings are the server's), then in a
per-call memo, and only then runs the network. `Runtime.transliterateAsync` computes the same thing as a sequence
of steps: it yields to the event loop every 20 ms and polls for cancellation before every attention head and FFN
of the encoder and before every decoder step. The worker uses this form.

Why a hand-written runtime instead of ONNX Runtime Web: the goal was *identical* output, not similar. ORT would
re-quantise and re-order float accumulations, which flips near-tie beams (the reference has 2,528 words whose beam-4
and greedy answers differ, so ordering matters). The previous agent's parity rounds show this: the first round
(`exact-*.json`, 4,992 words, before the float paths were made bit-exact) had 217 beam-4 and 186 greedy mismatches;
`par1-*.json` (24,959 words) still had 39 / 40, all near-ties, and they disappeared only when the attention P*V
product was accumulated in CT2's order (`attendHead` "for every accumulation order" test). Only bit-exact float
arithmetic gets to zero.

## 2. How the int8 model was derived

1. `backend/tools/prepare_indicxlit.py` (pre-existing) downloads the official release
   `indicxlit-indic-en-v1.0.zip` (checkpoint SHA-256 `45ffecef...76f28`) and converts it to CTranslate2 int8 with
   CT2's own Fairseq mapping - this is the model the server runs.
2. `backend/tools/export_indicxlit_browser.py` parses that `model.bin` (CT2 binary v6, TransformerSpec rev 7) with
   numpy only and writes `indicxlit.json` + `indicxlit.bin` + `provenance.json` + `LICENSE`. **Nothing is
   re-quantised or re-trained**: the int8 tensors, scales, biases and layer norms are copied byte for byte
   (`provenance.json` records the SHA-256 of each output).
3. `backend/tools/export_indicxlit_wordcache.py` runs the production class `app.indicxlit.IndicXlit` on the 10,000
   most frequent Hindi words of the OpenSubtitles 2018 frequency list (hermitdave/FrequencyWords, CC BY-SA 4.0,
   only the words are used) and writes `wordcache.tsv`. By construction a hit equals the network's answer; the
   spec `the shipped word cache holds exactly what the network computes (sample)` and a full check by the previous
   agent (`js/cache_check.mjs`, 4 shards, logs `cachecheck-*.log`) confirm it.
4. `backend/tools/export_indicxlit_kernels.py` compiles the AssemblyScript kernels twice (SIMD and portable) and
   embeds them in `indicxlit-kernels.wasm.ts`.

## 3. Parity against the server (first build, measured 2026-10-25 22:19-22:25; not yet re-run after the fixes)

Reference: `scratchpad/indicxlit/out/reference.json`, produced by `backend/tools/export_indicxlit_reference.py`
(CTranslate2 4.8.3, int8, beam 4 / greedy, max 96, the production code path). 24,959 distinct words: 9,000 most
frequent subtitle words + 1,500 from the tail, 2,500 Wikipedia titles, 3,771 Aksharantar words, 5,358 orthographic
variants (anusvara / chandrabindu, composed / decomposed nukta, ZWJ / ZWNJ, visarga), 3,143 synthetic stress
inputs (all conjuncts, random strings up to 40 symbols, 150-symbol repeats; longest input 450 symbols), 196
spelling-dictionary keys, 150 number words, 72 words from `backend/tests`.

Commands (the bundle is the repo's current TypeScript, built with esbuild from `scratchpad/indicxlit/page/node_modules`):

```
cd C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/indicxlit/page
./node_modules/.bin/esbuild ../js2/entry.ts --bundle --format=esm --platform=node --target=node22 --outfile=../js2/indicxlit.bundle.mjs
cd ../js2
for i in 0 1 2 3; do node parity.mjs <repo>/frontend/public/models/indicxlit ../out/reference.json ../out/par4-$i.json $i 4 & done; wait
python -X utf8 merge_parity.py ../out/reference.json "../out/par4-*.json" ../out/par4-mismatch.json
node score_cmp.mjs <repo>/frontend/public/models/indicxlit ../out/scores.json
```

Results (`logs/par4-merge.log`, `logs/score_cmp4.log`, `out/par4-mismatch.json`), word cache OFF so every word ran
through the network, kernel `wasm-simd` under Node 24:

| Check | Beam 4 | Beam 1 (greedy) |
| --- | --- | --- |
| Text identical to CT2, all 24,959 words | **24,959 / 24,959 (100.000 %)** | **24,959 / 24,959 (100.000 %)** |
| per category (aksharantar 3,771; numerals 150; spellings 196; subs_tail 1,500; subs_top 9,000; synthetic 3,143; tests 72; variants 5,358; wiki 2,500) | all 100 % | all 100 % |
| Mismatches | none | none |
| Length-normalised score bit-exact (`scores.json`, 4,000 words) | 4,000 / 4,000 | 4,000 / 4,000 |

The same 24,959-word run by the previous agent at 20:43 (`out/par3-*.json`) was also 0 mismatches; the earlier
rounds `exact-*` (217 / 186 mismatches of 4,992) and `par1-*` (39 / 40 of 24,959, see `par1-mismatch.json`) are
from before the float-exactness and P*V accumulation-order fixes and are kept only as history.

Unit tests: `cd frontend && npx ng test --watch=false --include "**/engine/hinglish/*.spec.ts"` -> 2 files,
**94 passed, 0 failed** (11.6 s; log `logs/ngtest3.log`). They cover kernel wasm == TypeScript bit-equality
(including every attention accumulation order), 150 server words at beam 4 and 1, the portable wasm and JS fallbacks,
NFC / order / length guarantees, option validation, SHA-256 re-download on a corrupt cached copy, word-cache format
and model pinning, and the worker protocol (progress, cancel, pool ordering, dispose).

## 4. Real browser (headless Chrome, playwright-core channel `chrome`; first build)

The timings below come from single runs on a developer laptop that was also busy with other work (parity shards,
builds), so they are indications, not a benchmark. The verifier measured the same cold load at 684 ms and beam 4 at
170 ms/word under heavier contention. A quiet, repeated run is needed before any of them is quoted as a speed.

Page: `scratchpad/indicxlit/page` (Vite dev server on :5199 that serves the repo's `public/models/indicxlit`
folder with `Cache-Control: immutable`, COOP/COEP headers set). Commands: `node run.mjs chrome`,
`node bench.mjs chrome 1,4`, `node memory.mjs` (logs `browser-chrome-2.log`, `browser-bench-2.log`,
`browser-memory-2.log`). Chrome 155.0.8059.86, kernel `wasm-simd`, `crossOriginIsolated: true`.

| Measurement | Value |
| --- | --- |
| Cold load in the worker (fetch 11.8 MB from localhost + SHA-256 + arena set-up), first visit | **160 ms** (`loadMs` inside the worker 110 ms) |
| Warm load, same worker, files from HTTP cache | **100 ms**; new page in the same context: 123 ms / 94 ms |
| A Devanagari paragraph (one segment, 70 timed words, Hindi + English loanwords + numbers) through `convertSegment(..., 'auto')` | **80 ms**, text and every per-word `word` / `original_word` identical to the server (`paragraphMatchesServer: true`, romanizer `indicxlit`) |
| 1,200 natural words, beam 4 (word cache on) | 1,200 / 1,200 exact, 14.1 s = 11.8 ms/word |
| 400 words, beam 1 | 400 / 400 exact, 10.4 ms/word |
| **1,000 unique rare words (names, loanwords), beam 4, cache off, 1 worker** | **28.2 s = 28.2 ms/word, 1,000 / 1,000 exact** |
| same with 4 workers | **10.0 s = 10.0 ms/word, 1,000 / 1,000 exact** |
| 2,000-token transcript = 675 distinct model words, 1 worker: cache off / on | 13.3 s / 0.85 s |
| same, 4 workers | 5.2 s / 0.32 s |
| Abort of a running batch of ordinary words | `AbortError` after 22 ms. This is the time to the end of the word in flight, because the first build polled only between words. The verifier saw 1,457 ms (a long word in flight) and 28.7 s (a 1,500-symbol run). Fix 3 below now polls inside the word. |

On the network the cold load is dominated by the 10.9 MB gzip download, which this localhost test does not
exercise; at 10 Mbit/s that is about 9 s, and the client reports progress for it.

Edge 156 (previous agent, 20:14, `browser-edge.log`): same results, 1,200 / 1,200 and 400 / 400 exact, load 251 ms
cold / 127 ms warm. Chrome before the word cache existed: 29.2 ms/word at beam 4 for the 1,200 natural words.

Memory (`performance.measureUserAgentSpecificMemory`, cross-origin isolated page): baseline 1.66 MB; after load
with 1 worker 16.5 MB (wasm memory 13,041,664 B per worker); after converting 300 rare words 20.5 MB (18.8 MB of it
in the worker); after `dispose()` 1.69 MB. With 4 workers: 60.9 MB after load, 76.3 MB after 300 words, 1.69 MB after
dispose. Rule of thumb: ~19 MB per worker while converting ordinary words; `recommendedWorkers()` uses half the
cores, 1..4. The first build grew to 52 MB per worker after a single 2,000-symbol run and never shrank (fix 4).

## 5. Limits, lazy loading, dependencies

- Largest file 12.64 MB (limit 20 MiB = 20,971,520 B); folder total 12.96 MB (limit 40 MB). Both pass.
- Lazy: nothing in `public/models/indicxlit` is referenced by the Angular bundle. `IndicXlitClient.load()` is
  the only thing that fetches it, and the worker is a lazy chunk (`worker-*.js`, 49 kB raw in the test build).
  A visitor who never asks for Hindi output never downloads it. The browser's HTTP cache keeps it between visits
  (static hosts should send a long `Cache-Control`; the SHA-256 check re-fetches with `cache: 'reload'` on a corrupt copy).
- **No new runtime dependency**: the engine imports only its own files (no npm package). `frontend/package.json`
  needs no change; `vitest` (already there, used by `ng test`) runs the specs.
- Build-time tool: AssemblyScript 0.28.2. It is **not** in the repo; `export_indicxlit_kernels.py` fetches it with
  `npx --yes --package=assemblyscript@0.28.2 asc`, or `--asc <path>` uses an installed copy (the one used today is
  `scratchpad/indicxlit/as/node_modules/.bin/asc.cmd`). The embedded module is deterministic and was verified fresh
  today: `cd backend && .venv/Scripts/python.exe -m tools.export_indicxlit_kernels --check --asc <asc>` ->
  "embedded kernels are up to date". The check should run in CI so the wasm cannot drift from its source.
- Browser requirements: WebAssembly (SIMD optional; the portable build and a pure TypeScript path are automatic
  fallbacks and give identical output), Web Workers, `fetch`. No SharedArrayBuffer, no WebGPU, no COOP/COEP needed.

## 6. Regenerating the assets

```
cd backend
.venv/Scripts/python.exe -m pip install -r requirements-indicxlit.txt      # torch, omegaconf, ctranslate2 (prepare only)
.venv/Scripts/python.exe -m tools.prepare_indicxlit                         # official zip -> CTranslate2 int8 (server model)
.venv/Scripts/python.exe -m tools.export_indicxlit_browser                  # model.bin -> frontend/public/models/indicxlit
.venv/Scripts/python.exe -m tools.export_indicxlit_wordcache --words hi_full.txt --limit 10000 --source-note "..."
.venv/Scripts/python.exe -m tools.export_indicxlit_kernels                  # AssemblyScript -> indicxlit-kernels.wasm.ts
.venv/Scripts/python.exe -m tools.export_indicxlit_reference --subtitles hi_full.txt --wiki-titles hiwiki-titles.gz --aksharantar hin.zip --out reference.json
```

`provenance.json` is rewritten by the export tools and lists every hash, so a changed model is detected by the
word cache (ignored if the SHA differs) and by the runtime (format and size checks, SHA-256 of the download).
The tools must be run from `backend/` (`-m tools....`); the `.venv` there already has numpy and ctranslate2.

## 7. Open issues

1. **Not yet wired into the app.** `IndicXlitClient` and `convertSegment` exist and are tested, but
   `features/job/job.ts` still sends `rerunRomanizer` to the server API. The integration (create the client on
   demand, show download progress, pass it as `neural`, fall back to 'basic' with the existing warning when the
   model is unavailable) is the remaining work of milestone M1b/M5.
2. **Speed is CPU-bound and single-threaded per worker**: 28 ms/word for words not in the cache. A 2,000-token
   transcript needs 0.3-0.9 s with the cache and 5-13 s without it (1-4 workers). Acceptable for the use case,
   but a long transcript of rare names will take tens of seconds; progress and cancel are implemented for that.
3. **Download size**: 11.7 MB gzip per device until cached (10.9 MB before the full position table). Brotli would help a little (int8 weights compress
   poorly: gzip only reaches 92 %). The word cache answers most everyday text but still needs the model loaded,
   because a cache without the model could not convert the words it misses.
4. **Reference coverage** is 24,959 words (longest 450 symbols) plus the verifier's 3,338 strings (up to 2,000
   symbols). Beams other than 1 and 4 are untested against CT2; the runtime accepts 2..27.
5. The scratch Vite page used for the browser check lives outside the repo (`scratchpad/indicxlit/page`); if a
   repeatable browser test is wanted it should move under `frontend/` as a Playwright test.
6. `export_indicxlit_reference.py` depends on downloads that are not shipped (subtitle list, Wikipedia titles,
   Aksharantar); the generated `reference.json` (7.3 MB) is kept only in the scratch dir.

## 8. Fixes after verification (2026-10-26)

`indicxlit-verify.md` (section 5) found six defects. All six are fixed in the code and the assets were re-exported.
The test runs that prove the fixes are pending (section 9). The only checks run so far: both TypeScript configs
type-check (`npx tsc --noEmit -p tsconfig.app.json` and `-p tsconfig.spec.json`, exit 0), plus the short Node
measurement quoted under fixes 2 and 4 (`scratchpad/indicxlit-fix/memcheck.mjs`, old bundle + old assets vs new).

| # | Defect | Fix | Where |
| --- | --- | --- | --- |
| 1 | Runs longer than 256 symbols were not bit-exact: rows 256..1023 of the position table were recomputed in double precision and differed from fairseq's float32 table in 204,981 of 262,144 cells | `POSITION_ROWS = 1024`: all rows of `decoder/position_encodings/encodings` are shipped, copied byte for byte (the export's `verify()` re-reads all 273 tensors against `model.bin`). `positionRow()` throws `indicxlit: no position encoding for position N` past the table and computes nothing. Truncation is CT2's `max_input_length` of 1,024 tokens, which is also the table length. The verifier's reference gives the same server answer for 1,022 / 1,023 / 1,024 / 1,100 symbols, which fits this rule (all four reduce to the same 1,024 tokens). | `export_indicxlit_browser.py`, `indicxlit.ts` |
| 2 | Memory corruption for `beamSize` > 4: `layout()` sized the rows before folding in the previous beam | fold first, then `rows = Math.max(T, beam, s?.rows ?? 0, 4)`. The verifier's repro (beam 16 `क`, beam 2 `विश्वविद्यालय`, beam 16 `नमस्ते`) gave `nae` before and gives `namaste` now (Node, memcheck.mjs) | `indicxlit.ts` |
| 3 | One huge run blocked the worker and could not be cancelled (2,000 symbols = 22 s) | (a) The Python code has no length limit of its own (CT2 silently truncates at 1,024 tokens). So `hinglish.ts` caps a run at `MAX_NEURAL_RUN = 256` symbols: longer runs get the rule-based spelling and the segment gets `conversion_warning` = `LONG_RUN_WARNING`. That is the existing warning mechanism, with `romanizer` still `indicxlit`. This is a deliberate difference from the server for such runs. (b) The search is now a generator. `transliterateAsync` polls `isCancelled` before every encoder attention head and FFN and before every decoder step, and yields every 20 ms. The worker converts through it and runs conversions one after another (a paused word owns the scratch memory). | `hinglish.ts`, `indicxlit.ts`, `indicxlit-worker-core.ts` |
| 4 | Scratch memory never shrank after an oversize word (13 MB -> 52 MB per worker) | Relies on the cap from fix 3. A `WebAssembly.Memory` cannot shrink, so resetting the scratch layout would not return any bytes. Node measurement: app path (`convertSegment` with a 2,000-symbol run, after 400 ordinary words) was **51,904,512 B** before and is **17,563,648 B** now (18 ms instead of 20 s). The raw model API (`transliterate(['क' x 2000])` called directly) still grows to 52,690,944 B, as before. Only `hinglish.ts` feeds the model in the app, so the app path is bounded and direct API use is not. | `hinglish.ts` |
| 5 | A wrong asset base URL serving the SPA's HTML with status 200 surfaced as a raw `SyntaxError` | `readHeader()` rejects a `text/html` content type, unparsable JSON and JSON without a `format` string with `indicxlit: <url> is not the model header` | `indicxlit.ts` |
| 6 | Late `cancel` messages left stale ids in the worker's `cancelled` set | the worker tracks the conversions in flight. A cancel whose target is not in flight is dropped on arrival, and both marks are cleared when a conversion ends. `handle.inspect()` exposes the counts for tests | `indicxlit-worker-core.ts` |

Also changed: `export_indicxlit_browser.py` now keeps the `wordcache` / `kernels` sections and the `wordcache.tsv`
entry of `provenance.json` when it rewrites the file, and warns when the word cache is pinned to an older `.bin`.
The word cache was regenerated with the production pipeline (`app.indicxlit.IndicXlit`, CTranslate2 4.8.3). Its
10,000 entries are byte-identical to the previous file; only the model pin in the header line changed.

New specs (8; the suite should now count 102):
`ships the whole position table and matches the server beyond 256 symbols` (`अ` x 257 -> 16 a's, the server's answer),
`refuses to invent a position encoding beyond the shipped table`,
`keeps the scratch rows large enough when a wide beam follows a longer word at a narrow beam` (fix 2, expects `namaste`),
`transliterateAsync gives the same answers and stops inside one long word when cancelled`,
`a worker cancel reaches a single long word mid-decode`,
`says so when the asset URL serves the app page instead of the model header`,
`drops a cancel that arrives after its conversion finished (no stale ids are kept)` (all in `indicxlit.spec.ts`),
`gives runs longer than MAX_NEURAL_RUN the basic spelling and a warning instead of the model` (`hinglish.spec.ts`).

Assets before -> after:

| File | Bytes before | Bytes after | SHA-256 after |
| --- | ---: | ---: | --- |
| `indicxlit.bin` | 11,849,824 (gzip -9 10,946,094) | 12,636,256 (gzip -9 11,661,366) | `c4519ea9bd35a4f8a269a438eabae7c03b95da434d2069b046adfe41712207cb` |
| `indicxlit.json` | 50,942 | 50,961 | `695cce50fc8c7375d4b6d7ed51d0933868c753a2e107bdad8db840a643aa3fb2` |
| `wordcache.tsv` | 246,137 | 246,137 | `703de3663b0763df4e1ba2080f8503a043823f4cf728ba56d6fb9854828df4cc` |
| `LICENSE` | 1,088 | 1,088 | `97ba9030f7ffa04466a790ce2ff774c2f6e8f7455c784221d20a378e33f3687a` (unchanged) |
| `provenance.json` | 2,482 | 2,482 | `171e9b486aefe57c3f592643305c36bbd60d8fa2042106cdce344c679fee021b` |

The position rows add 786,432 B raw but about 715 kB gzip, so they barely compress. The previous `indicxlit.bin`
SHA-256 was `ada70101...33f2a6`. A browser holding the old file in its HTTP cache fails the SHA-256 check and
re-fetches it with `cache: 'reload'`. Every file stays under 20 MiB.

## 9. To verify (not run yet; the owner asked to test everything together at the end)

`S` = `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad`,
`M` = `D:/transcribevid.com/transcribevid.com/video-transcriber/video-transcriber/frontend/public/models/indicxlit`.
The Node bundles in `$S/indicxlit-fix/` (`bundle.mjs`, `indicxlit.bundle.mjs`) were built from the fixed sources.
Rebuild them if the engine changes again:

```
cd $S/indicxlit/page
./node_modules/.bin/esbuild ../../indicxlit-verify/entry.ts --bundle --format=esm --platform=node --target=node22 --outfile=../../indicxlit-fix/bundle.mjs
./node_modules/.bin/esbuild ../js2/entry.ts --bundle --format=esm --platform=node --target=node22 --outfile=../../indicxlit-fix/indicxlit.bundle.mjs
```

(a) Specs, from `frontend/` (expect 2 files, 102 tests):

```
npx ng test --watch=false --include "**/engine/hinglish/*.spec.ts"
```

(b) The verifier's fresh 3,338-string list against its CTranslate2 / Python reference (`$S/indicxlit-verify/out/ref-*.json`):

```
cd $S/indicxlit-fix
for i in 0 1 2 3; do node parity.mjs $M ../indicxlit-verify/out out/par-$i.json simd $i 4 > logs/par-$i.log & done; wait
node merge.mjs      # -> out/parity-summary.json; prints totals per check and the mismatches
```

Expected: `b4` and `b1` 3,338 / 3,338, including the six inputs of 257-2,000 symbols, because the raw model is not
capped. `pipeline` and `seg` will differ from Python on exactly those six by design (fix 3: basic spelling plus
`LONG_RUN_WARNING`), so 3,332 / 3,338 there is the expected result, and any other miss is a regression.

(c) The builder's 24,959-word reference (`$S/indicxlit/out/reference.json`), to show nothing regressed:

```
cd $S/indicxlit-fix
for i in 0 1 2 3; do node parity24k.mjs $M ../indicxlit/out/reference.json out/par24k-$i.json $i 4 > logs/par24k-$i.log & done; wait
python -X utf8 merge_parity.py ../indicxlit/out/reference.json "out/par24k-*.json" out/par24k-mismatch.json
```

Expected: 24,959 / 24,959 at beam 4 and at beam 1, as before the fixes.

Run (b) and (c) one after the other on a quiet machine. If speed is also to be quoted, take it from a separate
single-shard run, not from these four-shard runs.
