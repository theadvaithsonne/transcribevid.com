import { Injectable } from '@angular/core';
import type { DeviceInfo, DevicePlan, TimeEstimate } from '../../engine/device';
import type { ModelGate } from '../../engine/jobs/options';
import type { WorkerPlan } from '../../engine/worker/protocol';

/** Recycle the engine worker after this many windows on WebGPU (ARCHITECTURE section 3). */
export const WEBGPU_RECYCLE_WINDOWS = 40;

/** What the upload page shows before a job starts: the time estimate and the honest warnings. */
export interface DeviceAdvice {
  /** "about 7 min (estimate)" for all chosen files together, '' when nothing is known */
  text: string;
  warnings: string[];
}

/**
 * The visitor's device as the in-browser engine sees it (engine/device): the capability probe (once per page), the
 * model plan (offered / default / hidden with a reason) and time estimates. The engine code is imported on first use,
 * so the self-hosted edition and prerendering never load it.
 */
@Injectable({ providedIn: 'root' })
export class EngineDevice {
  private info: Promise<DeviceInfo> | null = null;

  probe(): Promise<DeviceInfo> {
    this.info ??= import('../../engine/device').then((m) => m.probeDevice());
    return this.info;
  }

  async plan(): Promise<DevicePlan> {
    const [m, info] = await Promise.all([import('../../engine/device'), this.probe()]);
    return m.planFor(info);
  }

  /** The device facts the engine worker needs. */
  async workerPlan(): Promise<WorkerPlan> {
    const p = await this.plan();
    return { backend: p.backend, shaderF16: p.shaderF16, recycleEvery: p.backend === 'webgpu' ? WEBGPU_RECYCLE_WINDOWS : 0 };
  }

  /** Why a model cannot run here (the plan's reason), null when it is offered. */
  async gate(): Promise<ModelGate> {
    const p = await this.plan();
    return (id) => (p.offered.some((m) => m.id === id) ? null : (p.hidden.find((h) => h.id === id)?.reason ?? null));
  }

  /** Seconds of audio in the file (container metadata), or null when the browser cannot tell. */
  async duration(file: Blob): Promise<number | null> {
    try {
      const { probeMedia } = await import('../../engine/audio');
      const r = await probeMedia(file);
      return r.ok ? r.durationSeconds : null;
    } catch {
      return null;
    }
  }

  /** The estimate for transcribing these files one after the other with `modelId`, plus the warnings. */
  async advice(files: readonly Blob[], modelId: string): Promise<DeviceAdvice | null> {
    if (!files.length) return null;
    const durations = await Promise.all(files.map((f) => this.duration(f)));
    const known = durations.filter((d): d is number => d !== null && d > 0);
    if (!known.length) return null;
    const [m, info] = await Promise.all([import('../../engine/device'), this.probe()]);
    const est: TimeEstimate = m.estimateTime(
      known.reduce((a, b) => a + b, 0),
      modelId,
      info,
    );
    if (est.seconds === null) return { text: '', warnings: est.warnings.map((w) => w.message) };
    return { text: `Transcribing takes ${est.text} on this device.`, warnings: est.warnings.map((w) => w.message) };
  }
}
