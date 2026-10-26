/**
 * "About how long will this take?" from the measured real-time factors in model-data.ts. Always labelled an
 * estimate: the numbers come from one laptop (model-matrix.md), a phone or tablet gets a flat slowdown factor
 * and anything not measured is marked arithmetic. A long file on a weak device gets a warning, never a refusal
 * (ARCHITECTURE.md section 5).
 */
import { Backend, MOBILE_SLOWDOWN, ModelCatalog, MODEL_DATA, findModel } from './model-data';
import { DeviceFacts } from './plan';

export type EstimateBasis = 'measured' | 'arithmetic';

export interface TimeEstimate {
  /** null when nothing is known for this model on this backend */
  seconds: number | null;
  /** the effective real-time factor used (desktop RTF times the mobile factor where it applies) */
  rtf: number | null;
  basis: EstimateBasis;
  backend: Backend;
  /** always 'estimate': UI copy must not present it as anything firmer */
  label: 'estimate';
  /** "about 4 min (estimate)" or "no estimate for this model here" */
  text: string;
  warnings: LongFileWarning[];
  sources: string[];
}

export type WarningCode = 'slower-than-real-time' | 'long-wait' | 'low-memory';

export interface LongFileWarning {
  code: WarningCode;
  message: string;
}

/** Above this many seconds of estimated work the picker warns, whatever the model. */
export const LONG_WAIT_SECONDS = 20 * 60;
/** Files longer than this on a device with `deviceMemory` <= LOW_MEMORY_GB get the memory warning. */
export const LOW_MEMORY_FILE_SECONDS = 60 * 60;
export const LOW_MEMORY_GB = 4;

export function formatDuration(seconds: number): string {
  if (seconds < 60) return 'under a minute';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `about ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `about ${h} h` : `about ${h} h ${m} min`;
}

export function formatEstimate(seconds: number | null): string {
  return seconds === null ? 'no estimate for this model here' : `${formatDuration(seconds)} (estimate)`;
}

export function estimateTime(
  durationSeconds: number,
  modelId: string,
  info: DeviceFacts,
  catalog: ModelCatalog = MODEL_DATA,
): TimeEstimate {
  const backend: Backend = info.webgpu ? 'webgpu' : 'wasm';
  const model = findModel(catalog, modelId);
  const measured = model?.rtf[backend];
  const duration = Math.max(0, Number.isFinite(durationSeconds) ? durationSeconds : 0);
  if (!model || !measured) {
    return {
      seconds: null,
      rtf: null,
      basis: 'arithmetic',
      backend,
      label: 'estimate',
      text: formatEstimate(null),
      warnings: lowMemoryWarning(duration, info),
      sources: [],
    };
  }
  const mobile = info.platform !== 'desktop';
  const rtf = measured.value * (mobile ? MOBILE_SLOWDOWN.factor : 1);
  const basis: EstimateBasis = measured.measured && !mobile ? 'measured' : 'arithmetic';
  const seconds = Math.round(duration * rtf);
  const sources = [measured.source];
  if (mobile) sources.push(MOBILE_SLOWDOWN.source);
  const warnings: LongFileWarning[] = [];
  if (rtf >= 1) {
    warnings.push({
      code: 'slower-than-real-time',
      message:
        `${model.label} runs slower than real time on this device: ${formatDuration(seconds)} for ` +
        `${formatDuration(duration).replace(/^about /, '')} of audio (estimate). Tiny or base finish sooner.`,
    });
  } else if (seconds > LONG_WAIT_SECONDS) {
    warnings.push({
      code: 'long-wait',
      message: `This will take ${formatDuration(seconds)} on this device (estimate). Keep the tab open until it finishes.`,
    });
  }
  warnings.push(...lowMemoryWarning(duration, info));
  return { seconds, rtf, basis, backend, label: 'estimate', text: formatEstimate(seconds), warnings, sources };
}

function lowMemoryWarning(durationSeconds: number, info: DeviceFacts): LongFileWarning[] {
  if (info.deviceMemory !== null && info.deviceMemory <= LOW_MEMORY_GB && durationSeconds > LOW_MEMORY_FILE_SECONDS) {
    return [
      {
        code: 'low-memory',
        message:
          'This device has little memory for a file this long. It is processed in small pieces, which is slower; ' +
          'a shorter cut or a smaller model is safer.',
      },
    ];
  }
  return [];
}
