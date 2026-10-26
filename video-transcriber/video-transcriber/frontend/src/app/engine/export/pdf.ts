/**
 * The direct PDF export: the transcript document (document.ts) laid out like the server's PDF (backend/app/pdf.py:
 * A4, the title, the facts line, a rule, then "[mm:ss] text" paragraphs; the title at the top of every page after the
 * first, the site and "Page X of Y" at the bottom), written as PDF 1.4 by hand.
 *
 * It uses the standard Helvetica and Helvetica-Bold fonts, which every PDF viewer has, so nothing is embedded and the
 * file stays small. Those fonts only cover WinAnsi (Windows-1252: English, Hinglish, most Western European
 * languages). Hindi in Devanagari, Chinese, Arabic, Polish, ... would need an embedded font and text shaping, so for
 * them `canWritePdf` is false and the caller keeps the print view (core/transport/print-view.ts, "Save as PDF").
 * Line breaking uses the fonts' AFM widths; the content streams are left uncompressed (plain ASCII), so the file is
 * built synchronously and its byte offsets are simply string lengths.
 */
import { cleanText, FACTS_SEPARATOR, NO_SPEECH, transcriptDocument, type DocumentJob, type TranscriptDocument } from './document';

export const PDF_MIME = 'application/pdf';

export interface PdfOptions {
  /** the left half of each page footer, e.g. "TranscribeVid - transcribevid.com" (left out when empty) */
  footer?: string;
  /** /Creator and /Producer in the document properties */
  creator?: string;
  /** /CreationDate; tests pass a fixed one */
  now?: Date;
}

// ------------------------------------------------------------------------------------------- encoding
/** Windows-1252 bytes 0x80..0x9F (PDF 32000-1 Annex D WinAnsiEncoding); 0xA0..0xFF are Latin-1 itself. */
const CP1252_HIGH: Readonly<Record<number, number>> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88,
  0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93,
  0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
  0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
};

/** Characters drawn as one that looks the same (hyphens and the minus sign, which WinAnsi lacks). */
const LOOKALIKE: Readonly<Record<string, string>> = { '‐': '-', '‑': '-', '−': '-' };

/**
 * Text as the PDF prints it: cleanText, invisible format characters dropped (zero-width spaces and joiners, direction
 * marks, the soft hyphen: none of them is drawn), lookalikes swapped.
 */
function pdfText(text: string): string {
  return cleanText(text.replace(/\p{Cf}/gu, '').replace(/[‐‑−]/g, (c) => LOOKALIKE[c]));
}

/** WinAnsi bytes of already prepared text, or null when a character has none. */
function encode(text: string): number[] | null {
  const out: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if ((c >= 0x20 && c < 0x7f) || (c >= 0xa0 && c <= 0xff)) out.push(c);
    else if (CP1252_HIGH[c] !== undefined) out.push(CP1252_HIGH[c]);
    else return null;
  }
  return out;
}

/** True when the standard PDF fonts can draw all of `text` (else the caller uses the print view). */
export function canWritePdf(text: string): boolean {
  return encode(pdfText(text)) !== null;
}

/** Every string the PDF of this document would print. */
const documentStrings = (doc: TranscriptDocument): string[] => [
  doc.title,
  doc.facts.join(FACTS_SEPARATOR),
  ...doc.paragraphs.map((p) => p.text),
];

/** True when the transcript (title, facts, text) can be written as a direct PDF. */
export function canWriteJobPdf(job: DocumentJob): boolean {
  return documentStrings(transcriptDocument(job)).every(canWritePdf);
}

// ------------------------------------------------------------------------------------------- font metrics
/**
 * Advance widths (1/1000 em) of WinAnsi bytes 0x20..0xFF, from the Adobe AFM files of the 14 standard fonts (the same
 * table fpdf2 uses for its core fonts). Unused bytes (0x7F, 0x81, 0x8D, 0x8F, 0x90, 0x9D) are never written.
 */
const HELVETICA = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 350,
  556, 350, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 350, 611, 350,
  350, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 350, 500, 667,
  278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333,
  400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611,
  667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
  722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
  556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500,
];
const HELVETICA_BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
  975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
  333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
  611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 350,
  556, 350, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 350, 611, 350,
  350, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 350, 500, 667,
  278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333,
  400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611,
  722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
  722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
  556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278,
  611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556,
];

type Face = 'regular' | 'bold';
const FONT_RESOURCE: Record<Face, string> = { regular: 'F1', bold: 'F2' };

/** The width in points of WinAnsi bytes set in `face` at `size` points. */
export function textWidth(bytes: readonly number[], face: Face, size: number): number {
  const table = face === 'bold' ? HELVETICA_BOLD : HELVETICA;
  let units = 0;
  for (const b of bytes) units += table[b - 0x20] ?? 0;
  return (units * size) / 1000;
}

// ------------------------------------------------------------------------------------------- page design (points)
// pdf.py's page design, so both editions' PDFs look alike
export const PAGE_W = 595.28;
export const PAGE_H = 841.89;
const MARGIN = 62;
const TEXT_W = PAGE_W - 2 * MARGIN;
/** the last usable y of the body (the footer lives below it) */
const BOTTOM = PAGE_H - 66;
const TITLE = 22;
const TITLE_LEAD = 27;
const TITLE_LINES = 3;
const BODY = 10.5;
export const LEAD = 16.5;
const PARA_GAP = 9;
const STAMP = 9;
const STAMP_GAP = 6;
type Rgb = readonly [number, number, number];
const INK: Rgb = [31, 35, 40];
const MUTED: Rgb = [107, 114, 128];
const ACCENT: Rgb = [37, 99, 235];
const RULE: Rgb = [222, 226, 231];
const EPS = 0.01;
const ELLIPSIS = 0x85;
const SPACE = 0x20;

// ------------------------------------------------------------------------------------------- line breaking
/** The longest start of `word` that fits `room` (at least one character, so a line always makes progress). */
function cut(word: number[], room: number, face: Face, size: number): number {
  let w = 0;
  for (let i = 0; i < word.length; i++) {
    w += textWidth([word[i]], face, size);
    if (w > room + EPS) return Math.max(i, 1);
  }
  return word.length;
}

/**
 * pdf.py `_wrap`: greedy line breaking of single-spaced text. The first line has `first` points of room, the others
 * `width`. A word wider than a whole line is cut instead of overflowing.
 */
export function wrapBytes(bytes: number[], first: number, width: number, face: Face, size: number): number[][] {
  const space = textWidth([SPACE], face, size);
  const lines: number[][] = [];
  let cur: number[] = [];
  let curW = 0;
  let room = first;
  const words: number[][] = [];
  let word: number[] = [];
  for (const b of bytes) {
    if (b === SPACE) {
      if (word.length) words.push(word);
      word = [];
    } else word.push(b);
  }
  if (word.length) words.push(word);

  for (let w of words) {
    let ww = textWidth(w, face, size);
    if (cur.length && curW + space + ww > room + EPS) {
      lines.push(cur);
      cur = [];
      curW = 0;
      room = width;
    }
    // only a word on a line of its own gets here (a line with words was ended just above)
    while (ww > room + EPS) {
      const n = cut(w, room, face, size);
      lines.push(w.slice(0, n));
      w = w.slice(n);
      room = width;
      ww = textWidth(w, face, size);
    }
    if (w.length) {
      if (cur.length) {
        cur.push(SPACE);
        curW += space;
      }
      cur.push(...w);
      curW += ww;
    }
  }
  if (cur.length) lines.push(cur);
  return lines;
}

/** `bytes` cut with an ellipsis so that they fit `width`. */
function shorten(bytes: number[], width: number, face: Face, size: number): number[] {
  if (textWidth(bytes, face, size) <= width + EPS) return bytes;
  const room = width - textWidth([ELLIPSIS], face, size);
  let n = bytes.length;
  while (n > 0 && textWidth(bytes.slice(0, n), face, size) > room + EPS) n--;
  while (n > 0 && bytes[n - 1] === SPACE) n--;
  return [...bytes.slice(0, n), ELLIPSIS];
}

/**
 * pdf.py `_take`: how many of a paragraph's `left` lines go on this page when `fit` lines are free (0 = start a new
 * page). A paragraph is only split with at least two lines on each side, so no single line is stranded.
 */
function take(left: number, fit: number, fresh: boolean): number {
  if (left <= fit) return left;
  const n = Math.min(fit, left - 2);
  return n >= 2 ? n : fresh ? Math.max(fit, 1) : 0;
}

// ------------------------------------------------------------------------------------------- drawing
interface TextOp {
  bytes: number[];
  face: Face;
  size: number;
  color: Rgb;
  x: number;
  /** top of the line box, measured from the top of the page */
  y: number;
  /** height of the line box (the text sits on fpdf2's baseline: middle + 0.3 em) */
  h: number;
}

type Op = TextOp | { rule: number; width: number };

const num = (n: number) => {
  const s = n.toFixed(2);
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
};
const rgb = (c: Rgb) => c.map((v) => num(v / 255)).join(' ');

/** A PDF literal string of WinAnsi bytes: ( ) \ escaped, everything outside printable ASCII as an octal escape. */
export function pdfString(bytes: readonly number[]): string {
  let s = '(';
  for (const b of bytes) {
    if (b === 0x28 || b === 0x29 || b === 0x5c) s += `\\${String.fromCharCode(b)}`;
    else if (b < 0x20 || b > 0x7e) s += `\\${b.toString(8).padStart(3, '0')}`;
    else s += String.fromCharCode(b);
  }
  return `${s})`;
}

/** A Unicode string for the document properties: UTF-16BE with a byte order mark, as hex (any script works there). */
function pdfUnicode(text: string): string {
  let hex = 'FEFF';
  for (let i = 0; i < text.length; i++) hex += text.charCodeAt(i).toString(16).padStart(4, '0').toUpperCase();
  return `<${hex}>`;
}

function contentStream(ops: readonly Op[]): string {
  const out: string[] = [];
  for (const op of ops) {
    if ('rule' in op) {
      const y = num(PAGE_H - op.rule);
      out.push(`${rgb(RULE)} RG ${num(op.width)} w ${num(MARGIN)} ${y} m ${num(MARGIN + TEXT_W)} ${y} l S`);
    } else {
      const baseline = PAGE_H - (op.y + op.h / 2 + 0.3 * op.size);
      out.push(
        `BT /${FONT_RESOURCE[op.face]} ${num(op.size)} Tf ${rgb(op.color)} rg ${num(op.x)} ${num(baseline)} Td ${pdfString(op.bytes)} Tj ET`,
      );
    }
  }
  return out.join('\n');
}

/** D:YYYYMMDDHHmmSSZ (UTC) */
function pdfDate(d: Date): string {
  const iso = (Number.isNaN(d.getTime()) ? new Date(0) : d).toISOString();
  return `D:${iso.slice(0, 19).replace(/[-T:]/g, '')}Z`;
}

// ------------------------------------------------------------------------------------------- layout
/** Every page's drawing, the front matter and paragraphs laid out first so the page count is known. */
function layout(doc: TranscriptDocument, footer: number[] | null): Op[][] {
  const enc = (s: string) => encode(pdfText(s)) ?? [];
  const pages: Op[][] = [[]];
  let page = pages[0];

  // title (up to three lines, the last one shortened), facts, rule
  let y = MARGIN;
  let titleLines = wrapBytes(enc(doc.title), TEXT_W, TEXT_W, 'bold', TITLE);
  if (titleLines.length > TITLE_LINES) {
    const rest = titleLines.slice(TITLE_LINES - 1).flatMap((l, i) => (i ? [SPACE, ...l] : l));
    titleLines = [...titleLines.slice(0, TITLE_LINES - 1), shorten(rest, TEXT_W, 'bold', TITLE)];
  }
  for (const line of titleLines) {
    page.push({ bytes: line, face: 'bold', size: TITLE, color: INK, x: MARGIN, y, h: TITLE_LEAD });
    y += TITLE_LEAD;
  }
  const facts = enc(doc.facts.join(FACTS_SEPARATOR));
  if (facts.length) {
    page.push({ bytes: shorten(facts, TEXT_W, 'regular', 9.5), face: 'regular', size: 9.5, color: MUTED, x: MARGIN, y: y + 3, h: 14 });
    y += 17;
  }
  y += 18;
  page.push({ rule: y, width: 0.6 });
  y += 20;

  if (!doc.paragraphs.length) {
    page.push({ bytes: enc(NO_SPEECH), face: 'regular', size: BODY, color: MUTED, x: MARGIN, y, h: LEAD });
  }
  // "[mm:ss] text": the time in small bold blue starts the first line, which is that much shorter
  for (const p of doc.paragraphs) {
    const stamp = enc(p.stamp);
    const stampW = textWidth(stamp, 'bold', STAMP);
    const lines = wrapBytes(enc(p.text), TEXT_W - stampW - STAMP_GAP, TEXT_W, 'regular', BODY);
    let i = 0;
    while (i < lines.length) {
      const n = take(lines.length - i, Math.floor((BOTTOM - y + EPS) / LEAD), y <= MARGIN + EPS);
      for (let j = i; j < i + n; j++) {
        let x = MARGIN;
        if (j === 0) {
          // same baseline as the body text: the box moves down by 0.3 x the size difference
          page.push({ bytes: stamp, face: 'bold', size: STAMP, color: ACCENT, x, y: y + 0.3 * (BODY - STAMP), h: LEAD });
          x += stampW + STAMP_GAP;
        }
        page.push({ bytes: lines[j], face: 'regular', size: BODY, color: INK, x, y, h: LEAD });
        y += LEAD;
      }
      i += n;
      if (!n || i < lines.length) {
        page = [];
        pages.push(page);
        y = MARGIN;
      }
    }
    y += PARA_GAP;
  }

  // running title (pages 2+) and footer, now that the page count is known
  const running = shorten(enc(doc.title), TEXT_W, 'regular', 8.5);
  pages.forEach((ops, n) => {
    if (n) {
      ops.push({ bytes: running, face: 'regular', size: 8.5, color: MUTED, x: MARGIN, y: 30, h: 12 });
      ops.push({ rule: 48, width: 0.5 });
    }
    ops.push({ rule: PAGE_H - 52, width: 0.5 });
    if (footer?.length) {
      ops.push({ bytes: shorten(footer, TEXT_W / 2, 'regular', 8), face: 'regular', size: 8, color: MUTED, x: MARGIN, y: PAGE_H - 42, h: 10 });
    }
    const label = encode(`Page ${n + 1} of ${pages.length}`) ?? [];
    const x = MARGIN + TEXT_W - textWidth(label, 'regular', 8);
    ops.push({ bytes: label, face: 'regular', size: 8, color: MUTED, x, y: PAGE_H - 42, h: 10 });
  });
  return pages;
}

// ------------------------------------------------------------------------------------------- file
/**
 * The PDF file of a transcript, or null when its text cannot be written with the standard fonts (see canWritePdf;
 * the caller then prints instead).
 */
export function writePdf(job: DocumentJob, options: PdfOptions = {}): Uint8Array<ArrayBuffer> | null {
  const doc = transcriptDocument(job);
  if (!documentStrings(doc).every(canWritePdf)) return null;
  const footer = options.footer ? encode(pdfText(options.footer)) : null;
  const pages = layout(doc, footer);

  // 1 catalog, 2 page tree, 3-4 fonts, 5 document properties, then a page and its content stream per page
  const objects: string[] = [];
  const pageId = (n: number) => 6 + 2 * n;
  const lang = doc.lang && /^[a-z]{2,3}$/.test(doc.lang) ? ` /Lang (${doc.lang})` : ''; // for screen readers
  objects[1] = `<< /Type /Catalog /Pages 2 0 R${lang} >>`;
  objects[2] = `<< /Type /Pages /Kids [${pages.map((_, n) => `${pageId(n)} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const creator = options.creator ? pdfUnicode(options.creator) : '';
  objects[5] =
    `<< /Title ${pdfUnicode(doc.title)}${creator ? ` /Creator ${creator} /Producer ${creator}` : ''}` +
    ` /CreationDate (${pdfDate(options.now ?? new Date())}) >>`;
  pages.forEach((ops, n) => {
    const stream = contentStream(ops);
    objects[pageId(n)] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(PAGE_W)} ${num(PAGE_H)}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageId(n) + 1} 0 R >>`;
    objects[pageId(n) + 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  // the file: everything is ASCII except the binary-marker comment, so one char is one byte
  let out = '%PDF-1.4\n%âãÏÓ\n';
  const offsets: number[] = [];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = out.length;
    out += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = out.length;
  out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) out += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i);
  return bytes;
}
