import { Observable } from 'rxjs';
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
  SegmentEdit,
  SessionInfo,
  SiteStats,
} from '../models';

export interface UploadState {
  /** 0..1 while the file is being sent (the browser engine sends nothing: it reports 1 at once) */
  progress: number;
  loaded?: number;
  total?: number;
  /** set once the job exists */
  job?: JobSummary;
}

/** One message of a job's live stream: the same `{type, data}` pairs as the server's SSE events. */
export interface JobEvent {
  type: 'job' | 'segments';
  data: unknown;
}

/** A finished export: the file and the name the server (or the browser engine) gives it, null when it gave none. */
export interface ExportFile {
  blob: Blob;
  filename: string | null;
}

/** One message of the live log stream: the stream is open (connection is live), or one new log line. */
export type LogStreamEvent = { type: 'open' } | { type: 'log'; entry: LogEntry };

export interface PatchBody {
  title?: string;
  segments?: SegmentEdit[];
  output_script?: JobOptions['output_script'];
  romanizer?: JobOptions['romanizer'];
}

/**
 * Everything the app asks of "the backend": the public method list of the ApiService (same names, same Observable
 * results), plus the few things the in-browser edition needs to say differently (`kind`, `exportBlob`, `logsStream`).
 * ServerTransport talks HTTP + SSE to the Python API; BrowserTransport runs the engine in this tab.
 */
export interface Transport {
  /** 'server' = the self-hosted Python API; 'browser' = the in-browser engine (no upload, PDF through print) */
  readonly kind: 'server' | 'browser';

  health(): Observable<Health>;
  stats(fresh?: boolean): Observable<SiteStats>;
  session(): Observable<SessionInfo>;
  /** "Delete my data now". `deleteModels` (browser only) also removes the downloaded model files. */
  deleteSession(opts?: { deleteModels?: boolean }): Observable<void>;
  models(): Observable<ModelInfo[]>;
  languages(): Observable<Language[]>;
  listJobs(): Observable<JobSummary[]>;
  getJob(id: string): Observable<Job>;
  createJob(file: File, options: JobOptions): Observable<UploadState>;
  patchJob(id: string, body: PatchBody): Observable<Job>;
  cancel(id: string): Observable<JobSummary>;
  rerun(id: string, changes: Partial<JobOptions>): Observable<JobSummary>;
  delete(id: string): Observable<void>;

  logs(after?: number, limit?: number): Observable<LogBatch>;
  clearLogs(): Observable<void>;
  /** The URL of the server's live log stream (EventSource); '' in the browser edition (see logsStream). */
  logsStreamUrl(after: number): string;
  /** The live log stream after `after`: an 'open' event once connected, then one event per new line. */
  logsStream(after: number): Observable<LogStreamEvent>;

  /** The server's export URL (a plain link); '' in the browser edition, which has no URLs (use exportBlob). */
  exportUrl(id: string, format: ExportFormat, extra?: Record<string, number>): string;
  /** One export as text (Copy uses the txt format). */
  exportText(id: string, format: ExportFormat): Observable<string>;
  /**
   * One export as a file. The browser edition renders it locally (byte-identical to the server); 'pdf' there is
   * made by the browser's print dialog instead (see print-view.ts), so it fails with a 422.
   */
  exportBlob(id: string, format: ExportFormat, extra?: Record<string, number>): Observable<ExportFile>;

  /** Live progress + newly recognised segments for one job; completes when the job reached a final state. */
  watch(id: string, since?: number): Observable<JobEvent>;

  /**
   * In-browser edition only: the player source of a finished job. For a file the browser cannot play it is the
   * server's preview.mp3 counterpart, a WAV object URL of the decoded 16 kHz mono audio built on demand
   * (`audioOnly`). Emits null when there is nothing to play. The server edition has no such call (its media_url
   * already points at the preview).
   */
  mediaPreview?(id: string): Observable<MediaPreview | null>;
}

export interface MediaPreview {
  url: string;
  /** a decoded-audio WAV: play it in an audio player even for a video file */
  audioOnly: boolean;
}

/**
 * The error the browser edition reports, shaped like an HttpErrorResponse (`status`, `error.detail`), so errorDetail,
 * isBusy and isTransient and every component's error handling work unchanged.
 */
export class TransportError extends Error {
  readonly error: { detail: string };
  constructor(
    readonly status: number,
    detail: string,
    /** what went wrong underneath (the Logs page shows it, the page never does) */
    readonly technical?: string,
  ) {
    super(detail);
    this.name = 'TransportError';
    this.error = { detail };
  }
}
