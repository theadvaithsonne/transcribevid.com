# engine/device

Capability probe, model gating, time estimates and the screen wake lock of the in-browser engine
(ARCHITECTURE.md sections 2 and 5). Pure TypeScript, no Angular.

## API

| Export | File | What it does |
|---|---|---|
| `probeDevice(env?) -> Promise<DeviceInfo>` | `probe.ts` | WebGPU adapter + `shader-f16` (`navigator.gpu.requestAdapter`, 3 s timeout, a software fallback adapter counts as no WebGPU), `deviceMemory`, `hardwareConcurrency`, `storage.estimate()`, platform class, browser family, rendering engine, WebCodecs, `decoderFallback` (WebKit, Gecko or no WebCodecs), wake-lock support. `env` = `{ navigator, window }` (fakes in specs); default is the real globals, and an empty navigator (prerendering) gives a bare desktop. |
| `parseUserAgent(ua)`, `classify(env)` | `probe.ts` | Browser / engine / platform. UA-CH (`userAgentData.mobile`, `platform`, `brands`) wins over the UA string; iPadOS-as-Mac is caught by `maxTouchPoints > 1`; a coarse-only pointer with touch on a desktop UA becomes phone (< 600 px short side) or tablet. Every iOS browser is WebKit. |
| `planFor(info, catalog?) -> DevicePlan` | `plan.ts` | The gating table below: `offered` (with the dtype mix, real download size, word-timing note, RTF), `defaultModel`, `hidden` (with reason), honest `notes`. A model missing from the catalog (Qwen before M5) is skipped, never an error. |
| `GATING_TABLE`, `findRow`, `mixFor`, `resolveFacts`, `REASON` | `plan.ts` | The table as data, for specs and the UI. |
| `estimateTime(durationSeconds, modelId, info, catalog?) -> TimeEstimate` | `estimate.ts` | `seconds = duration x RTF` (x3 on phone / tablet), `text` "about 7 min (estimate)", `basis` measured / arithmetic, `sources`, `warnings` (`slower-than-real-time`, `long-wait` above 20 min, `low-memory` for > 1 h on <= 4 GB). Never a refusal. |
| `WakeLock` | `wake-lock.ts` | `start()` on job start (requests `screen`, listens to `visibilitychange`), `stop()` on finish / error / cancel (releases, stops listening). Re-requests when the tab is visible again after the browser dropped the lock; best effort, never throws. |
| `MODEL_DATA`, `sizeText`, `MOBILE_SLOWDOWN` | `model-data.ts` | Every number of this folder, each with its source string. |

## Gating table

ARCHITECTURE.md section 5 (rows 1-5) plus two rows the table did not cover. The rows are tried in order and the
spec checks that every combination of platform x WebGPU x `shader-f16` x memory matches exactly one.

| Row id | Device class (probe) | Offered | Default | Hidden with reason | Source |
|---|---|---|---|---|---|
| `desktop-webgpu-f16-8gb` | Desktop, WebGPU + `shader-f16`, `deviceMemory` >= 8 | tiny, base, small, medium, large-v3-turbo, large-v3, distil-large-v3, Qwen 0.6B / 1.7B | small | - | section 5 row 1 |
| `desktop-webgpu-f16-4gb` | Desktop, WebGPU + `shader-f16`, `deviceMemory` 4-8 | tiny, base, small, large-v3-turbo (q4f16) | small | the rest: "needs 8 GB" | row 2 |
| `desktop-webgpu-no-f16` | Desktop, WebGPU without `shader-f16`, >= 4 GB | tiny, base, small (fp32 encoder / q4 decoder mix) | small | the rest: "needs 16-bit shader support (shader-f16) in the graphics driver" | extension: the big models only have q4f16 / fp16 WebGPU downloads in the matrix |
| `desktop-wasm` | Desktop, no WebGPU (WASM, 1 thread), >= 4 GB | tiny, base, small | base | Whisper: "needs a graphics-capable browser (Chrome, Edge)"; Qwen: "needs WebGPU" | row 3 |
| `desktop-low-memory` | Desktop, `deviceMemory` < 4 | tiny, base | tiny | small: "needs 4 GB"; the rest "needs 8 GB" (Qwen without WebGPU: "needs WebGPU") | extension: matrix "Min RAM" small 4 GB (WASM) / 8 GB (WebGPU) |
| `mobile-webgpu` | Phone / tablet, WebGPU, > 2 GB | tiny, base, small | base | the rest: "use a computer for this size" | row 4 |
| `mobile-weak` | Phone / tablet, no WebGPU, or `deviceMemory` <= 2 | tiny, base | tiny | the rest: "use a computer for this size" (the table's "-" read as "no extra reason") | row 5 |

* **Unknown memory** (Safari, Firefox do not expose `deviceMemory`): 4 GB assumed on a desktop, 3 GB on a phone
  or tablet, and the plan says so in `notes`. Chrome caps the value at 8, so ">= 8" is its top bucket.
* **Mix per backend** (`mixFor`): WebGPU with `shader-f16` -> fp16 / fp16 (tiny-small), q4f16 / q4f16 (big
  models), q4f16 for Qwen; WebGPU without -> fp32 / q4; WASM -> q8 / q8.
* **Sizes shown** = the real download of the chosen mix (`model-catalog.json`, `model-matrix.md` 3.4-3.7,
  `qwen.md` 1): tiny 41 / 76 MB, base 77 / 146 MB, small 249 / 485 MB, medium 517 MB, turbo 564 MB, large-v3
  980 MB, distil 534 MB (v3.5 on WebGPU) / 767 MB (v3 q8 on WASM), Qwen 0.6B 890 MB / 1.3 GB, 1.7B 1.96 / 2.7 GB.
* **Word timing**: large-v3 and distil-large-v3 carry "not available for this size" (no `_timestamped` export).
* Models with RTF >= 1 carry "slower than real time on the measured laptop"; a model whose matrix "Min RAM" is
  above the device memory carries "N GB of memory recommended".

## Time estimate sources

All in `model-data.ts`; RTF = wall seconds / audio seconds of the reference engine on passage-a (73 s), greedy,
words on, headless Chrome 155, Ryzen 7 7730U + Radeon iGPU (`model-matrix.md` section 2).

| Model | WASM (1 thread) | WebGPU |
|---|---|---|
| tiny | 0.33 | 0.22 |
| base | 0.52 | 0.29 |
| small | 1.49 | 0.71 |
| medium | 6 (arithmetic, matrix section 6 item 4) | 1.8 |
| large-v3-turbo | 6 (arithmetic) | 1.36 |
| large-v3 | 6 (arithmetic) | 1.77 |
| distil-large-v3 | 4.53 (passage-b, exact v3 q8) | 0.82 (v3.5 q4f16) |
| Qwen3-ASR 0.6B | - | 0.82 (`qwen.md` 3.2, fused decoder, English) |
| Qwen3-ASR 1.7B | - | 1.42 (`qwen.md` 3.3, CPU busy) |

Phones and tablets: desktop RTF x 3 (`model-matrix.md` section 4: "the WASM numbers times 2-4"), always
`basis: 'arithmetic'`. Nothing here was measured on a phone, in Safari or in Firefox.
