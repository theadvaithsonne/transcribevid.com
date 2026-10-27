import { gatherRows, GpuDeviceLike, isWholeTensor, RowTensor, rowBytes, TensorFactory } from './kv-rows';

class T implements RowTensor {
  disposed = false;
  constructor(
    public type: string,
    public data: Float32Array | null,
    public dims: number[],
    public location?: string,
    public ort_tensor?: unknown,
  ) {}
  dispose(): void {
    this.disposed = true;
  }
}

const cpuMake: TensorFactory<T> = {
  cpu: (type, data, dims) => new T(type, data, dims),
  gpu: () => {
    throw new Error('no GPU here');
  },
};

/** [batch, 2, 3] float32 whose row b holds b*100 + 0..5 */
const tensor = (batch: number, base = 0) =>
  new T('float32', Float32Array.from({ length: batch * 6 }, (_, i) => base + Math.floor(i / 6) * 100 + (i % 6)), [batch, 2, 3]);

describe('kv-rows: batch-row copies of KV-cache tensors', () => {
  it('gathers rows from several tensors in the given order (a beam can fork into two rows or die)', () => {
    const a = tensor(3);
    const b = tensor(2, 1000);
    const g = gatherRows([{ t: a, row: 2 }, { t: b, row: 0 }, { t: a, row: 2 }, { t: a, row: 0 }], cpuMake, null);
    expect(g.dims).toEqual([4, 2, 3]);
    expect(Array.from(g.data!)).toEqual([
      ...[200, 201, 202, 203, 204, 205],
      ...[1000, 1001, 1002, 1003, 1004, 1005],
      ...[200, 201, 202, 203, 204, 205],
      ...[0, 1, 2, 3, 4, 5],
    ]);
    // a copy: the sources are untouched
    g.data![0] = -1;
    expect(a.data![12]).toBe(200);
  });

  it('tiles one row (the cross-attention KV to the batch size)', () => {
    const g = gatherRows(Array.from({ length: 3 }, () => ({ t: tensor(1, 7), row: 0 })), cpuMake, null);
    expect(g.dims).toEqual([3, 2, 3]);
    expect(Array.from(g.data!.subarray(12))).toEqual([7, 8, 9, 10, 11, 12]);
  });

  it('isWholeTensor: rows 0..n-1 of one batch-n tensor need no copy', () => {
    const a = tensor(2);
    expect(isWholeTensor([{ t: a, row: 0 }, { t: a, row: 1 }])).toBe(true);
    expect(isWholeTensor([{ t: a, row: 1 }, { t: a, row: 0 }])).toBe(false);
    expect(isWholeTensor([{ t: a, row: 0 }])).toBe(false);
    expect(isWholeTensor([{ t: tensor(1), row: 0 }])).toBe(true);
    expect(isWholeTensor([])).toBe(false);
  });

  it('rejects rows of different shapes, out-of-range rows and mixed devices', () => {
    const a = tensor(2);
    const other = new T('float32', new Float32Array(8), [1, 2, 4]);
    expect(() => gatherRows([{ t: a, row: 0 }, { t: other, row: 0 }], cpuMake, null)).toThrow(/different shapes/);
    expect(() => gatherRows([{ t: a, row: 2 }], cpuMake, null)).toThrow(/out of range/);
    expect(() => gatherRows([], cpuMake, null)).toThrow(/nothing/);
    expect(rowBytes(a)).toBe(24);
  });

  it('copies WebGPU rows buffer-to-buffer on the device ORT runs on, into a tensor that frees its buffer', () => {
    const copies: unknown[][] = [];
    const submitted: unknown[] = [];
    const destroyed: unknown[] = [];
    const device: GpuDeviceLike = {
      createBuffer: ({ size, usage }) => {
        const buf = { size, usage, destroy: () => destroyed.push(buf) };
        return buf;
      },
      createCommandEncoder: () => ({
        copyBufferToBuffer: (...args: unknown[]) => copies.push(args),
        finish: () => 'cmd',
      }),
      queue: { submit: (b) => submitted.push(...b) },
    };
    let made: { buffer: unknown; opts: { dataType: string; dims: number[]; dispose: () => void } } | null = null;
    class Ort {
      static fromGpuBuffer(buffer: unknown, opts: { dataType: string; dims: number[]; dispose: () => void }) {
        made = { buffer, opts };
        return { gpu: true };
      }
    }
    const gpuTensor = (batch: number, name: string) =>
      new T('float32', null, [batch, 2, 3], 'gpu-buffer', Object.assign(new Ort(), { gpuBuffer: name }));
    const a = gpuTensor(3, 'A');
    const b = gpuTensor(1, 'B');
    const wrapped: unknown[] = [];
    const make: TensorFactory<T> = {
      cpu: cpuMake.cpu,
      gpu: (ort) => {
        wrapped.push(ort);
        return new T('float32', null, [2, 2, 3], 'gpu-buffer');
      },
    };
    gatherRows([{ t: a, row: 2 }, { t: b, row: 0 }], make, device);
    // 24 bytes per row: A row 2 -> offset 0, B row 0 -> offset 24, one submit
    expect(copies).toEqual([
      ['A', 48, expect.objectContaining({ size: 48 }), 0, 24],
      ['B', 0, expect.objectContaining({ size: 48 }), 24, 24],
    ]);
    expect(submitted).toEqual(['cmd']);
    expect(made!.opts.dataType).toBe('float32');
    expect(made!.opts.dims).toEqual([2, 2, 3]);
    expect(wrapped).toEqual([{ gpu: true }]);
    made!.opts.dispose();
    expect(destroyed).toEqual([made!.buffer]);
    expect(() => gatherRows([{ t: a, row: 0 }], make, null)).toThrow(/WebGPU device/);
    expect(() => gatherRows([{ t: a, row: 0 }, { t: tensor(1), row: 0 }], make, device)).toThrow(/mixed/);
  });
});
