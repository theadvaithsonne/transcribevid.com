// make-manifest.mjs <path-to-ffmpeg> - scans fixtures/audio and fixtures/generated, decodes every file with ffmpeg
// to measure its real duration/stream info, hashes it, and writes fixtures/manifest.json.
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ffmpeg = process.argv[2];
if (!ffmpeg) { console.error('usage: node make-manifest.mjs <ffmpeg>'); process.exit(2); }
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8').trim();
const norm = { a: read('texts/passage-a.normalized.txt'), b: read('texts/passage-b.normalized.txt'), c: read('texts/passage-c.normalized.txt') };
const DAVID = 'Microsoft David Desktop (SAPI)', ZIRA = 'Microsoft Zira Desktop (SAPI)';
const voiceOf = { a: DAVID, b: ZIRA, c: DAVID };

function wavDataSeconds(file) {
  const b = readFileSync(file);
  let o = 12;
  const rate = b.readUInt32LE(24), ch = b.readUInt16LE(22), bits = b.readUInt16LE(34);
  while (o + 8 <= b.length) {
    const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'data') return sz / (rate * ch * (bits / 8));
    o += 8 + sz + (sz & 1);
  }
  throw new Error('no data chunk in ' + file);
}
const dur = (log) => { const m = [...log.matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)].pop(); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : null; };

function probe(file) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', file, '-f', 'null', '-'], { encoding: 'utf8' });
  const log = r.stderr || '';
  const info = { decodeExitCode: r.status, decodeOk: r.status === 0, error: null };
  if (r.status !== 0) info.error = log.trim().split(/\r?\n/).slice(-3).join(' | ');
  info.containerFormat = (log.match(/Input #0, ([^,]+(?:,[^,]+)*?), (?:from|\n)/) || [])[1] || null;
  const a = log.match(/Stream #0:\d+[^:]*: Audio: (\w+)[^,\n]*, (\d+) Hz, ([^,\n]+)/);
  const v = log.match(/Stream #0:\d+[^:]*: Video: (\w+)[^\n]*?, (\d+x\d+)/);
  info.audioCodec = a ? a[1] : null;
  info.sampleRate = a ? +a[2] : null;
  const chs = a ? a[3].trim() : null;
  info.channels = chs === 'mono' ? 1 : chs === 'stereo' ? 2 : chs ? parseInt(chs, 10) || chs : null;
  info.videoCodec = v ? v[1] : null; info.videoSize = v ? v[2] : null;
  const h = log.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  info.headerDurationSeconds = h ? +(+h[1] * 3600 + +h[2] * 60 + +h[3]).toFixed(2) : null;
  info.decodedDurationSeconds = r.status === 0 ? dur(log) : null;
  if (r.status === 0 && a) {   // decode the audio stream alone: a 1 fps video track would otherwise cap `time=`
    const r2 = spawnSync(ffmpeg, ['-hide_banner', '-i', file, '-map', '0:a:0', '-f', 'null', '-'], { encoding: 'utf8' });
    if (r2.status === 0) info.decodedDurationSeconds = dur(r2.stderr || '');
  }
  return info;
}

const SILENCE_S = 20;
const durC = wavDataSeconds(join(root, 'generated/speech-c-16k.wav'));
const durB = wavDataSeconds(join(root, 'generated/speech-b-16k.wav'));
const noSpeech = 'no speech: a correct engine returns no segments (and must not hallucinate text)';
const containerNote = (c) => `same speech as passage-b in ${c}: must decode and transcribe to expectedText`;

// per-file meta: [passage, voice-override, behaviour]  (expectedText derived from passage unless null)
const M = {
  'passage-b-16k-mono.wav': ['b', 'baseline: 16 kHz mono PCM, transcribes to expectedText'],
  'passage-c-44k-stereo.wav': ['c', 'first 5 s of passage-c at 44.1 kHz stereo (committed-size limit): tests resample + downmix; output must be a prefix of expectedText (cut point not guaranteed to be a word boundary)', { prefixOnly: true }],
  'passage-a-16k-mono.wav': ['a', 'long baseline (~73 s): transcribes to expectedText; exercises chunking'],
  'passage-a.mp3': ['a', 'long mp3 64k: ' + containerNote('mp3')],
  'passage-a.m4a': ['a', 'long AAC 48k in m4a: ' + containerNote('m4a')],
  'passage-b.mp3': ['b', containerNote('mp3 64k')],
  'passage-b.m4a': ['b', containerNote('m4a (AAC 48k)')],
  'passage-b.ogg': ['b', containerNote('ogg/Vorbis')],
  'passage-b.opus': ['b', containerNote('.opus (Ogg Opus)')],
  'passage-b.flac': ['b', containerNote('flac')],
  'passage-b.webm': ['b', containerNote('webm/Opus')],
  'passage-b-video.mp4': ['b', containerNote('mp4 (H.264 160x90 1 fps black + AAC)') + '; video track must be ignored'],
  'passage-b-video.mkv': ['b', containerNote('mkv (H.264 + Opus)')],
  'passage-b-video.avi': ['b', containerNote('avi (MPEG-4 + MP3)')],
  'passage-b-video.mov': ['b', containerNote('mov (H.264 + AAC)')],
  'passage-b-ac3.mp4': ['b', 'unsupported codec path: AC-3 audio in mp4. Browsers (WebCodecs / decodeAudioData) may not decode AC-3; if the decoder cannot, it must fail with a clear message naming the codec, never hang or return empty text silently. If it does decode, text must match expectedText', { codecRisk: true }],
  'passage-b-eac3.mp4': ['b', 'unsupported codec path: E-AC-3 audio in mp4 (see passage-b-ac3.mp4)', { codecRisk: true }],
  'passage-b.3gp': ['b', 'narrowband 8 kHz AMR-NB in 3gp: browser decode support varies; either transcribes approximately (telephone quality, WER higher) or fails with a clear unsupported-codec message', { codecRisk: true, lowQuality: true }],
  'passage-b.amr': ['b', 'raw AMR-NB (8 kHz): see passage-b.3gp', { codecRisk: true, lowQuality: true }],
  'silence-30s.wav': [null, noSpeech],
  'noise-pink-30s.wav': [null, 'no speech: pink noise; a correct engine returns no segments (hallucination guard test)'],
  'music-like-30s.wav': [null, 'no speech: synthesised chords; a correct engine returns no segments or nothing meaningful (hallucination guard test)'],
  'speech-silence-speech.wav': ['b+c', 'two speech blocks separated by 20 s digital silence: exactly the speech regions must be transcribed, no text timestamped inside the silence, VAD must skip it. Segment timestamps must fall inside the timeline speech regions (+-0.5 s). Expected text = passage-c then passage-b'],
  'speech-over-noise.wav': ['b', 'passage-b + pink noise at ~10 dB SNR: should still transcribe mostly correctly (higher WER allowed)', { noisy: true }],
  'quiet-speech.wav': ['b', 'passage-b peaking at -35 dBFS: should still transcribe (tests normalisation / VAD thresholds)', { quiet: true }],
  'tone-1k.mp3': [null, 'no speech: 3 s 1 kHz sine; must decode, no segments'],
  'noaudio.mp4': [null, 'no audio track: must fail with a clear message "no audio track found" (not hang, not return empty transcript silently)'],
  'corrupt.mp4': [null, 'corrupt/truncated mp4 (moov atom missing): must fail with a clear decode error message; never hang'],
  'empty.wav': [null, 'empty (0 bytes) file: must be rejected with a clear message before any model work'],
};

const files = [];
for (const dir of ['audio', 'generated']) {
  for (const name of readdirSync(join(root, dir)).sort()) {
    if (/^master-|^speech-[abc]-16k\.wav$/.test(name)) continue;   // intermediates
    files.push({ dir, name });
  }
}

const out = [];
for (const { dir, name } of files) {
  const m = M[name];
  if (!m) throw new Error('no metadata for ' + name);
  const path = join(root, dir, name);
  const buf = readFileSync(path);
  const p = probe(path);
  const ext = extname(name).slice(1);
  const passage = m[0];
  const opts = m[2] || {};
  let expectedText = null;
  if (passage === 'a' || passage === 'b' || passage === 'c') expectedText = norm[passage];
  if (passage === 'b+c') expectedText = norm.c + ' ' + norm.b;
  let voice = null;
  if (passage && passage.length === 1) voice = voiceOf[passage];
  if (passage === 'b+c') voice = `${DAVID} (passage-c) + ${ZIRA} (passage-b)`;
  const e = {
    name, path: `${dir}/${name}`, tier: dir === 'audio' ? 'committed' : 'generated (git-ignored; run tools/make-fixtures.ps1)',
    container: ext, containerFormat: p.containerFormat, audioCodec: p.audioCodec, videoCodec: p.videoCodec, videoSize: p.videoSize,
    durationSeconds: ext === 'wav' && p.decodeOk ? +wavDataSeconds(path).toFixed(3) : p.decodedDurationSeconds,
    headerDurationSeconds: p.headerDurationSeconds,
    sampleRate: p.sampleRate, channels: p.channels, bytes: buf.length,
    sha256: createHash('sha256').update(buf).digest('hex'),
    voice, passage, expectedText, expectedTextIsPrefix: !!opts.prefixOnly,
    expectedBehaviour: m[1],
    ffmpegDecodes: p.decodeOk,
  };
  if (!p.decodeOk) e.ffmpegError = p.error;
  if (name === 'speech-silence-speech.wav') {
    e.timeline = [
      { kind: 'speech', passage: 'c', voice: DAVID, startSeconds: 0, endSeconds: +durC.toFixed(3) },
      { kind: 'silence', startSeconds: +durC.toFixed(3), endSeconds: +(durC + SILENCE_S).toFixed(3) },
      { kind: 'speech', passage: 'b', voice: ZIRA, startSeconds: +(durC + SILENCE_S).toFixed(3), endSeconds: +(durC + SILENCE_S + durB).toFixed(3) },
    ];
    e.timelineNote = 'speech blocks include SAPI leading/trailing near-silence (typically <0.3 s each side)';
  }
  out.push(e);
}
const committedBytes = out.filter((e) => e.tier === 'committed').reduce((s, e) => s + e.bytes, 0);
const manifest = {
  generator: 'tools/make-fixtures.ps1 + tools/make-manifest.mjs',
  normalisation: "lowercase, punctuation removed (apostrophes kept), numbers written as spoken words (1,250 -> one thousand two hundred fifty; March 3rd -> march third)",
  voices: { passageA: DAVID, passageB: ZIRA, passageC: DAVID },
  committedBytes, committedBytesLimit: 5000000,
  files: out,
};
writeFileSync(join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest.json: ${out.length} files, committed ${committedBytes} bytes`);
