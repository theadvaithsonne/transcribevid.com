/**
 * 16-bit PCM WAV files for the player of files the browser cannot play itself (.mkv, .avi, .wma, .mov outside Safari
 * ...). The server makes a small mp3 preview with ffmpeg (engine.py make_audio_preview: mono, no clean-up filters);
 * the browser has no mp3 encoder, so it plays the decoded 16 kHz mono audio as WAV (115 MB per hour, the same
 * PCM the engine works on, without the clean-up filters).
 *
 * The builder packs the decoded Float32 chunks into 1 MiB Blob parts as they arrive, so the page never holds the whole
 * signal in one array (Blobs of that size are kept by the browser's blob storage, which can page them to disk).
 */

export const WAV_HEADER_BYTES = 44;

/** RIFF / WAVE header of a mono 16-bit PCM file with `samples` samples. */
export function wavHeader(samples: number, sampleRate = 16000): Uint8Array {
  const data = samples * 2;
  const b = new Uint8Array(WAV_HEADER_BYTES);
  const v = new DataView(b.buffer);
  const tag = (o: number, s: string) => {
    for (let i = 0; i < 4; i++) b[o + i] = s.charCodeAt(i);
  };
  tag(0, 'RIFF');
  v.setUint32(4, 36 + data, true);
  tag(8, 'WAVE');
  tag(12, 'fmt ');
  v.setUint32(16, 16, true); // fmt chunk size
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true); // byte rate
  v.setUint16(32, 2, true); // block align
  v.setUint16(34, 16, true); // bits per sample
  tag(36, 'data');
  v.setUint32(40, data, true);
  return b;
}

export class WavBlobBuilder {
  private readonly parts: Blob[] = [];
  private buf: Int16Array;
  private fill = 0;
  private total = 0;

  constructor(
    private readonly sampleRate = 16000,
    private readonly partSamples = 1 << 19,
  ) {
    this.buf = new Int16Array(partSamples);
  }

  get samples(): number {
    return this.total;
  }

  /** Float samples (any magnitude: clipped to 16 bits, rounded half away from zero like Pcm16Builder). */
  append(x: Float32Array): void {
    for (let i = 0; i < x.length; i++) {
      const q = x[i] * 32768;
      this.buf[this.fill++] = q >= 32767.5 ? 32767 : q <= -32768.5 ? -32768 : (q < 0 ? q - 0.5 : q + 0.5) | 0;
      if (this.fill === this.buf.length) this.flush();
    }
    this.total += x.length;
  }

  /** The finished file (audio/wav). The builder is empty afterwards. */
  finish(): Blob {
    this.flush();
    const blob = new Blob([wavHeader(this.total, this.sampleRate) as BlobPart, ...this.parts], { type: 'audio/wav' });
    this.parts.length = 0;
    this.total = 0;
    return blob;
  }

  private flush(): void {
    if (!this.fill) return;
    this.parts.push(new Blob([this.buf.slice(0, this.fill) as BlobPart]));
    this.fill = 0;
  }
}
