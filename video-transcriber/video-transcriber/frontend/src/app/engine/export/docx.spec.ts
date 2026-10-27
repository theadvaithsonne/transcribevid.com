import { NO_SPEECH, type DocumentJob } from './document';
import { DOCX_MIME, writeDocx, xmlEscape } from './docx';
import { paragraphs } from './formats';
import { crc32, dosDateTime, zipStore } from './zip';

interface Entry {
  name: string;
  flags: number;
  method: number;
  time: number;
  date: number;
  crc: number;
  data: Uint8Array;
}

/**
 * A strict reader for the archives zipStore writes: the end record, every central directory entry and the local
 * header it points to must agree, and the stored CRC must match the data.
 */
function unzip(zip: Uint8Array): Entry[] {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const end = zip.length - 22;
  expect(v.getUint32(end, true)).toBe(0x06054b50);
  const count = v.getUint16(end + 10, true);
  expect(v.getUint16(end + 8, true)).toBe(count);
  const cdSize = v.getUint32(end + 12, true);
  const cdStart = v.getUint32(end + 16, true);
  expect(cdStart + cdSize).toBe(end); // nothing between the directory and its end record
  const names = new TextDecoder();
  const out: Entry[] = [];
  let p = cdStart;
  let expectedLocal = 0;
  for (let i = 0; i < count; i++) {
    expect(v.getUint32(p, true)).toBe(0x02014b50);
    const flags = v.getUint16(p + 8, true);
    const method = v.getUint16(p + 10, true);
    const time = v.getUint16(p + 12, true);
    const date = v.getUint16(p + 14, true);
    const crc = v.getUint32(p + 16, true);
    const csize = v.getUint32(p + 20, true);
    const size = v.getUint32(p + 24, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = names.decode(zip.subarray(p + 46, p + 46 + nameLen));
    expect([csize, extraLen, commentLen, local]).toEqual([size, 0, 0, expectedLocal]); // stored, entries back to back
    // the local header repeats the same facts
    expect(v.getUint32(local, true)).toBe(0x04034b50);
    expect(v.getUint16(local + 6, true)).toBe(flags);
    expect(v.getUint16(local + 8, true)).toBe(method);
    expect(v.getUint32(local + 14, true)).toBe(crc);
    expect(v.getUint32(local + 18, true)).toBe(size);
    expect(v.getUint32(local + 22, true)).toBe(size);
    expect(v.getUint16(local + 26, true)).toBe(nameLen);
    expect(names.decode(zip.subarray(local + 30, local + 30 + nameLen))).toBe(name);
    const start = local + 30 + nameLen + v.getUint16(local + 28, true);
    const data = zip.slice(start, start + size);
    expect(crc32(data)).toBe(crc);
    out.push({ name, flags, method, time, date, crc, data });
    expectedLocal = start + size;
    p += 46 + nameLen + extraLen + commentLen;
  }
  expect(expectedLocal).toBe(cdStart);
  return out;
}

const NOW = new Date(2026, 9, 27, 14, 30, 42); // local time, as ZIP stores it
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

const seg = (start: number, text: string, end = start + 2) => ({ start, end, text });
const job = (over: Partial<DocumentJob> = {}): DocumentJob => ({
  title: 'Board call',
  language: 'en',
  duration: 65,
  created_at: NOW.getTime() / 1000,
  stats: { word_count: 1234 },
  options: { task: 'transcribe' },
  segments: [seg(0, 'Hello everyone.'), seg(2, 'Welcome to the call.'), seg(10, 'After a pause, a new paragraph.')],
  ...over,
});

function parts(j: DocumentJob = job()) {
  const zip = writeDocx(j, { creator: 'TranscribeVid', now: NOW });
  const entries = unzip(zip);
  const text = new TextDecoder('utf-8', { fatal: true });
  const xml = Object.fromEntries(entries.map((e) => [e.name, text.decode(e.data)]));
  const parse = (name: string) => {
    const doc = new DOMParser().parseFromString(xml[name], 'application/xml');
    expect(doc.getElementsByTagName('parsererror').length, `${name} is well-formed`).toBe(0);
    return doc;
  };
  return { zip, entries, xml, parse };
}

/** The w:p elements of word/document.xml as [style, bidi, run texts]. */
function paras(doc: Document) {
  return Array.from(doc.getElementsByTagNameNS(W, 'p')).map((p) => ({
    style: p.getElementsByTagNameNS(W, 'pStyle')[0]?.getAttributeNS(W, 'val') ?? null,
    bidi: p.getElementsByTagNameNS(W, 'bidi').length > 0,
    runs: Array.from(p.getElementsByTagNameNS(W, 'r')).map((r) => ({
      text: r.getElementsByTagNameNS(W, 't')[0]?.textContent ?? '',
      rtl: r.getElementsByTagNameNS(W, 'rtl').length > 0,
      style: r.getElementsByTagNameNS(W, 'rStyle')[0]?.getAttributeNS(W, 'val') ?? null,
    })),
  }));
}

describe('zip (STORE)', () => {
  it('CRC-32 matches the standard check values', () => {
    const ascii = (s: string) => new TextEncoder().encode(s);
    expect(crc32(new Uint8Array())).toBe(0);
    expect(crc32(ascii('123456789'))).toBe(0xcbf43926);
    expect(crc32(ascii('The quick brown fox jumps over the lazy dog'))).toBe(0x414fa339);
  });

  it('DOS date and time: local time in two-second steps, nothing before 1980', () => {
    expect(dosDateTime(NOW)).toEqual({ date: ((2026 - 1980) << 9) | (10 << 5) | 27, time: (14 << 11) | (30 << 5) | 21 });
    expect(dosDateTime(new Date(1970, 0, 1))).toEqual({ date: (1 << 5) | 1, time: 0 });
  });

  it('writes local headers, a central directory and the end record that agree; UTF-8 names are flagged', () => {
    const files = [
      { name: 'a.txt', data: new TextEncoder().encode('hello') },
      { name: 'dir/ü.xml', data: new TextEncoder().encode('<x/>') },
      { name: 'empty', data: new Uint8Array() },
    ];
    const entries = unzip(zipStore(files, NOW));
    expect(entries.map((e) => [e.name, e.method, e.flags])).toEqual([
      ['a.txt', 0, 0],
      ['dir/ü.xml', 0, 0x0800],
      ['empty', 0, 0],
    ]);
    expect(new TextDecoder().decode(entries[0].data)).toBe('hello');
    expect(entries.every((e) => e.date === dosDateTime(NOW).date && e.time === dosDateTime(NOW).time)).toBe(true);
  });
});

describe('writeDocx', () => {
  it('is a minimal OOXML package: [Content_Types].xml first, every part well-formed, typed and related', () => {
    const { entries, xml, parse } = parts();
    expect(DOCX_MIME).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(entries.map((e) => e.name)).toEqual([
      '[Content_Types].xml',
      '_rels/.rels',
      'docProps/core.xml',
      'word/document.xml',
      'word/styles.xml',
      'word/settings.xml',
      'word/_rels/document.xml.rels',
    ]);
    for (const name of Object.keys(xml)) {
      expect(xml[name].startsWith('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')).toBe(true);
      parse(name);
    }
    // every part has a content type (an Override, or the Default of its extension)
    const types = parse('[Content_Types].xml');
    const overrides = new Map(Array.from(types.getElementsByTagName('Override')).map((o) => [o.getAttribute('PartName'), o.getAttribute('ContentType')]));
    const defaults = new Map(Array.from(types.getElementsByTagName('Default')).map((d) => [d.getAttribute('Extension'), d.getAttribute('ContentType')]));
    expect(overrides.get('/word/document.xml')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml');
    for (const name of Object.keys(xml).filter((n) => n !== '[Content_Types].xml')) {
      expect(overrides.get(`/${name}`) ?? defaults.get(name.split('.').pop()!), name).toBeTruthy();
    }
    // every relationship points at a part that is there
    const targets = (relsName: string, base: string) =>
      Array.from(parse(relsName).getElementsByTagName('Relationship')).map((r) => [r.getAttribute('Type')!.split('/').pop(), base + r.getAttribute('Target')]);
    expect(targets('_rels/.rels', '')).toEqual([
      ['officeDocument', 'word/document.xml'],
      ['core-properties', 'docProps/core.xml'],
    ]);
    expect(targets('word/_rels/document.xml.rels', 'word/')).toEqual([
      ['styles', 'word/styles.xml'],
      ['settings', 'word/settings.xml'],
    ]);
    for (const [, target] of [...targets('_rels/.rels', ''), ...targets('word/_rels/document.xml.rels', 'word/')]) {
      expect(xml[target!]).toBeDefined();
    }
    // the styles the document uses are defined
    const styles = new Set(Array.from(parse('word/styles.xml').getElementsByTagNameNS(W, 'style')).map((s) => s.getAttributeNS(W, 'styleId')));
    for (const id of ['Normal', 'Title', 'Subtitle', 'Timestamp']) expect(styles.has(id)).toBe(true);
    expect(xml['word/document.xml']).toContain('<w:pgSz w:w="11906" w:h="16838"/>'); // A4
  });

  it('has the title, the facts line, then the paragraphs (grouped like the plain text) with their start times', () => {
    const j = job();
    const { parse } = parts(j);
    const ps = paras(parse('word/document.xml'));
    expect(ps[0]).toEqual({ style: 'Title', bidi: false, runs: [{ text: 'Board call', rtl: false, style: null }] });
    expect(ps[1].style).toBe('Subtitle');
    expect(ps[1].runs[0].text).toBe('English · 01:05 · 1,234 words · 27 Oct 2026');
    const body = ps.slice(2);
    expect(body.length).toBe(paragraphs(j.segments).length);
    expect(body.map((p) => p.runs.map((r) => r.text).join(''))).toEqual([
      '[00:00] Hello everyone. Welcome to the call.',
      '[00:10] After a pause, a new paragraph.',
    ]);
    expect(body[0].runs[0].style).toBe('Timestamp');
  });

  it('puts the title, the author and the dates into docProps/core.xml', () => {
    const { parse } = parts(job({ title: 'Q&A <live> "draft"' }));
    const core = parse('docProps/core.xml');
    const text = (tag: string) => core.getElementsByTagName(tag)[0]?.textContent;
    expect(text('dc:title')).toBe('Q&A <live> "draft"');
    expect(text('dc:creator')).toBe('TranscribeVid');
    expect(text('dc:language')).toBe('en');
    expect(text('dcterms:created')).toBe(NOW.toISOString().replace(/\.\d{3}Z$/, 'Z'));
  });

  it('escapes markup and drops the characters XML forbids', () => {
    expect(xmlEscape('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;');
    expect(xmlEscape('bell\u0007 nul\u0000 ￾ ok \ud800 😀')).toBe('bell nul  ok  😀');
    const { xml, parse } = parts(job({ title: 'Tom & Jerry <b>', segments: [seg(0, 'x < y && "quoted" \u0001 </w:t> done')] }));
    expect(xml['word/document.xml']).not.toContain('</w:t> done');
    const ps = paras(parse('word/document.xml'));
    expect(ps[0].runs[0].text).toBe('Tom & Jerry <b>');
    expect(ps[2].runs[1].text).toBe('x < y && "quoted" </w:t> done');
  });

  it('keeps any script as it is: Devanagari, CJK, emoji; Hindi is the complex-script language', () => {
    const hindi = 'नमस्ते दोस्तों, आज हम बात करेंगे।';
    const { parse } = parts(job({ title: 'हिंदी वीडियो', language: 'hi', segments: [seg(0, hindi), seg(5, '中文字幕 😀')] }));
    const doc = parse('word/document.xml');
    const ps = paras(doc);
    expect(ps[0].runs[0].text).toBe('हिंदी वीडियो');
    expect(ps.slice(2).map((p) => p.runs[1].text)).toEqual([hindi, '中文字幕 😀']);
    expect(ps.some((p) => p.bidi)).toBe(false);
    const lang = parse('word/styles.xml').getElementsByTagNameNS(W, 'lang')[0];
    expect(lang.getAttributeNS(W, 'bidi')).toBe('hi');
    expect(lang.hasAttributeNS(W, 'val')).toBe(false); // Latin text (Hinglish, names) keeps Word's own language
  });

  it('Chinese is the East Asian language, French the Latin one; a translation is English', () => {
    const lang = (j: DocumentJob) => parts(j).parse('word/styles.xml').getElementsByTagNameNS(W, 'lang')[0];
    expect(lang(job({ language: 'zh' })).getAttributeNS(W, 'eastAsia')).toBe('zh');
    expect(lang(job({ language: 'fr' })).getAttributeNS(W, 'val')).toBe('fr');
    expect(lang(job({ language: 'fr', options: { task: 'translate' } })).getAttributeNS(W, 'val')).toBe('en');
    expect(lang(job({ language: null }))).toBeUndefined();
  });

  it('writes right-to-left paragraphs and runs for an RTL language', () => {
    const arabic = 'مرحبا بكم في الاجتماع';
    const { parse } = parts(job({ title: 'اجتماع', language: 'ar', segments: [seg(0, arabic), seg(5, 'Zoom 2.0')] }));
    const ps = paras(parse('word/document.xml'));
    expect(ps[0]).toMatchObject({ style: 'Title', bidi: true, runs: [{ text: 'اجتماع', rtl: true }] });
    expect(ps[1].bidi).toBe(false); // the facts line is English
    expect(ps[2]).toMatchObject({ bidi: true, runs: [{ text: '[00:00] ', rtl: false }, { text: arabic, rtl: true }] });
    expect(ps[3].bidi).toBe(false); // no Arabic letters in it
    expect(parse('word/styles.xml').getElementsByTagNameNS(W, 'lang')[0].getAttributeNS(W, 'bidi')).toBe('ar');
  });

  it('an empty transcript says so', () => {
    const { parse } = parts(job({ segments: [], stats: null, duration: null }));
    const ps = paras(parse('word/document.xml'));
    expect(ps.map((p) => p.runs.map((r) => r.text).join(''))).toEqual(['Board call', 'English · 27 Oct 2026', NO_SPEECH]);
  });

  it('is the same file for the same input (only the export time varies)', () => {
    const a = writeDocx(job(), { now: NOW });
    expect(writeDocx(job(), { now: NOW })).toEqual(a);
    expect(Array.from(a.subarray(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]); // "PK\3\4"
  });
});
