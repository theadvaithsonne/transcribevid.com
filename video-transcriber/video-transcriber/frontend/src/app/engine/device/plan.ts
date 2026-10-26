/**
 * Model gating: which models a device is offered, which one is the default and which are hidden with a reason.
 * One row per device class, straight from ARCHITECTURE.md section 5 ("honest, never a silent swap"); the two
 * extra rows (no shader-f16, little memory on a desktop) and the unknown-memory assumption are documented in
 * README.md. The table is data: every row is a spec case.
 */
import {
  Backend,
  MixName,
  ModelCatalog,
  ModelData,
  ModelEngine,
  ModelMix,
  MODEL_DATA,
  sizeText,
} from './model-data';
import { DeviceInfo, PlatformClass } from './probe';

export type DeviceClassId =
  | 'desktop-webgpu-f16-8gb'
  | 'desktop-webgpu-f16-4gb'
  | 'desktop-webgpu-no-f16'
  | 'desktop-wasm'
  | 'desktop-low-memory'
  | 'mobile-webgpu'
  | 'mobile-weak';

/** The part of DeviceInfo the table looks at. */
export interface DeviceFacts {
  platform: PlatformClass;
  webgpu: boolean;
  shaderF16: boolean;
  /** GB as reported, null when the browser does not say (Safari, Firefox) */
  deviceMemory: number | null;
}

export interface GatingRow {
  id: DeviceClassId;
  /** the "Device class (probe)" cell of the table */
  label: string;
  source: string;
  matches: (f: ResolvedFacts) => boolean;
  offered: readonly string[];
  defaultModel: string;
  /** why a model that is not in `offered` is hidden */
  reason: (model: ModelData, f: ResolvedFacts) => string;
}

export interface ResolvedFacts extends DeviceFacts {
  mobile: boolean;
  /** deviceMemory with the unknown-memory assumption applied */
  memoryGB: number;
  memoryAssumed: boolean;
}

export const REASON = {
  needs8GB: 'needs 8 GB',
  needs4GB: 'needs 4 GB',
  needsGraphics: 'needs a graphics-capable browser (Chrome, Edge)',
  needsWebGpu: 'needs WebGPU',
  needsShaderF16: 'needs 16-bit shader support (shader-f16) in the graphics driver',
  useComputer: 'use a computer for this size',
} as const;

export const WORD_TIMESTAMPS_NOTE = 'not available for this size';

const WHISPER_SMALL_SET = ['tiny', 'base', 'small'] as const;
const ALL = [
  'tiny',
  'base',
  'small',
  'medium',
  'large-v3-turbo',
  'large-v3',
  'distil-large-v3',
  'qwen3-asr-0.6b',
  'qwen3-asr-1.7b',
] as const;

/** When the browser does not report memory: a desktop is assumed to have 4 GB, a phone or tablet 3 GB. */
export const ASSUMED_MEMORY_GB: Record<'desktop' | 'mobile', number> = { desktop: 4, mobile: 3 };

const qwenOr = (ifQwen: string, otherwise: string) => (m: ModelData) =>
  m.engine === 'qwen' ? ifQwen : otherwise;

export const GATING_TABLE: readonly GatingRow[] = [
  {
    id: 'desktop-webgpu-f16-8gb',
    label: 'Desktop, WebGPU + shader-f16, deviceMemory >= 8',
    source: 'ARCHITECTURE.md section 5 row 1',
    matches: (f) => !f.mobile && f.webgpu && f.shaderF16 && f.memoryGB >= 8,
    offered: ALL,
    defaultModel: 'small',
    reason: () => REASON.needs8GB,
  },
  {
    id: 'desktop-webgpu-f16-4gb',
    label: 'Desktop, WebGPU + shader-f16, deviceMemory 4-8',
    source: 'ARCHITECTURE.md section 5 row 2',
    matches: (f) => !f.mobile && f.webgpu && f.shaderF16 && f.memoryGB >= 4 && f.memoryGB < 8,
    offered: ['tiny', 'base', 'small', 'large-v3-turbo'],
    defaultModel: 'small',
    reason: () => REASON.needs8GB,
  },
  {
    id: 'desktop-webgpu-no-f16',
    label: 'Desktop, WebGPU without shader-f16, deviceMemory >= 4',
    source:
      'README.md extension: the big models only exist as q4f16 / fp16 downloads (model-matrix.md section 2), which need shader-f16',
    matches: (f) => !f.mobile && f.webgpu && !f.shaderF16 && f.memoryGB >= 4,
    offered: WHISPER_SMALL_SET,
    defaultModel: 'small',
    reason: () => REASON.needsShaderF16,
  },
  {
    id: 'desktop-wasm',
    label: 'Desktop, no WebGPU (WASM, 1 thread), deviceMemory >= 4',
    source: 'ARCHITECTURE.md section 5 row 3',
    matches: (f) => !f.mobile && !f.webgpu && f.memoryGB >= 4,
    offered: WHISPER_SMALL_SET,
    defaultModel: 'base',
    reason: qwenOr(REASON.needsWebGpu, REASON.needsGraphics),
  },
  {
    id: 'desktop-low-memory',
    label: 'Desktop, deviceMemory < 4',
    source:
      'README.md extension: small needs 4 GB on WASM and 8 GB on WebGPU (model-matrix.md section 5 "Min RAM")',
    matches: (f) => !f.mobile && f.memoryGB < 4,
    offered: ['tiny', 'base'],
    defaultModel: 'tiny',
    reason: (m, f) =>
      m.engine === 'qwen' && !f.webgpu ? REASON.needsWebGpu : m.id === 'small' ? REASON.needs4GB : REASON.needs8GB,
  },
  {
    id: 'mobile-webgpu',
    label: 'Phone / tablet, WebGPU, deviceMemory > 2',
    source: 'ARCHITECTURE.md section 5 row 4',
    matches: (f) => f.mobile && f.webgpu && f.memoryGB > 2,
    offered: WHISPER_SMALL_SET,
    defaultModel: 'base',
    reason: () => REASON.useComputer,
  },
  {
    id: 'mobile-weak',
    label: 'Phone / tablet, no WebGPU, or deviceMemory <= 2',
    source: 'ARCHITECTURE.md section 5 row 5',
    matches: (f) => f.mobile && (!f.webgpu || f.memoryGB <= 2),
    offered: ['tiny', 'base'],
    defaultModel: 'tiny',
    reason: () => REASON.useComputer,
  },
];

export interface OfferedModel {
  id: string;
  label: string;
  engine: ModelEngine;
  mixName: MixName;
  mix: ModelMix;
  downloadMB: number;
  /** "485 MB" / "1.96 GB": the real download size */
  sizeText: string;
  wordTimestamps: boolean;
  /** "not available for this size" for large-v3 / distil-large-v3, else null */
  wordTimestampsNote: string | null;
  /** measured real-time factor on the chosen backend, null when nothing was measured */
  rtf: number | null;
  rtfMeasured: boolean;
  notes: string[];
}

export interface HiddenModel {
  id: string;
  label: string;
  engine: ModelEngine;
  reason: string;
}

export interface DevicePlan {
  deviceClass: DeviceClassId;
  deviceClassLabel: string;
  backend: Backend;
  shaderF16: boolean;
  offered: OfferedModel[];
  defaultModel: string;
  hidden: HiddenModel[];
  /** honest copy for the picker: assumptions made, things not measured */
  notes: string[];
  facts: ResolvedFacts;
}

export function resolveFacts(info: DeviceFacts): ResolvedFacts {
  const mobile = info.platform !== 'desktop';
  const memoryAssumed = info.deviceMemory === null;
  const memoryGB = info.deviceMemory ?? (mobile ? ASSUMED_MEMORY_GB.mobile : ASSUMED_MEMORY_GB.desktop);
  return { ...info, mobile, memoryGB, memoryAssumed };
}

export function findRow(info: DeviceFacts): GatingRow {
  const f = resolveFacts(info);
  const row = GATING_TABLE.find((r) => r.matches(f));
  if (!row) throw new Error(`device policy: no row matches ${JSON.stringify(f)}`);
  return row;
}

/** The dtype mix a model runs with on this device: WebGPU fp16 / q4f16 with shader-f16, fp32 / q4 without, q8 on WASM. */
export function mixFor(model: ModelData, facts: DeviceFacts): { name: MixName; mix: ModelMix } | null {
  const order: MixName[] = facts.webgpu
    ? facts.shaderF16
      ? ['webgpuF16', 'webgpuQ4F16', 'webgpuNoShaderF16', 'webgpuQ4']
      : ['webgpuNoShaderF16', 'webgpuQ4']
    : ['wasmQ8'];
  for (const name of order) {
    const mix = model.mixes[name];
    if (mix) return { name, mix };
  }
  return null;
}

export function planFor(info: DeviceInfo | DeviceFacts, catalog: ModelCatalog = MODEL_DATA): DevicePlan {
  const facts = resolveFacts(info);
  const row = findRow(facts);
  const backend: Backend = facts.webgpu ? 'webgpu' : 'wasm';
  const offered: OfferedModel[] = [];
  const hidden: HiddenModel[] = [];
  const notes: string[] = [];
  if (facts.memoryAssumed) {
    notes.push(
      `This browser does not report memory; ${facts.memoryGB} GB assumed. Pick a smaller model if the page gets slow.`,
    );
  }
  if (facts.mobile) {
    notes.push('Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.');
  }
  if (backend === 'wasm') {
    notes.push('No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.');
  } else if (!facts.shaderF16) {
    notes.push('The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.');
  }

  for (const id of row.offered) {
    const model = catalog.find((m) => m.id === id);
    if (!model) continue; // a catalog without the model (e.g. Qwen before M5): nothing to offer
    const picked = mixFor(model, facts);
    if (!picked) throw new Error(`device policy: ${row.id} offers ${id} but it has no ${backend} mix`);
    const rtf = model.rtf[backend] ?? null;
    const modelNotes: string[] = [];
    if (rtf && rtf.value >= 1) modelNotes.push('slower than real time on the measured laptop');
    if (model.minRamGB[backend] && facts.memoryGB < model.minRamGB[backend]!) {
      modelNotes.push(`${model.minRamGB[backend]} GB of memory recommended`);
    }
    offered.push({
      id: model.id,
      label: model.label,
      engine: model.engine,
      mixName: picked.name,
      mix: picked.mix,
      downloadMB: picked.mix.downloadMB,
      sizeText: sizeText(picked.mix.downloadMB),
      wordTimestamps: model.wordTimestamps,
      wordTimestampsNote: model.wordTimestamps ? null : WORD_TIMESTAMPS_NOTE,
      rtf: rtf ? rtf.value : null,
      rtfMeasured: !!rtf && rtf.measured,
      notes: modelNotes,
    });
  }
  for (const model of catalog) {
    if (row.offered.includes(model.id)) continue;
    hidden.push({ id: model.id, label: model.label, engine: model.engine, reason: row.reason(model, facts) });
  }
  const defaultModel = offered.some((m) => m.id === row.defaultModel)
    ? row.defaultModel
    : (offered[0]?.id ?? row.defaultModel);
  return {
    deviceClass: row.id,
    deviceClassLabel: row.label,
    backend,
    shaderF16: facts.webgpu && facts.shaderF16,
    offered,
    defaultModel,
    hidden,
    notes,
    facts,
  };
}
