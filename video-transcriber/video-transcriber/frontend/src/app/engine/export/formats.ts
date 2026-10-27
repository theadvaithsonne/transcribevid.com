/**
 * Transcript exporters: backend/app/formats.py:15-23, 118-192 (SRT, WebVTT, TXT, plain paragraphs, Markdown, JSON,
 * `render`) and the download name of main.py:599-614. Pure functions of the stored (edited) job; the output is
 * byte-identical to the server's for the same data (UTF-8, no BOM).
 *
 * render() refuses 'pdf': the PDF and the Word file are binary documents, written by pdf.ts and docx.ts (or, for
 * text the standard PDF fonts cannot draw, by the browser's print dialog, core/transport/print-view.ts). See README.md.
 */
import type { JobOptions, Stats } from '../../core/models';
import { pyJsonDumps, pyLen, pyStr } from '../post/py';
import { buildCues, type CueOptions, type CueSegment, SENTENCE_END } from './cues';
import { fmtTs } from './timestamps';

/** formats.py:15-23 `EXPORT_FORMATS`: format -> [MIME type, file extension] */
export const EXPORT_FORMATS = {
  txt: ['text/plain; charset=utf-8', 'txt'],
  plain: ['text/plain; charset=utf-8', 'txt'],
  srt: ['application/x-subrip; charset=utf-8', 'srt'],
  vtt: ['text/vtt; charset=utf-8', 'vtt'],
  json: ['application/json; charset=utf-8', 'json'],
  md: ['text/markdown; charset=utf-8', 'md'],
  pdf: ['application/pdf', 'pdf'],
} as const satisfies Record<string, readonly [string, string]>;

export type ExportFormatName = keyof typeof EXPORT_FORMATS;

/** formats.py:138 `paragraphs(pause=1.6, max_chars=600)` */
export const PARAGRAPH_PAUSE = 1.6;
export const PARAGRAPH_MAX_CHARS = 600;

export const PDF_EXPORT_NOTE =
  'PDF is made by the browser: open the print view and choose "Save as PDF" (engine/export/README.md).';

export interface ExportSegment extends CueSegment {
  id?: number;
  confidence?: number | null;
}

/** The job fields the exporters read (a stored Job satisfies it). */
export interface ExportJob {
  title: string;
  filename?: string | null;
  language?: string | null;
  language_probability?: number | null;
  duration?: number | null;
  options?: Partial<JobOptions> | Record<string, unknown> | null;
  stats?: Stats | Record<string, never> | null;
  segments: readonly ExportSegment[];
}

/** formats.py:118-121 `to_srt`: numbered blocks separated by a blank line; '' without cues. */
export function toSrt(segments: readonly CueSegment[], options: CueOptions = {}): string {
  return buildCues(segments, options)
    .map((c, i) => `${i + 1}\n${fmtTs(c.start, 'srt')} --> ${fmtTs(c.end, 'srt')}\n${c.text}\n`)
    .join('\n');
}

/** formats.py:124-128 `to_vtt` */
export function toVtt(segments: readonly CueSegment[], options: CueOptions = {}): string {
  const body = buildCues(segments, options)
    .map((c) => `${fmtTs(c.start, 'vtt')} --> ${fmtTs(c.end, 'vtt')}\n${c.text}\n`)
    .join('\n');
  return `WEBVTT\n\n${body}`;
}

/** formats.py:133-135 `to_txt`: one line per segment, `[mm:ss] text`, no trailing newline. */
export function toTxt(segments: readonly ExportSegment[], timestamps = true): string {
  return segments.map((s) => (timestamps ? `[${fmtTs(s.start)}] ${s.text}` : s.text)).join('\n');
}

/**
 * formats.py:138-152 `paragraphs`: a new paragraph after a pause of more than 1.6 s, or at a sentence end once the
 * paragraph has 600 characters. The same grouping drives Markdown and the PDF.
 */
export function paragraphs<S extends ExportSegment>(
  segments: readonly S[],
  pause = PARAGRAPH_PAUSE,
  maxChars = PARAGRAPH_MAX_CHARS,
): S[][] {
  const paras: S[][] = [];
  let cur: S[] = [];
  let size = 0;
  let lastEnd: number | null = null;
  for (const s of segments) {
    if (
      cur.length &&
      ((lastEnd !== null && s.start - lastEnd > pause) ||
        (size >= maxChars && SENTENCE_END.test(cur[cur.length - 1].text)))
    ) {
      paras.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(s);
    size += pyLen(s.text);
    lastEnd = s.end;
  }
  if (cur.length) paras.push(cur);
  return paras;
}

/** formats.py:155-156 `to_plain` */
export function toPlain(segments: readonly ExportSegment[]): string {
  return paragraphs(segments)
    .map((p) => p.map((s) => s.text).join(' '))
    .join('\n\n');
}

/** formats.py:159-167 `to_markdown` (the language is the code, not the display name). */
export function toMarkdown(job: ExportJob): string {
  const lines = [`# ${pyStr(job.title)}`, ''];
  const options = (job.options ?? {}) as Record<string, unknown>;
  const model = options['model'] === undefined ? '?' : pyStr(options['model']);
  const meta = [
    `Language: ${job.language || 'unknown'}`,
    `Duration: ${fmtTs(job.duration || 0)}`,
    `Model: ${model}`,
  ];
  lines.push(`*${meta.join(' · ')}*`, '');
  for (const p of paragraphs(job.segments)) {
    lines.push(`**[${fmtTs(p[0].start)}]** ${p.map((s) => s.text).join(' ')}`, '');
  }
  return lines.join('\n');
}

/**
 * formats.py:184-188 the JSON export: title, filename, language, language_probability, duration, options, stats,
 * segments (in this order, missing -> null), json.dumps(ensure_ascii=False, indent=2) including Python's float
 * printing (`0.0`, not `0`).
 */
export function toJson(job: ExportJob): string {
  return pyJsonDumps({
    title: job.title ?? null,
    filename: job.filename ?? null,
    language: job.language ?? null,
    language_probability: job.language_probability ?? null,
    duration: job.duration ?? null,
    options: job.options ?? null,
    stats: job.stats ?? null,
    segments: job.segments ?? null,
  });
}

export interface Rendered {
  body: string;
  mime: string;
  ext: string;
}

/**
 * formats.py:170-192 `render`: an unknown format falls back to txt. Cue options apply to srt / vtt only (the API
 * passes max_chars / max_lines for those, main.py:602). 'pdf' throws: see PDF_EXPORT_NOTE.
 */
export function render(job: ExportJob, format: string, options: CueOptions = {}): Rendered {
  const segs = job.segments;
  let fmt: ExportFormatName = format as ExportFormatName;
  let body: string;
  if (fmt === 'srt') body = toSrt(segs, options);
  else if (fmt === 'vtt') body = toVtt(segs, options);
  else if (fmt === 'plain') body = toPlain(segs);
  else if (fmt === 'md') body = toMarkdown(job);
  else if (fmt === 'pdf') throw new Error(PDF_EXPORT_NOTE);
  else if (fmt === 'json') body = toJson(job);
  else {
    fmt = 'txt';
    body = toTxt(segs);
  }
  const [mime, ext] = EXPORT_FORMATS[fmt];
  return { body, mime, ext };
}

/** main.py:610 the download name `${title}.${ext}` (ext as render() picks it: unknown formats are txt). */
export function exportFilename(title: string, format: string): string {
  const entry = EXPORT_FORMATS[format as ExportFormatName];
  return `${title}.${entry ? entry[1] : 'txt'}`;
}

/**
 * urllib.parse.quote(name) (safe '/'), as main.py puts it into `Content-Disposition: attachment;
 * filename*=UTF-8''...`. Browsers given `<a download>` replace the characters a file system forbids themselves.
 */
export function pyQuote(text: string): string {
  return encodeURIComponent(text)
    .replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%2F/g, '/');
}
