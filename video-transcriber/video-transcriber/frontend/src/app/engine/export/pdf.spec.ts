import { NO_SPEECH, type DocumentJob } from './document';
import { paragraphs } from './formats';
import { canWriteJobPdf, canWritePdf, drawableTitle, LEAD, PAGE_H, PAGE_W, pdfString, textWidth, wrapBytes, writePdf } from './pdf';

const MARGIN = 62; // pdf.py's page design
const TEXT_W = PAGE_W - 2 * MARGIN;
const NOW = new Date(Date.UTC(2026, 9, 27, 9, 5, 7));

const seg = (start: number, text: string, end = start + 2) => ({ start, end, text });
const job = (over: Partial<DocumentJob> = {}): DocumentJob => ({
  title: 'Board call',
  language: 'en',
  duration: 65,
  created_at: NOW.getTime() / 1000,
  stats: { word_count: 12 },
  options: { task: 'transcribe' },
  segments: [seg(0, 'Hello everyone.'), seg(2, 'Welcome to the call.'), seg(10, 'After a pause, a new paragraph.')],
  ...over,
});

/** Windows-1252 0x80..0x9F (Node's TextDecoder decodes 'windows-1252' as Latin-1, so the spec has its own table). */
const HIGH = '€\u0081‚ƒ„…†‡ˆ‰Š‹Œ\u008dŽ\u008f\u0090‘’“”•–—˜™š›œ\u009džŸ';
const winAnsi = (bytes: number[]) => bytes.map((b) => (b >= 0x80 && b < 0xa0 ? HIGH[b - 0x80] : String.fromCharCode(b))).join('');
/** A PDF literal string's bytes (the escapes pdfString writes) as text. */
const unescape = (s: string) =>
  winAnsi(Array.from(s.replace(/\\([0-7]{3}|[()\\])/g, (_, e: string) => (e.length === 3 ? String.fromCharCode(parseInt(e, 8)) : e)), (c) => c.charCodeAt(0)));

interface TextRun {
  font: string;
  size: number;
  color: string;
  x: number;
  y: number;
  text: string;
  bytes: number[];
}

/**
 * A strict reader for the files writePdf makes: the header, the trailer, startxref pointing at the xref table, every
 * xref offset pointing at its "n 0 obj", every stream's /Length matching its data.
 */
function readPdf(bytes: Uint8Array) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  expect(s.startsWith('%PDF-1.4\n%âãÏÓ\n')).toBe(true);
  const tail = /startxref\n(\d+)\n%%EOF\n$/.exec(s);
  expect(tail).not.toBeNull();
  const xref = Number(tail![1]);
  const head = /^xref\n0 (\d+)\n/.exec(s.slice(xref));
  expect(head).not.toBeNull();
  const size = Number(head![1]);
  const table = s.slice(xref + head![0].length, xref + head![0].length + 20 * size);
  expect(table.slice(0, 20)).toBe('0000000000 65535 f \n');
  const objects: Record<number, string> = {};
  for (let id = 1; id < size; id++) {
    const entry = table.slice(20 * id, 20 * id + 20);
    expect(entry).toMatch(/^\d{10} 00000 n \n$/);
    const off = Number(entry.slice(0, 10));
    expect(s.startsWith(`${id} 0 obj\n`, off)).toBe(true);
    const start = off + `${id} 0 obj\n`.length;
    objects[id] = s.slice(start, s.indexOf('\nendobj\n', start));
  }
  const trailer = s.slice(xref + head![0].length + 20 * size);
  expect(trailer.startsWith(`trailer\n<< /Size ${size} /Root 1 0 R /Info 5 0 R >>\nstartxref\n`)).toBe(true);

  const kids = [...objects[2].matchAll(/(\d+) 0 R/g)].map((m) => Number(m[1]));
  expect(objects[2]).toContain(`/Count ${kids.length}`);
  const pages = kids.map((id) => {
    expect(objects[id]).toContain('/Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89]');
    const contents = Number(/\/Contents (\d+) 0 R/.exec(objects[id])![1]);
    const m = /^<< \/Length (\d+) >>\nstream\n([\s\S]*)\nendstream$/.exec(objects[contents]);
    expect(m).not.toBeNull();
    expect(m![2].length).toBe(Number(m![1]));
    const runs: TextRun[] = [...m![2].matchAll(/BT \/(F\d) ([\d.]+) Tf ([\d. ]+) rg ([\d.]+) ([\d.]+) Td \(((?:\\.|[^\\)])*)\) Tj ET/g)].map((r) => {
      const text = unescape(r[6]);
      return {
        font: r[1],
        size: Number(r[2]),
        color: r[3],
        x: Number(r[4]),
        y: Number(r[5]),
        text,
        bytes: Array.from(r[6].replace(/\\([0-7]{3}|[()\\])/g, (_, e: string) => (e.length === 3 ? String.fromCharCode(parseInt(e, 8)) : e)), (c) => c.charCodeAt(0)),
      };
    });
    return { stream: m![2], runs };
  });
  return { text: s, objects, pages };
}

const INK = '0.12 0.14 0.16';
/** the transcript lines: regular 10.5 pt in ink */
const bodyLines = (p: { runs: TextRun[] }) => p.runs.filter((r) => r.font === 'F1' && r.size === 10.5 && r.color === INK);
const decodeHex = (hex: string) => {
  let out = '';
  for (let i = 4; i < hex.length; i += 4) out += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  return out;
};

describe('canWritePdf', () => {
  it.each([
    ['English', 'Hello, this is a test. It costs $5 (or 4 EUR).'],
    ['Hinglish', 'Aaj hum baat karenge ki kaise apna business online le jaayein, theek hai?'],
    ['French', 'Où est l’hôtel ? Ça coûte 20 € — une œuvre « très » belle…'],
    ['German / Spanish', 'Grüße aus München! ¿Qué tal, señor? Straße'],
    ['invisible characters and odd spaces', 'zero​width soft­hyphen no break thin space − minus'],
  ])('true for %s', (_name, text) => expect(canWritePdf(text)).toBe(true));

  it.each([
    ['Hindi (Devanagari)', 'नमस्ते दोस्तों'],
    ['Chinese', '你好，世界'],
    ['Japanese', 'こんにちは'],
    ['Arabic', 'مرحبا'],
    ['Polish', 'Źdźbło trawy'],
    ['an emoji', 'great 😀'],
  ])('false for %s', (_name, text) => expect(canWritePdf(text)).toBe(false));

  it('looks at everything the PDF prints: title, facts and text', () => {
    expect(canWriteJobPdf(job())).toBe(true);
    expect(canWriteJobPdf(job({ title: 'हिंदी वीडियो' }))).toBe(false);
    expect(canWriteJobPdf(job({ segments: [seg(0, 'hello'), seg(1, 'नमस्ते')] }))).toBe(false);
    expect(writePdf(job({ language: 'hi', segments: [seg(0, 'नमस्ते दोस्तों')] }))).toBeNull(); // the caller prints instead
    expect(canWriteJobPdf(job({ language: 'hi', segments: [seg(0, 'Namaste doston, kaise ho?')] }))).toBe(true); // Hinglish
  });

  it('a symbol only in the title (an emoji in the file name) leaves it out of the drawn title, not the whole PDF', () => {
    expect(drawableTitle('Voice note 🎤')).toBe('Voice note');
    expect(drawableTitle('Team🎉call ➜ notes')).toBe('Team call notes');
    expect(drawableTitle('Board call')).toBe('Board call');
    expect(drawableTitle('हिंदी 🎤')).toBe('हिंदी 🎤'); // letters of another script: kept, the document is printed
    expect(drawableTitle('🎤🎤')).toBe('🎤🎤'); // nothing would be left
    expect(canWriteJobPdf(job({ title: 'Voice note 🎤' }))).toBe(true);
    expect(canWriteJobPdf(job({ title: 'Meeting 会议' }))).toBe(false);
    const pdf = readPdf(writePdf(job({ title: 'Voice note 🎤' }), { now: NOW })!);
    expect(pdf.pages[0].runs[0].text).toBe('Voice note');
    expect(decodeHex(/\/Title <([0-9A-F]+)>/.exec(pdf.objects[5])![1])).toBe('Voice note 🎤'); // the properties keep it
  });
});

describe('writePdf', () => {
  it('is a well-formed PDF 1.4: objects at their xref offsets, trailer, document properties, standard fonts', () => {
    const pdf = readPdf(writePdf(job({ title: 'Café (draft) – “Q&A”' }), { creator: 'TranscribeVid', footer: 'TranscribeVid - transcribevid.com', now: NOW })!);
    expect(pdf.objects[1]).toBe('<< /Type /Catalog /Pages 2 0 R /Lang (en) >>');
    expect(pdf.objects[3]).toBe('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    expect(pdf.objects[4]).toBe('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const info = pdf.objects[5];
    expect(decodeHex(/\/Title <([0-9A-F]+)>/.exec(info)![1])).toBe('Café (draft) – “Q&A”');
    expect(decodeHex(/\/Creator <([0-9A-F]+)>/.exec(info)![1])).toBe('TranscribeVid');
    expect(info).toContain('/CreationDate (D:20261027090507Z)');
    expect(pdf.pages.length).toBe(1);
    // plain ASCII apart from the binary marker: one character is one byte, so the offsets above are exact
    expect(/[^\x00-\x7f]/.test(pdf.text.slice(15))).toBe(false);
  });

  it('shows the title, the facts line, then "[mm:ss] text" paragraphs, and the footer', () => {
    const j = job();
    const [page] = readPdf(writePdf(j, { footer: 'TranscribeVid - transcribevid.com', now: NOW })!).pages;
    const texts = page.runs.map((r) => r.text);
    expect(texts.slice(0, 2)).toEqual(['Board call', 'English · 01:05 · 12 words · 27 Oct 2026']);
    expect(page.runs[0]).toMatchObject({ font: 'F2', size: 22 });
    expect(texts).toContain('[00:00]');
    expect(texts).toContain('[00:10]');
    expect(bodyLines(page).map((r) => r.text)).toEqual(['Hello everyone. Welcome to the call.', 'After a pause, a new paragraph.']);
    expect(paragraphs(j.segments).length).toBe(2);
    const stamp = page.runs.find((r) => r.text === '[00:00]')!;
    const first = bodyLines(page)[0];
    expect(stamp).toMatchObject({ font: 'F2', size: 9, x: MARGIN, y: first.y }); // same baseline as its text
    expect(first.x).toBeCloseTo(MARGIN + textWidth(stamp.bytes, 'bold', 9) + 6, 1);
    expect(texts.slice(-2)).toEqual(['TranscribeVid - transcribevid.com', 'Page 1 of 1']);
    expect(texts.filter((t) => t === 'Board call').length).toBe(1); // no running title on page 1
  });

  it('wraps long paragraphs inside the margins and breaks pages, numbering them and repeating the title', () => {
    const sentence = 'The quarterly numbers looked better than expected, and the team agreed to keep the plan as it is.';
    // a pause after every seventh line starts a new paragraph
    const segments = Array.from({ length: 160 }, (_, i) => seg(i * 2.5 + Math.floor(i / 7) * 3, `${i + 1}. ${sentence}`));
    const j = job({ segments });
    const pdf = readPdf(writePdf(j, { now: NOW })!);
    const n = pdf.pages.length;
    expect(n).toBeGreaterThan(3);
    pdf.pages.forEach((page, k) => {
      const texts = page.runs.map((r) => r.text);
      expect(texts.at(-1)).toBe(`Page ${k + 1} of ${n}`);
      if (k) expect(page.runs[page.runs.length - 2].text).toBe('Board call'); // running title (drawn after the body)
      for (const line of bodyLines(page)) {
        expect(line.x + textWidth(line.bytes, 'regular', 10.5)).toBeLessThanOrEqual(MARGIN + TEXT_W + 0.01);
        expect(line.y).toBeGreaterThan(66); // above the footer rule
        expect(line.y).toBeLessThan(PAGE_H - MARGIN);
      }
      // lines are LEAD apart (or more, between paragraphs), never overlapping
      const ys = bodyLines(page).map((l) => l.y);
      for (let i = 1; i < ys.length; i++) expect(ys[i - 1] - ys[i]).toBeGreaterThanOrEqual(LEAD - 0.02);
    });
    // every word is there, in order, once
    const printed = pdf.pages.flatMap((p) => bodyLines(p).map((l) => l.text)).join(' ');
    const expected = paragraphs(j.segments).map((p) => p.map((s) => s.text).join(' ')).join(' ');
    expect(printed).toBe(expected);
  });

  it('cuts a word longer than a line instead of letting it overflow', () => {
    const word = Array.from({ length: 400 }, (_, i) => String.fromCharCode(97 + (i % 26))).map((c) => c.charCodeAt(0));
    const lines = wrapBytes([...word, 0x20, 0x61], 100, 200, 'regular', 10.5);
    expect(lines.length).toBeGreaterThan(5);
    expect(textWidth(lines[0], 'regular', 10.5)).toBeLessThanOrEqual(100.01);
    for (const l of lines.slice(1)) expect(textWidth(l, 'regular', 10.5)).toBeLessThanOrEqual(200.01);
    expect(lines.flat().filter((b) => b !== 0x20).length).toBe(401);
    const pdf = readPdf(writePdf(job({ segments: [seg(0, 'x'.repeat(2000))] }), { now: NOW })!);
    expect(pdf.pages[0].runs.filter((r) => r.size === 10.5).map((r) => r.text).join('')).toBe('x'.repeat(2000));
  });

  it('escapes parentheses and backslashes, and writes WinAnsi letters as octal escapes', () => {
    expect(pdfString([0x28, 0x61, 0x29, 0x5c, 0xe9, 0x80, 0x0a])).toBe('(\\(a\\)\\\\\\351\\200\\012)');
    const text = 'f(x) = (a) \\ b; café – “quoted” … 5 € œuvre';
    const pdf = readPdf(writePdf(job({ title: 'Notes (v2) \\ final', segments: [seg(0, text)] }), { now: NOW })!);
    const stream = pdf.pages[0].stream;
    expect(stream).toContain('(Notes \\(v2\\) \\\\ final)');
    expect(stream).toContain('(f\\(x\\) = \\(a\\) \\\\ b; caf\\351 \\226 \\223quoted\\224 \\205 5 \\200 \\234uvre)');
    expect(bodyLines(pdf.pages[0])[0].text).toBe(text);
  });

  it('an empty transcript is one page that says so', () => {
    const pdf = readPdf(writePdf(job({ segments: [], stats: null, duration: null }), { now: NOW })!);
    expect(pdf.pages.length).toBe(1);
    expect(pdf.pages[0].runs.map((r) => r.text)).toEqual(['Board call', 'English · 27 Oct 2026', NO_SPEECH, 'Page 1 of 1']);
  });

  it('shortens a very long title to three lines, and the running title to one', () => {
    const title = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ');
    const segments = Array.from({ length: 200 }, (_, i) => seg(i * 4, 'Some words that fill the page with lines of text, one after another.'));
    const pdf = readPdf(writePdf(job({ title, segments }), { now: NOW })!);
    const titleLines = pdf.pages[0].runs.filter((r) => r.size === 22);
    expect(titleLines.length).toBe(3);
    expect(titleLines[2].text.endsWith('…')).toBe(true);
    const running = pdf.pages[1].runs.find((r) => r.size === 8.5)!;
    expect(running.text.endsWith('…')).toBe(true);
    expect(textWidth(running.bytes, 'regular', 8.5)).toBeLessThanOrEqual(TEXT_W + 0.01);
  });

  it('is the same file for the same input', () => {
    expect(writePdf(job(), { now: NOW })).toEqual(writePdf(job(), { now: NOW }));
  });
});
