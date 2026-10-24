export type JobStatus = 'queued' | 'running' | 'done' | 'error' | 'cancelled';
export type JobPhase = 'extracting' | 'loading_model' | 'transcribing' | null;

export interface JobOptions {
  engine: 'whisper' | 'qwen';
  romanizer: 'auto' | 'indicxlit' | 'basic';
  model: string;
  language: string | null;
  task: 'transcribe' | 'translate';
  output_script: 'hinglish' | 'original';
  prompt: string;
  beam_size: number;
  vad: boolean;
  enhance_audio: boolean;
  word_timestamps: boolean;
  condition_on_previous: boolean;
}

export interface Word {
  start: number;
  end: number;
  word: string;
  original_word?: string;
  probability: number;
}

export interface Segment {
  id: number;
  start: number;
  end: number;
  text: string;
  original_text?: string;
  romanizer?: string;
  conversion_warning?: string;
  timing?: 'chunk';
  words: Word[] | null;
  confidence: number | null;
  no_speech_prob?: number;
  edited?: boolean;
}

export interface Keyword {
  word: string;
  count: number;
}

export interface Stats {
  word_count: number;
  segment_count: number;
  speech_seconds: number;
  words_per_minute: number | null;
  avg_confidence: number | null;
  low_confidence_segments: number;
  keywords: Keyword[];
}

export interface JobSummary {
  cancel_requested?: boolean;
  id: string;
  title: string;
  filename: string;
  status: JobStatus;
  phase: JobPhase;
  progress: number;
  eta_seconds: number | null;
  error: string | null;
  created_at: number;
  started_at: number | null;
  finished_at: number | null;
  language: string | null;
  duration: number | null;
  size_bytes: number;
  media_kind: 'audio' | 'video';
  media_url?: string | null;
  options: JobOptions;
  segment_count: number;
}

export interface Job extends JobSummary {
  segments: Segment[];
  stats: Stats | null;
  language_probability: number | null;
}

export interface ModelInfo {
  engine?: 'whisper' | 'qwen';
  id: string;
  label: string;
  size_mb: number;
  speed: number;
  accuracy: number;
  note: string;
  downloaded: boolean;
}

export interface Language {
  code: string;
  name: string;
}

/** Who runs the site (from /api/health). Every field may be missing in an older response: see SiteService. */
export interface Brand {
  name: string;
  domain: string;
  url: string;
  contact_email: string | null;
}

export interface Health {
  status: string;
  version: string;
  device: 'cpu' | 'cuda';
  compute_type: string;
  session_id?: string;
  started_at?: number;
  persistent?: boolean;
  /** largest upload the server accepts, in MB (VT_MAX_UPLOAD_MB) */
  max_upload_mb?: number;
  /** longest recording the server accepts, in minutes; 0 = unlimited */
  max_duration_min?: number;
  /** a visitor's session (and its files) is deleted after this many idle minutes */
  session_idle_minutes?: number;
  /** true when this is the shared public website (files are uploaded to a server), false for a local install */
  public?: boolean;
  brand?: Partial<Brand> | null;
  /** the /logs page and API exist (an admin feature) */
  logs_enabled?: boolean;
  logs_require_token?: boolean;
  /** when a list, only these models may be chosen; null / missing = all */
  allowed_models?: string[] | null;
}

/**
 * GET /api/stats: how many videos this website has transcribed. `counting` is false on a local or dev copy (nothing
 * is counted there and `transcribed` is 0), true on the public site.
 */
export interface SiteStats {
  transcribed: number;
  counting: boolean;
}

/** GET /api/session: the visitor's own session. */
export interface SessionInfo {
  session_id: string;
  created_at: number;
  last_seen: number;
  expires_in_seconds: number;
  job_count: number;
}

/** The server can also emit CRITICAL; the UI treats it as ERROR. */
export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

export interface LogEntry {
  seq: number;
  ts: number;
  level: LogLevel | string;
  logger: string;
  message: string;
}

export interface LogBatch {
  entries: LogEntry[];
  last_seq: number;
}

export interface SegmentEdit {
  id: number;
  text: string;
  start?: number;
  end?: number;
  deleted?: boolean;
}

export type ExportFormat = 'txt' | 'plain' | 'srt' | 'vtt' | 'md' | 'json' | 'pdf';

export const DEFAULT_OPTIONS: JobOptions = {
  engine: 'whisper',
  romanizer: 'auto',
  model: 'small',
  language: null,
  task: 'transcribe',
  output_script: 'hinglish',
  prompt: '',
  beam_size: 5,
  vad: true,
  enhance_audio: true,
  word_timestamps: true,
  condition_on_previous: false,
};
