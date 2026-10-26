import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportFormat, JobOptions } from './models';
import { TRANSPORT } from './transport/token';
import type { ExportFile, JobEvent, LogStreamEvent, PatchBody, UploadState } from './transport/transport';

export type { ExportFile, JobEvent, LogStreamEvent, PatchBody, UploadState } from './transport/transport';

/**
 * What the components call. A thin facade over the build's transport (core/transport): the self-hosted edition talks
 * HTTP + SSE to the Python API (ServerTransport), the static website runs the engine in the visitor's browser
 * (BrowserTransport). Same methods and Observable results either way.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private t = inject(TRANSPORT);

  /** 'server' or 'browser': the few places that must behave differently (PDF, wording) ask this. */
  get kind() {
    return this.t.kind;
  }

  health() {
    return this.t.health();
  }
  /**
   * How many videos this website has transcribed (the counter in the header). The server lets the browser reuse the
   * answer for a short while; `fresh` asks for a new one (used right after a transcription finishes).
   */
  stats(fresh = false) {
    return this.t.stats(fresh);
  }
  /** The visitor's own session: time left, and how many jobs it holds. */
  session() {
    return this.t.session();
  }
  /** Wipes all of this visitor's jobs and media at once. `deleteModels` (browser) also removes the model files. */
  deleteSession(opts?: { deleteModels?: boolean }) {
    return this.t.deleteSession(opts);
  }
  models() {
    return this.t.models();
  }
  languages() {
    return this.t.languages();
  }
  listJobs() {
    return this.t.listJobs();
  }
  getJob(id: string) {
    return this.t.getJob(id);
  }

  /** Starts a transcription: the server receives the raw file; the browser edition keeps it in this browser. */
  createJob(file: File, options: JobOptions): Observable<UploadState> {
    return this.t.createJob(file, options);
  }

  patchJob(id: string, body: PatchBody) {
    return this.t.patchJob(id, body);
  }
  cancel(id: string) {
    return this.t.cancel(id);
  }
  rerun(id: string, changes: Partial<JobOptions>) {
    return this.t.rerun(id, changes);
  }
  delete(id: string) {
    return this.t.delete(id);
  }

  // ------------------------------------------------------------------ logs
  logs(after = 0, limit = 1000) {
    return this.t.logs(after, limit);
  }
  clearLogs() {
    return this.t.clearLogs();
  }
  logsStreamUrl(after: number) {
    return this.t.logsStreamUrl(after);
  }
  logsStream(after: number): Observable<LogStreamEvent> {
    return this.t.logsStream(after);
  }

  exportUrl(id: string, format: ExportFormat, extra: Record<string, number> = {}) {
    return this.t.exportUrl(id, format, extra);
  }
  exportText(id: string, format: ExportFormat) {
    return this.t.exportText(id, format);
  }
  exportBlob(id: string, format: ExportFormat, extra: Record<string, number> = {}): Observable<ExportFile> {
    return this.t.exportBlob(id, format, extra);
  }

  /** Live progress + newly recognised segments for one job. */
  watch(id: string, since = 0): Observable<JobEvent> {
    return this.t.watch(id, since);
  }
}
