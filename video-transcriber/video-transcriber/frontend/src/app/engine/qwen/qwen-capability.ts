/**
 * Where Qwen3-ASR can run in the browser, as the pickers say it. The decision itself is engine/device's gating table
 * (ARCHITECTURE section 5): Qwen is offered only on a desktop with WebGPU + `shader-f16` and at least 8 GB
 * (`desktop-webgpu-f16-8gb`); CPU / WebAssembly is unusable for it (qwen.md section 3.4: real-time factor 7-26).
 * Everywhere else both Qwen entries stay in the pickers, disabled, with this reason (never silently dropped).
 *
 * No import of engine/device here: the transport uses this on the page and must not pull the device tables into the
 * main bundle. The two plan reasons below are engine/device REASON.needs8GB / needsShaderF16 (a spec checks it).
 */

export const QWEN_DEVICE_REASON = 'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).';

export const PLAN_REASON_NEEDS_8GB = 'needs 8 GB';
export const PLAN_REASON_NEEDS_SHADER_F16 = 'needs 16-bit shader support (shader-f16) in the graphics driver';

/** The picker's reason for a Qwen model the device plan does not offer (`planReason` = the plan's own reason). */
export function qwenReason(planReason: string | null | undefined): string {
  const base = QWEN_DEVICE_REASON.slice(0, -1);
  if (planReason === PLAN_REASON_NEEDS_8GB) return `${base} and 8 GB of memory.`;
  if (planReason === PLAN_REASON_NEEDS_SHADER_F16) return `${base} and 16-bit shader support (shader-f16) in the graphics driver.`;
  return QWEN_DEVICE_REASON;
}

/** Shown next to an offered Qwen model on an integrated GPU (qwen.md section 5, "Fallback text"). */
export const QWEN_SPEED_NOTE =
  'Qwen runs at about the speed of the recording on integrated graphics (Hindi is slower than English). A dedicated GPU or Apple Silicon is much faster.';
