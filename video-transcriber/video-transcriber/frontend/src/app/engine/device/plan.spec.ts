import { MODEL_DATA, sizeText } from './model-data';
import { ASSUMED_MEMORY_GB, DeviceFacts, GATING_TABLE, REASON, findRow, planFor } from './plan';

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
];

const desktop = (over: Partial<DeviceFacts> = {}): DeviceFacts => ({
  platform: 'desktop',
  webgpu: true,
  shaderF16: true,
  deviceMemory: 8,
  ...over,
});

interface RowCase {
  name: string;
  facts: DeviceFacts;
  row: string;
  offered: string[];
  default: string;
  /** model id -> reason, for every model of the catalog that is not offered */
  hidden: Record<string, string>;
}

const hiddenAll = (offered: string[], reason: (id: string) => string): Record<string, string> =>
  Object.fromEntries(ALL.filter((id) => !offered.includes(id)).map((id) => [id, reason(id)]));

// ARCHITECTURE.md section 5, one case per row (plus the two documented extensions)
const ROWS: RowCase[] = [
  {
    name: 'row 1: desktop, WebGPU + shader-f16, deviceMemory >= 8',
    facts: desktop({ deviceMemory: 8 }),
    row: 'desktop-webgpu-f16-8gb',
    offered: ALL,
    default: 'small',
    hidden: {},
  },
  {
    name: 'row 2: desktop, WebGPU, deviceMemory 4-8',
    facts: desktop({ deviceMemory: 4 }),
    row: 'desktop-webgpu-f16-4gb',
    offered: ['tiny', 'base', 'small', 'large-v3-turbo'],
    default: 'small',
    hidden: hiddenAll(['tiny', 'base', 'small', 'large-v3-turbo'], () => 'needs 8 GB'),
  },
  {
    name: 'row 3: desktop, no WebGPU (WASM, 1 thread)',
    facts: desktop({ webgpu: false, shaderF16: false, deviceMemory: 8 }),
    row: 'desktop-wasm',
    offered: ['tiny', 'base', 'small'],
    default: 'base',
    hidden: hiddenAll(['tiny', 'base', 'small'], (id) =>
      id.startsWith('qwen') ? 'needs WebGPU' : 'needs a graphics-capable browser (Chrome, Edge)',
    ),
  },
  {
    name: 'row 4: phone / tablet, WebGPU',
    facts: { platform: 'phone', webgpu: true, shaderF16: true, deviceMemory: 4 },
    row: 'mobile-webgpu',
    offered: ['tiny', 'base', 'small'],
    default: 'base',
    hidden: hiddenAll(['tiny', 'base', 'small'], () => 'use a computer for this size'),
  },
  {
    name: 'row 5: phone / tablet, no WebGPU',
    facts: { platform: 'tablet', webgpu: false, shaderF16: false, deviceMemory: 4 },
    row: 'mobile-weak',
    offered: ['tiny', 'base'],
    default: 'tiny',
    hidden: hiddenAll(['tiny', 'base'], () => 'use a computer for this size'),
  },
  {
    name: 'row 5: phone with WebGPU but deviceMemory <= 2',
    facts: { platform: 'phone', webgpu: true, shaderF16: true, deviceMemory: 2 },
    row: 'mobile-weak',
    offered: ['tiny', 'base'],
    default: 'tiny',
    hidden: hiddenAll(['tiny', 'base'], () => 'use a computer for this size'),
  },
  {
    name: 'extension: desktop, WebGPU without shader-f16',
    facts: desktop({ shaderF16: false, deviceMemory: 8 }),
    row: 'desktop-webgpu-no-f16',
    offered: ['tiny', 'base', 'small'],
    default: 'small',
    hidden: hiddenAll(['tiny', 'base', 'small'], () => REASON.needsShaderF16),
  },
  {
    name: 'extension: desktop with deviceMemory < 4',
    facts: desktop({ deviceMemory: 2 }),
    row: 'desktop-low-memory',
    offered: ['tiny', 'base'],
    default: 'tiny',
    hidden: hiddenAll(['tiny', 'base'], (id) => (id === 'small' ? 'needs 4 GB' : 'needs 8 GB')),
  },
];

describe('planFor: the gating table of ARCHITECTURE.md section 5', () => {
  for (const c of ROWS) {
    it(c.name, () => {
      const plan = planFor(c.facts);
      expect(plan.deviceClass).toBe(c.row);
      expect(plan.offered.map((m) => m.id)).toEqual(c.offered);
      expect(plan.defaultModel).toBe(c.default);
      expect(Object.fromEntries(plan.hidden.map((h) => [h.id, h.reason]))).toEqual(c.hidden);
      // every catalog model is either offered or hidden with a reason, never silently dropped
      expect([...plan.offered.map((m) => m.id), ...plan.hidden.map((h) => h.id)].sort()).toEqual(
        [...ALL].sort(),
      );
    });
  }

  it('row 2 at the upper edge (deviceMemory 6) is still row 2; 8 is row 1', () => {
    expect(findRow(desktop({ deviceMemory: 6 })).id).toBe('desktop-webgpu-f16-4gb');
    expect(findRow(desktop({ deviceMemory: 8 })).id).toBe('desktop-webgpu-f16-8gb');
    expect(findRow(desktop({ deviceMemory: 16 })).id).toBe('desktop-webgpu-f16-8gb');
  });

  it('matches exactly one row for every combination of the probe facts', () => {
    const memories = [null, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 16];
    for (const platform of ['desktop', 'tablet', 'phone'] as const)
      for (const webgpu of [true, false])
        for (const shaderF16 of [true, false])
          for (const deviceMemory of memories) {
            const facts = { platform, webgpu, shaderF16: webgpu && shaderF16, deviceMemory };
            const mobile = platform !== 'desktop';
            const memoryGB = deviceMemory ?? (mobile ? ASSUMED_MEMORY_GB.mobile : ASSUMED_MEMORY_GB.desktop);
            const resolved = { ...facts, mobile, memoryGB, memoryAssumed: deviceMemory === null };
            const rows = GATING_TABLE.filter((r) => r.matches(resolved)).map((r) => r.id);
            expect(rows.length, JSON.stringify(facts)).toBe(1);
          }
  });

  it('offers turbo on the q4f16 mix and the small sizes on fp16 when shader-f16 is there', () => {
    const plan = planFor(desktop({ deviceMemory: 4 }));
    const by = Object.fromEntries(plan.offered.map((m) => [m.id, m]));
    expect(by['large-v3-turbo'].mixName).toBe('webgpuQ4F16');
    expect(by['large-v3-turbo'].sizeText).toBe('564 MB');
    expect(by['small'].mixName).toBe('webgpuF16');
    expect(by['small'].sizeText).toBe('485 MB');
    expect(plan.backend).toBe('webgpu');
  });

  it('uses the q8 WASM downloads without WebGPU and the fp32 / q4 mix without shader-f16', () => {
    const wasm = planFor(desktop({ webgpu: false, shaderF16: false }));
    expect(wasm.offered.map((m) => [m.id, m.mixName, m.sizeText])).toEqual([
      ['tiny', 'wasmQ8', '41 MB'],
      ['base', 'wasmQ8', '77 MB'],
      ['small', 'wasmQ8', '249 MB'],
    ]);
    expect(wasm.backend).toBe('wasm');
    const noF16 = planFor(desktop({ shaderF16: false }));
    expect(noF16.offered.map((m) => [m.id, m.mixName, m.downloadMB])).toEqual([
      ['tiny', 'webgpuNoShaderF16', 119.7],
      ['base', 'webgpuNoShaderF16', 206.2],
      ['small', 'webgpuNoShaderF16', 586.2],
    ]);
  });

  it('shows the real download sizes of the catalog (section 5 list)', () => {
    const plan = planFor(desktop());
    expect(plan.offered.map((m) => [m.id, m.sizeText])).toEqual([
      ['tiny', '76 MB'],
      ['base', '146 MB'],
      ['small', '485 MB'],
      ['medium', '517 MB'],
      ['large-v3-turbo', '564 MB'],
      ['large-v3', '980 MB'],
      ['distil-large-v3', '534 MB'],
      ['qwen3-asr-0.6b', '890 MB'],
      ['qwen3-asr-1.7b', '1.96 GB'],
    ]);
  });

  it('says "not available for this size" for word timing on large-v3 and distil-large-v3', () => {
    const plan = planFor(desktop());
    const notes = Object.fromEntries(plan.offered.map((m) => [m.id, m.wordTimestampsNote]));
    expect(notes['large-v3']).toBe('not available for this size');
    expect(notes['distil-large-v3']).toBe('not available for this size');
    expect(notes['small']).toBeNull();
    expect(notes['large-v3-turbo']).toBeNull();
  });

  it('flags the models that are slower than real time on the measured laptop', () => {
    const plan = planFor(desktop());
    const slow = plan.offered.filter((m) => m.notes.includes('slower than real time on the measured laptop'));
    expect(slow.map((m) => m.id)).toEqual(['medium', 'large-v3-turbo', 'large-v3', 'qwen3-asr-1.7b']);
  });

  it('assumes 4 GB on a desktop and 3 GB on a phone when deviceMemory is not reported, and says so', () => {
    const d = planFor(desktop({ deviceMemory: null }));
    expect(d.deviceClass).toBe('desktop-webgpu-f16-4gb');
    expect(d.notes[0]).toContain('4 GB assumed');
    const p = planFor({ platform: 'phone', webgpu: true, shaderF16: false, deviceMemory: null });
    expect(p.deviceClass).toBe('mobile-webgpu');
    expect(p.notes[0]).toContain('3 GB assumed');
    expect(p.notes.join(' ')).toContain('estimated, not measured');
  });

  it('skips models the catalog does not have (Qwen before M5) without hiding or failing', () => {
    const whisperOnly = MODEL_DATA.filter((m) => m.engine === 'whisper');
    const plan = planFor(desktop(), whisperOnly);
    expect(plan.offered.map((m) => m.id)).toEqual(ALL.filter((id) => !id.startsWith('qwen')));
    expect(plan.hidden).toEqual([]);
  });
});

describe('sizeText', () => {
  it('uses MB below 1 GB and trims the GB decimals', () => {
    expect(sizeText(40.8)).toBe('41 MB');
    expect(sizeText(979.5)).toBe('980 MB');
    expect(sizeText(1960)).toBe('1.96 GB');
    expect(sizeText(2700)).toBe('2.7 GB');
    expect(sizeText(1000)).toBe('1 GB');
  });
});
