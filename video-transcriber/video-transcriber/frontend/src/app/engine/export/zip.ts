/**
 * A minimal ZIP writer (PKWARE APPNOTE 6.3.x) for the .docx export: STORE only (no compression), no ZIP64. A .docx is
 * a handful of small XML parts, so compression would save a few kilobytes at the cost of a deflate implementation or a
 * dependency. Word, LibreOffice and Google Docs all read stored entries.
 */

export interface ZipFile {
  /** the path inside the archive, '/' separated, no leading slash */
  name: string;
  data: Uint8Array;
}

/** APPNOTE 4.4.7: CRC-32 with the reflected polynomial 0xEDB88320 (the one zlib, PNG and Ethernet use). */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** The MS-DOS date and time ZIP headers store: local time in two-second steps, 1980 at the earliest. */
export function dosDateTime(d: Date): { date: number; time: number } {
  if (!(d.getFullYear() >= 1980)) return { date: (1 << 5) | 1, time: 0 }; // 1 January 1980 (also for an invalid date)
  const year = Math.min(d.getFullYear(), 2107) - 1980;
  return {
    date: (year << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
  };
}

const LOCAL_HEADER = 0x04034b50;
const CENTRAL_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
/** 2.0, what most writers claim; made by MS-DOS (upper byte 0), so no Unix permissions are implied */
const VERSION = 20;
/** general purpose bit 11: the file name is UTF-8 (only set when it is not plain ASCII) */
const UTF8_NAME = 0x0800;
const STORE = 0;

/** The archive of `files`, in this order (a .docx puts [Content_Types].xml first). */
export function zipStore(files: readonly ZipFile[], modified: Date = new Date()): Uint8Array<ArrayBuffer> {
  const utf8 = new TextEncoder();
  const { date, time } = dosDateTime(modified);
  const entries = files.map((f) => ({
    name: utf8.encode(f.name),
    data: f.data,
    crc: crc32(f.data),
    flags: /^[\x20-\x7e]*$/.test(f.name) ? 0 : UTF8_NAME,
    offset: 0,
  }));
  if (entries.length > 0xffff || entries.some((e) => e.data.length > 0xfffffffe)) {
    throw new Error('zipStore: too large for a ZIP without ZIP64');
  }
  const localSize = entries.reduce((n, e) => n + 30 + e.name.length + e.data.length, 0);
  const centralSize = entries.reduce((n, e) => n + 46 + e.name.length, 0);
  const out = new Uint8Array(localSize + centralSize + 22);
  const v = new DataView(out.buffer);
  let p = 0;

  for (const e of entries) {
    e.offset = p;
    v.setUint32(p, LOCAL_HEADER, true);
    v.setUint16(p + 4, VERSION, true); // version needed to extract
    v.setUint16(p + 6, e.flags, true);
    v.setUint16(p + 8, STORE, true);
    v.setUint16(p + 10, time, true);
    v.setUint16(p + 12, date, true);
    v.setUint32(p + 14, e.crc, true);
    v.setUint32(p + 18, e.data.length, true); // compressed size = size (stored)
    v.setUint32(p + 22, e.data.length, true);
    v.setUint16(p + 26, e.name.length, true);
    v.setUint16(p + 28, 0, true); // no extra field
    out.set(e.name, p + 30);
    out.set(e.data, p + 30 + e.name.length);
    p += 30 + e.name.length + e.data.length;
  }

  const centralStart = p;
  for (const e of entries) {
    v.setUint32(p, CENTRAL_HEADER, true);
    v.setUint16(p + 4, VERSION, true); // version made by
    v.setUint16(p + 6, VERSION, true); // version needed to extract
    v.setUint16(p + 8, e.flags, true);
    v.setUint16(p + 10, STORE, true);
    v.setUint16(p + 12, time, true);
    v.setUint16(p + 14, date, true);
    v.setUint32(p + 16, e.crc, true);
    v.setUint32(p + 20, e.data.length, true);
    v.setUint32(p + 24, e.data.length, true);
    v.setUint16(p + 28, e.name.length, true);
    // extra field, comment, disk number, internal and external attributes: all 0 (the bytes are already 0)
    v.setUint32(p + 42, e.offset, true);
    out.set(e.name, p + 46);
    p += 46 + e.name.length;
  }

  v.setUint32(p, END_OF_CENTRAL_DIRECTORY, true);
  v.setUint16(p + 8, entries.length, true); // entries on this disk
  v.setUint16(p + 10, entries.length, true); // entries in total
  v.setUint32(p + 12, p - centralStart, true); // size of the central directory
  v.setUint32(p + 16, centralStart, true);
  return out;
}
