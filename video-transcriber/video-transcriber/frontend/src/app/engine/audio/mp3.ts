/**
 * MP3 gapless information (LAME / Info / Xing tag). WebCodecs and mediabunny output every decoded sample, including
 * the encoder delay at the start, whereas ffmpeg (and <audio> in Chrome) trim it; untreated, every LAME MP3 starts
 * 69 ms late against the Python engine (spike/audio.md 3.6).
 *
 * Same rules as ffmpeg's libavformat/mp3dec.c:
 *   start skip = encoder delay + 528 + 1
 *   end trim   = max(0, end padding - (528 + 1))     (needs the frame count from the tag)
 */

export interface Mp3Gapless {
  /** Decoded sample frames (at the file's rate) to drop at the start. */
  startSkip: number;
  /** Decoded sample frames to drop at the end (0 when the tag has no frame count). */
  endTrim: number;
  encoderDelay: number;
  encoderPadding: number;
  frames: number | null;
  samplesPerFrame: number;
  encoder: string;
}

export async function readMp3Gapless(file: Blob): Promise<Mp3Gapless | null> {
  const head = new Uint8Array(await file.slice(0, 64 * 1024).arrayBuffer());
  let pos = 0;
  // skip ID3v2 tag(s)
  while (
    head.length - pos > 10 &&
    head[pos] === 0x49 &&
    head[pos + 1] === 0x44 &&
    head[pos + 2] === 0x33
  ) {
    const size =
      ((head[pos + 6] & 0x7f) << 21) |
      ((head[pos + 7] & 0x7f) << 14) |
      ((head[pos + 8] & 0x7f) << 7) |
      (head[pos + 9] & 0x7f);
    pos += 10 + size + (head[pos + 5] & 0x10 ? 10 : 0);
  }
  if (pos >= head.length) {
    // a tag larger than the first 64 KiB: read again right after it
    const more = new Uint8Array(await file.slice(pos, pos + 4096).arrayBuffer());
    return parseFrame(more, 0) ?? null;
  }
  // first frame sync (tolerate a little garbage / padding)
  for (let p = pos; p < Math.min(head.length - 4, pos + 4096); p++) {
    if (head[p] === 0xff && (head[p + 1] & 0xe0) === 0xe0) {
      const r = parseFrame(head, p);
      if (r !== undefined) return r;
    }
  }
  return null;
}

/** undefined = no valid frame header at p; null = a valid frame without a LAME tag. */
function parseFrame(b: Uint8Array, p: number): Mp3Gapless | null | undefined {
  if (p + 4 > b.length) return undefined;
  const h1 = b[p + 1];
  const h2 = b[p + 2];
  const h3 = b[p + 3];
  // version: 0 = 2.5, 1 reserved, 2 = MPEG-2, 3 = MPEG-1; layer: 1 = layer III
  const versionBits = (h1 >> 3) & 3;
  const layerBits = (h1 >> 1) & 3;
  const hasCrc = (h1 & 1) === 0;
  if (versionBits === 1 || layerBits !== 1) return undefined;
  const bitrateIdx = (h2 >> 4) & 15;
  const srIdx = (h2 >> 2) & 3;
  if (bitrateIdx === 0 || bitrateIdx === 15 || srIdx === 3) return undefined;
  const mpeg1 = versionBits === 3;
  const mono = ((h3 >> 6) & 3) === 3;
  const sideInfo = mpeg1 ? (mono ? 17 : 32) : mono ? 9 : 17;
  const tagPos = p + 4 + (hasCrc ? 2 : 0) + sideInfo;
  if (tagPos + 8 > b.length) return null;
  const id = String.fromCharCode(b[tagPos], b[tagPos + 1], b[tagPos + 2], b[tagPos + 3]);
  if (id !== 'Xing' && id !== 'Info') return null;
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let q = tagPos + 4;
  const flags = dv.getUint32(q);
  q += 4;
  let frames: number | null = null;
  if (flags & 1) {
    frames = dv.getUint32(q);
    q += 4;
  }
  if (flags & 2) q += 4;
  if (flags & 4) q += 100;
  if (flags & 8) q += 4;
  if (q + 24 > b.length) return null;
  const encoder = String.fromCharCode(...b.subarray(q, q + 9)).replace(/\0+$/, '');
  // the same condition as ffmpeg: only these encoders write a trustworthy delay
  if (!/^(LAME|Lavf|Lavc)/.test(encoder)) return null;
  const v = (b[q + 21] << 16) | (b[q + 22] << 8) | b[q + 23];
  const encoderDelay = v >> 12;
  const encoderPadding = v & 4095;
  return {
    startSkip: encoderDelay + 528 + 1,
    endTrim: frames ? Math.max(0, encoderPadding - (528 + 1)) : 0,
    encoderDelay,
    encoderPadding,
    frames,
    samplesPerFrame: mpeg1 ? 1152 : 576,
    encoder,
  };
}
