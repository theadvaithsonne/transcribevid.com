import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { getLogsToken, logsAuthHeaders } from '../logs-token';
import {
  ExportFormat,
  Health,
  Job,
  JobOptions,
  JobSummary,
  Language,
  LogBatch,
  LogEntry,
  ModelInfo,
  SessionInfo,
  SiteStats,
} from '../models';
import { fileNameFrom } from './file-name';
import type { ExportFile, JobEvent, LogStreamEvent, PatchBody, Transport, UploadState } from './transport';

/**
 * The self-hosted edition: HTTP + Server-Sent Events to the Python API (backend/app/main.py). This is the ApiService
 * body as it was before the in-browser engine, moved here unchanged; `exportBlob` and `logsStream` wrap the same
 * requests the job and logs pages made themselves.
 */
@Injectable({ providedIn: 'root' })
export class ServerTransport implements Transport {
  readonly kind = 'server' as const;
  private http = inject(HttpClient);

  health() {
    return this.http.get<Health>('/api/health');
  }
  /**
   * How many videos this website has transcribed (the counter in the header). The server lets the browser reuse the
   * answer for a short while; `fresh` asks for a new one (used right after a transcription finishes).
   */
  stats(fresh = false) {
    return this.http.get<SiteStats>('/api/stats', fresh ? { headers: { 'Cache-Control': 'no-cache' } } : {});
  }
  /** The visitor's own session: time left, and how many jobs it holds. */
  session() {
    return this.http.get<SessionInfo>('/api/session');
  }
  /** Wipes all of this visitor's jobs and uploaded media at once (204). The server keeps no models per visitor. */
  deleteSession(_opts?: { deleteModels?: boolean }) {
    return this.http.delete<void>('/api/session');
  }
  models() {
    return this.http.get<ModelInfo[]>('/api/models');
  }
  languages() {
    return this.http.get<Language[]>('/api/languages');
  }
  listJobs() {
    return this.http.get<JobSummary[]>('/api/jobs');
  }
  getJob(id: string) {
    return this.http.get<Job>(`/api/jobs/${id}`);
  }

  /** Sends the raw file as the request body (streams straight to disk on the server). */
  createJob(file: File, options: JobOptions): Observable<UploadState> {
    return this.http
      .post<JobSummary>('/api/jobs', file, {
        params: {
          filename: file.name,
          options: JSON.stringify(options),
        },
        headers: { 'Content-Type': 'application/octet-stream' },
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter((e: HttpEvent<JobSummary>) =>
          [HttpEventType.UploadProgress, HttpEventType.Response].includes(e.type),
        ),
        map((e): UploadState => {
          if (e.type === HttpEventType.Response) return { progress: 1, job: e.body! };
          const p = e as { loaded: number; total?: number };
          return { progress: p.total ? p.loaded / p.total : 0, loaded: p.loaded, total: p.total };
        }),
      );
  }

  patchJob(id: string, body: PatchBody) {
    return this.http.patch<Job>(`/api/jobs/${id}`, body);
  }
  cancel(id: string) {
    return this.http.post<JobSummary>(`/api/jobs/${id}/cancel`, {});
  }
  rerun(id: string, changes: Partial<JobOptions>) {
    return this.http.post<JobSummary>(`/api/jobs/${id}/rerun`, changes);
  }
  delete(id: string) {
    return this.http.delete<void>(`/api/jobs/${id}`);
  }

  // ------------------------------------------------------------------ logs
  // The admin token (when the server asks for one) goes in an Authorization header for XHR, and in the query
  // string for EventSource, which cannot send headers.
  logs(after = 0, limit = 1000) {
    return this.http.get<LogBatch>('/api/logs', { params: { after, limit }, headers: logsAuthHeaders() });
  }
  clearLogs() {
    return this.http.delete<void>('/api/logs', { headers: logsAuthHeaders() });
  }
  logsStreamUrl(after: number) {
    const token = getLogsToken();
    return `/api/logs/stream?after=${after}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
  }
  /** The server's live log stream. Errors on the first drop: the logs page reconnects itself (with a fresh `after`). */
  logsStream(after: number): Observable<LogStreamEvent> {
    return new Observable((sub) => {
      const es = new EventSource(this.logsStreamUrl(after));
      es.onopen = () => sub.next({ type: 'open' });
      es.addEventListener('log', (ev) => {
        try {
          sub.next({ type: 'log', entry: JSON.parse((ev as MessageEvent).data) as LogEntry });
        } catch {
          /* ignore malformed event */
        }
      });
      es.onerror = () => {
        es.close();
        sub.error(new Error('log stream lost'));
      };
      return () => es.close();
    });
  }

  exportUrl(id: string, format: ExportFormat, extra: Record<string, number> = {}) {
    const q = new URLSearchParams({ format, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) });
    return `/api/jobs/${id}/export?${q}`;
  }
  exportText(id: string, format: ExportFormat) {
    return this.http.get(this.exportUrl(id, format), { responseType: 'text' });
  }
  /** The file and the server's name for it (Content-Disposition). An error keeps its Blob body (the page reads it). */
  exportBlob(id: string, format: ExportFormat, extra: Record<string, number> = {}): Observable<ExportFile> {
    return this.http
      .get(this.exportUrl(id, format, extra), { observe: 'response', responseType: 'blob' })
      .pipe(
        map((res: HttpResponse<Blob>) => ({
          blob: res.body ?? new Blob([]),
          filename: fileNameFrom(res.headers.get('Content-Disposition')),
        })),
      );
  }

  /** Live progress + newly recognised segments for one job (Server-Sent Events). */
  watch(id: string, since = 0): Observable<JobEvent> {
    return new Observable((sub) => {
      const es = new EventSource(`/api/jobs/${id}/events?since=${since}`);
      es.addEventListener('job', (e) => sub.next({ type: 'job', data: JSON.parse((e as MessageEvent).data) }));
      es.addEventListener('segments', (e) =>
        sub.next({ type: 'segments', data: JSON.parse((e as MessageEvent).data) }),
      );
      es.addEventListener('end', () => {
        es.close();
        sub.complete();
      });
      es.onerror = () => {
        // the browser auto-reconnects while readyState is CONNECTING; give up if the server is gone for good
        if (es.readyState === EventSource.CLOSED) sub.error(new Error('connection lost'));
      };
      return () => es.close();
    });
  }
}
