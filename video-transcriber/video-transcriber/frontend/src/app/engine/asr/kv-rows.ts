/**
 * Row (batch-axis) copies of the decoder's KV-cache tensors, for batched beam search and best-of sampling.
 *
 * With batched decoding every forward pass takes the cache of all active hypotheses as one batch (axis 0 = hypothesis).
 * After a step the surviving hypotheses descend from arbitrary rows of the step's output (a beam can fork into two or
 * die), so the next input is built by copying rows: row i of the result = row `rows[i].row` of tensor `rows[i].t`.
 * The same copy tiles the per-window cross-attention KV (one row) to the batch size: the Whisper ONNX graphs reshape by
 * batch x heads, so a batch-1 cross KV does not broadcast (measured: logits off by 11-22).
 *
 * Tensors in WebGPU buffers (the merged decoder's `present.*` outputs, `preferredOutputLocation: 'gpu-buffer'`) are
 * copied buffer-to-buffer on the GPU; nothing goes through the CPU. CPU tensors (WASM) are typed-array copies.
 * Row bytes are contiguous because the batch is the outermost axis.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** The tensor shape this module works with (a Transformers.js Tensor, or the specs' fake). */
export interface RowTensor {
  dims: number[];
  type: string;
  data: any;
  location?: string;
  /** the onnxruntime-web tensor behind a Transformers.js Tensor (`gpuBuffer`, `constructor.fromGpuBuffer`) */
  ort_tensor?: any;
  dispose(): void;
}

/** One source row of a gather. */
export interface RowRef<T extends RowTensor = RowTensor> {
  t: T;
  row: number;
}

/** The GPUDevice calls used here (typed loosely: the engine has no DOM / WebGPU typings). */
export interface GpuDeviceLike {
  createBuffer(desc: { size: number; usage: number }): { destroy(): void };
  createCommandEncoder(): {
    copyBufferToBuffer(src: unknown, srcOffset: number, dst: unknown, dstOffset: number, size: number): void;
    finish(): unknown;
  };
  queue: { submit(buffers: unknown[]): void };
}

/** GPUBufferUsage.STORAGE | COPY_SRC | COPY_DST (constants of the WebGPU spec; no global needed). */
const GPU_USAGE = 0x80 | 0x04 | 0x08;

const BYTES: Record<string, number> = { float32: 4, float16: 2, int64: 8, int32: 4, uint16: 2, int8: 1, uint8: 1 };

export function elementCount(dims: readonly number[]): number {
  let n = 1;
  for (const d of dims) n *= d;
  return n;
}

/** Bytes of one batch row of `t`. */
export function rowBytes(t: RowTensor): number {
  const b = BYTES[t.type];
  if (!b) throw new Error(`kv-rows: unsupported tensor type ${t.type}`);
  return (elementCount(t.dims) / Math.max(1, t.dims[0])) * b;
}

/** True when `rows` is exactly rows 0..n-1 of one tensor with batch n: the tensor itself is the gather. */
export function isWholeTensor(rows: readonly RowRef[]): boolean {
  const t = rows[0]?.t;
  if (!t || t.dims[0] !== rows.length) return false;
  for (let i = 0; i < rows.length; i++) if (rows[i].t !== t || rows[i].row !== i) return false;
  return true;
}

/** Wraps new data as the caller's tensor class (Transformers.js `Tensor`: `new Tensor(type, data, dims)` / `new Tensor(ort)`). */
export interface TensorFactory<T extends RowTensor> {
  cpu(type: string, data: any, dims: number[]): T;
  /** an onnxruntime-web tensor made with `fromGpuBuffer` */
  gpu(ortTensor: unknown): T;
}

/**
 * Row i of the result = row `rows[i].row` of `rows[i].t`. All sources must have the same type and the same dims after
 * axis 0, and be all on the GPU (`device` required) or all on the CPU. The result is a new tensor the caller owns
 * (dispose it: on the GPU that destroys its buffer).
 */
export function gatherRows<T extends RowTensor>(
  rows: readonly RowRef<T>[],
  make: TensorFactory<T>,
  device: GpuDeviceLike | null,
): T {
  if (!rows.length) throw new Error('kv-rows: nothing to gather');
  const first = rows[0].t;
  const dims = [rows.length, ...first.dims.slice(1)];
  const bytes = rowBytes(first);
  const onGpu = first.location === 'gpu-buffer';
  for (const r of rows) {
    if (r.t.type !== first.type || r.t.dims.length !== first.dims.length || rowBytes(r.t) !== bytes)
      throw new Error('kv-rows: rows of different shapes');
    if (r.row < 0 || r.row >= r.t.dims[0]) throw new Error(`kv-rows: row ${r.row} out of range`);
    if ((r.t.location === 'gpu-buffer') !== onGpu) throw new Error('kv-rows: mixed CPU and GPU rows');
  }
  if (onGpu) {
    if (!device) throw new Error('kv-rows: a GPU tensor needs the WebGPU device');
    const Ort = first.ort_tensor?.constructor;
    if (!Ort?.fromGpuBuffer) throw new Error('kv-rows: not an onnxruntime-web GPU tensor');
    // copyBufferToBuffer needs 4-byte multiples; KV rows are heads x length x 64 elements of 2 or 4 bytes
    if (bytes % 4 !== 0) throw new Error('kv-rows: row size is not a multiple of 4 bytes');
    const buffer = device.createBuffer({ size: Math.max(4, bytes * rows.length), usage: GPU_USAGE });
    const enc = device.createCommandEncoder();
    rows.forEach((r, i) => {
      if (bytes) enc.copyBufferToBuffer(r.t.ort_tensor.gpuBuffer, r.row * bytes, buffer, i * bytes, bytes);
    });
    device.queue.submit([enc.finish()]);
    const ort = Ort.fromGpuBuffer(buffer, { dataType: first.type, dims, dispose: () => buffer.destroy() });
    return make.gpu(ort);
  }
  const per = elementCount(first.dims) / Math.max(1, first.dims[0]);
  const out = new first.data.constructor(per * rows.length);
  rows.forEach((r, i) => out.set(r.t.data.subarray(r.row * per, (r.row + 1) * per), i * per));
  return make.cpu(first.type, out, dims);
}
