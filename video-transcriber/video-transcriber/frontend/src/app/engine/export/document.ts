/**
 * What the transcript documents show: the print view (core/transport/print-view.ts), the Word file (docx.ts) and the
 * direct PDF (pdf.ts). The title, one line of facts, then the paragraphs (grouped like the plain text and the server's
 * PDF, `paragraphs()`), each with the time it starts. Built in one place so the three never disagree.
 */
import { LANGUAGES } from '../jobs/reference-data';
import { paragraphs, type ExportJob } from './formats';
import { fmtTs } from './timestamps';

/** The job fields a document reads (a stored Job satisfies it). */
export interface DocumentJob extends Pick<ExportJob, 'title' | 'language' | 'duration' | 'options' | 'segments'> {
  filename?: string | null;
  stats?: { word_count?: number | null } | null;
  /** when the transcript was made, Unix seconds */
  created_at?: number | null;
}

export interface DocumentParagraph {
  /** the start time, `[mm:ss]` (`[h:mm:ss]` past an hour) */
  stamp: string;
  text: string;
  /** written right to left (Arabic, Hebrew, ...) */
  rtl: boolean;
}

export interface TranscriptDocument {
  title: string;
  titleRtl: boolean;
  /** e.g. ['English', '12:34', '1,234 words', '27 Oct 2026'], shown joined by FACTS_SEPARATOR */
  facts: string[];
  /** the language the text is written in (primary subtag, lower case: 'en' after a translation), null when unknown */
  lang: string | null;
  paragraphs: DocumentParagraph[];
}

/** Words in a document's language: the page passes its own translate, the Word file and the direct PDF stay English. */
export type DocText = (key: string, params?: Record<string, string | number>) => string;
const plain: DocText = (key, params) =>
  params ? key.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m)) : key;

export const FACTS_SEPARATOR = ' · ';
/** what a document says when no speech was found */
export const NO_SPEECH = 'No speech was transcribed.';

/** pdf.py `_RTL_LANGUAGES` */
export const RTL_LANGUAGES: ReadonlySet<string> = new Set('ar he fa ur yi ps sd ug dv ckb'.split(' '));

/** pdf.py `_RTL`: Hebrew, Arabic, Syriac, Thaana, NKo, ... and the Arabic presentation forms */
const RTL_CHAR = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
const LETTER = /\p{L}/u;

/** C0 / C1 controls (but tab, line feed and carriage return, which become spaces), noncharacters, lone surrogates */
const CONTROLS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f￾￿]|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g;

const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

/**
 * One line of text as the documents print it: NFC (a letter and its accent as one character, which the PDF fonts
 * need), no control characters (XML forbids most of them), every run of whitespace (line breaks, U+2028, no-break
 * spaces) one space.
 */
export function cleanText(text: string): string {
  return text.normalize('NFC').replace(CONTROLS, '').replace(/\s+/g, ' ').trim();
}

/**
 * pdf.py `_is_rtl`: right to left when the text has RTL letters and either the transcript's language is an RTL one (a
 * Latin brand name inside an Arabic sentence must not flip it) or those letters are the majority.
 */
export function isRtl(text: string, rtlLanguage = false): boolean {
  if (!RTL_CHAR.test(text)) return false;
  if (rtlLanguage) return true;
  let n = 0;
  for (const c of text) if (LETTER.test(c)) n += RTL_CHAR.test(c) ? 1 : -1;
  return n > 0;
}

/** The primary language subtag ('pt-BR' -> 'pt'), lower case; '' when there is none. */
const primary = (language: string | null | undefined) => (language ?? '').trim().toLowerCase().split(/[-_]/)[0];

/** The facts line: language, length, words, a translation, the date (each only when known). */
function facts(job: DocumentJob, t: DocText): string[] {
  const out: string[] = [];
  const code = primary(job.language);
  if (code) out.push(LANGUAGES[code] ?? cleanText(job.language ?? '').toUpperCase());
  if (job.duration) out.push(fmtTs(job.duration, 'short'));
  const words = job.stats?.word_count;
  if (words) out.push(words === 1 ? t('1 word') : t('{n} words', { n: words.toLocaleString('en-US') }));
  if (translated(job)) out.push(t('Translated to English'));
  if (job.created_at && job.created_at > 0) {
    const d = new Date(job.created_at * 1000);
    if (!Number.isNaN(d.getTime())) out.push(`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`);
  }
  return out;
}

const translated = (job: DocumentJob) => (job.options as { task?: unknown } | null | undefined)?.task === 'translate';

/** The document of one transcript. */
export function transcriptDocument(job: DocumentJob, t: DocText = plain): TranscriptDocument {
  const lang = translated(job) ? 'en' : primary(job.language) || null;
  const rtlLanguage = !!lang && RTL_LANGUAGES.has(lang);
  const title = cleanText(job.title ?? '') || cleanText(job.filename ?? '') || 'Transcript';
  const paras: DocumentParagraph[] = [];
  for (const p of paragraphs(job.segments)) {
    const text = cleanText(p.map((s) => s.text).join(' '));
    if (text) paras.push({ stamp: `[${fmtTs(p[0].start, 'short')}]`, text, rtl: isRtl(text, rtlLanguage) });
  }
  return { title, titleRtl: isRtl(title, rtlLanguage), facts: facts(job, t), lang, paragraphs: paras };
}
