// make-long.mjs <minutes> <outDir> [ffmpeg]
// Builds long test files by looping passage-a (16 kHz mono) for <minutes>:
//   long-<N>min.wav (16 kHz mono PCM), long-<N>min.m4a (AAC 48k), long-<N>min-video.mp4 (160x90 1 fps black H.264 + AAC 48k)
// Output is NOT committed. Needs fixtures/generated/passage-a-16k-mono.wav (run make-fixtures.ps1 first).
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [minutesArg, outDirArg, ffArg] = process.argv.slice(2);
const minutes = Number(minutesArg);
if (!(minutes > 0) || !outDirArg) { console.error('usage: node make-long.mjs <minutes> <outDir> [ffmpeg]'); process.exit(2); }
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', 'generated', 'passage-a-16k-mono.wav');
if (!existsSync(src)) { console.error('missing ' + src + ' - run tools/make-fixtures.ps1 first'); process.exit(2); }
const ffmpeg = ffArg || process.env.FFMPEG ||
  'D:/transcribevid.com/transcribevid.com/video-transcriber/video-transcriber/backend/.venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const outDir = resolve(outDirArg);
mkdirSync(outDir, { recursive: true });
const secs = String(minutes * 60);
const base = ['-y', '-hide_banner', '-loglevel', 'error', '-stream_loop', '-1', '-i', src, '-t', secs];
const jobs = [
  [`long-${minutes}min.wav`, ['-c:a', 'pcm_s16le']],
  [`long-${minutes}min.m4a`, ['-c:a', 'aac', '-b:a', '48k']],
  [`long-${minutes}min-video.mp4`, null],
];
for (const [name, enc] of jobs) {
  const out = join(outDir, name);
  const args = enc
    ? [...base, ...enc, out]
    : ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=black:s=160x90:r=1:d=${secs}`,
       '-stream_loop', '-1', '-i', src, '-t', secs, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '35', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '48k', '-movflags', '+faststart', out];
  const t = Date.now();
  const r = spawnSync(ffmpeg, args, { encoding: 'utf8' });
  if (r.status !== 0) { console.error(`FAILED ${name}\n${r.stderr}`); process.exit(1); }
  console.log(`${out}  ${(statSync(out).size / 1e6).toFixed(1)} MB  ${((Date.now() - t) / 1000).toFixed(1)} s`);
}
