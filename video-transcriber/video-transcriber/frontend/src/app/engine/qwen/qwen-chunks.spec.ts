import { QWEN_PLAN, planWindows } from '../vad/windows';
import { ChunkDecodeResult, QwenChunk, QwenSegment, chunksFromWindows, padChunk, planChunks, transcribeChunks } from './qwen-chunks';

// backend/tests/test_backends.py's Qwen tests (as re-implemented in the spike's port/loop_test.mjs), against the
// browser port; plus the equivalence of engine/vad's QWEN_PLAN with qwen_engine.chunks().

const SR = 16000;

function fake(texts: string[], language: string | null = 'en') {
  const calls: [number, number][] = [];
  let i = 0;
  return {
    calls,
    decode: async (s: number, e: number): Promise<ChunkDecodeResult> => {
      calls.push([s, e - s]);
      return { text: texts[Math.min(i++, texts.length - 1)], language };
    },
  };
}

const two = (overlap: boolean): QwenChunk[] => [
  { start: 0, end: 400000, overlap: false },
  { start: 400000, end: 800000, overlap },
];

describe('qwen chunk plan (qwen_engine.chunks)', () => {
  it('uses short pauses and skips long silence with original offsets', () => {
    const speech = [
      { start: 0, end: 19 * SR },
      { start: Math.trunc(19.4 * SR), end: 40 * SR },
      { start: 60 * SR, end: 65 * SR },
    ];
    expect(planChunks(70 * SR, speech)).toEqual([
      { start: 0, end: Math.trunc(19.2 * SR), overlap: false },
      { start: Math.trunc(19.2 * SR), end: 40 * SR, overlap: false },
      { start: 60 * SR, end: 65 * SR, overlap: false },
    ]);
  });

  it('forces bounded chunks in continuous speech; VAD can be off; seconds=0 is rejected; silence plans nothing', () => {
    expect(planChunks(61 * SR, null)).toEqual([
      { start: 0, end: 25 * SR, overlap: false },
      { start: 25 * SR, end: 50 * SR, overlap: true },
      { start: 50 * SR, end: 61 * SR, overlap: true },
    ]);
    expect(() => planChunks(SR, null, 0)).toThrow(RangeError);
    expect(planChunks(16000, [])).toEqual([]);
  });

  it('engine/vad planWindows(QWEN_PLAN) gives the same plan as the literal port (2,000 random speech maps)', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    for (let n = 0; n < 2000; n++) {
      const segs: { start: number; end: number }[] = [];
      let t = Math.floor(rnd() * 3 * SR);
      const count = Math.floor(rnd() * 12);
      for (let k = 0; k < count; k++) {
        const len = 1 + Math.floor(rnd() * (rnd() < 0.2 ? 60 : 8) * SR);
        segs.push({ start: t, end: t + len });
        // gaps of at least one sample (the VAD's segments never touch with QWEN_VAD's 100 ms pad, see vad.md)
        t += len + 1 + Math.floor(rnd() * (rnd() < 0.3 ? 4 : 1.2) * SR);
      }
      const total = t + Math.floor(rnd() * SR);
      expect(chunksFromWindows(planWindows(segs, total, QWEN_PLAN))).toEqual(planChunks(total, segs));
    }
    // VAD off: the whole file as one interval
    expect(chunksFromWindows(planWindows([{ start: 0, end: 61 * SR }], 61 * SR, QWEN_PLAN))).toEqual(planChunks(61 * SR, null));
  });

  it('pads chunks shorter than 0.5 s with zeros (qwen_asr MIN_ASR_INPUT_SECONDS)', () => {
    const short = new Float32Array(1000).fill(0.5);
    const padded = padChunk(short);
    expect(padded.length).toBe(8000);
    expect(padded[999]).toBe(0.5);
    expect(padded[1000]).toBe(0);
    const long = new Float32Array(9000);
    expect(padChunk(long)).toBe(long);
  });
});

describe('qwen chunk loop (QwenEngine.transcribe)', () => {
  it('emits incremental chunks without fabricated word scores and removes exact overlaps', async () => {
    const m = fake(['तो student है।', 'तो student है। और आगे'], 'hi');
    const live: QwenSegment[] = [];
    const res = await transcribeChunks({
      totalSamples: 48000,
      plan: [
        { start: 0, end: 24000, overlap: false },
        { start: 24000, end: 48000, overlap: true },
      ],
      decode: m.decode,
      language: 'hi',
      onSegment: (s) => live.push(s),
    });
    expect(res.kind).toBe('done');
    expect(res.segments).toEqual(live);
    expect(live.map((s) => s.start)).toEqual([0, 1.5]);
    expect(live.every((s) => s.words === null && s.confidence === null && s.timing === 'chunk' && s.edited === false)).toBe(true);
    expect(live[1]).toMatchObject({
      id: 1,
      text: 'और आगे',
      original_text: 'और आगे',
      recognition_text: 'तो student है। और आगे',
      overlap_words_removed: 3,
      boundary_resolution: 'exact_overlap',
      review_reasons: [],
    });
    expect(live[1].overlap_recognition_text).toBeUndefined();
    expect(m.calls).toEqual([
      [0, 24000],
      [18000, 30000],
    ]);
  });

  it('re-decodes the non-overlapping audio when the overlap does not match (the Python test call positions)', async () => {
    const m = fake(['first short sentence', 'different continuation here']);
    const res = await transcribeChunks({ totalSamples: 800000, plan: two(true), decode: m.decode });
    expect(m.calls).toEqual([
      [0, 400000],
      [368000, 432000],
      [400000, 400000],
    ]);
    const s = res.segments[1];
    expect(s).toMatchObject({
      start: 25,
      text: 'different continuation here',
      boundary_resolution: 'audio_retry',
      review_reasons: ['boundary_retry'],
      overlap_recognition_text: 'different continuation here',
    });
  });

  it('never re-decodes or trims at a pause boundary (spoken repetitions stay)', async () => {
    const m = fake(['yes we can yes we can']);
    const res = await transcribeChunks({ totalSamples: 800000, plan: two(false), decode: m.decode });
    expect(m.calls.map((c) => c[1])).toEqual([400000, 400000]);
    expect(res.segments.every((s) => s.text === 'yes we can yes we can' && s.overlap_words_removed === 0)).toBe(true);
  });

  it.each([
    ['en', 'ask about quantum fields', 'quantum field and their properties', 'and their properties'],
    ['hi', 'अगले विषय पर बात करेंगे', 'विषय पर बात करें फिर आगे', 'फिर आगे'],
    ['es', 'vamos a estudiar física', 'estudiar física luego química', 'luego química'],
    ['en', 'hello नमस्ते API version', 'नमस्ते API versions then continue', 'then continue'],
  ])('retries audio without vocabulary guesses (%s)', async (language, first, overlapped, retry) => {
    const m = fake([first, overlapped, retry], language);
    const res = await transcribeChunks({ totalSamples: 800000, plan: two(true), decode: m.decode });
    const last = res.segments[res.segments.length - 1];
    expect(last.text).toBe(retry);
    expect(last.original_text).toBe(retry);
    expect(last.recognition_text).toBe(retry);
    expect(last.overlap_recognition_text).toBe(overlapped);
    expect(m.calls.map((c) => c[1])).toEqual([400000, 432000, 400000]);
  });

  it('a cancel after the overlapped inference prevents the boundary retry', async () => {
    let cancel = false;
    let calls = 0;
    const decode = async (): Promise<ChunkDecodeResult> => {
      calls++;
      if (calls === 2) cancel = true;
      return { text: calls === 2 ? 'unmatched continuation' : 'first passage', language: 'en' };
    };
    await expect(transcribeChunks({ totalSamples: 800000, plan: two(true), decode, shouldCancel: () => cancel })).rejects.toMatchObject({
      name: 'CancelledError',
    });
    expect(calls).toBe(2);
  });

  it('flags repeated phrases for review, skips empty chunks and keeps the first language', async () => {
    const texts = ['This is a test. This is a test. This is a test.', '', 'next part'];
    let i = 0;
    const langs = ['en', null, 'hi'];
    const decode = async (): Promise<ChunkDecodeResult> => ({ text: texts[i], language: langs[i++] });
    const romanize: (string | null)[] = [];
    const res = await transcribeChunks({
      totalSamples: 3 * 400000,
      plan: [
        { start: 0, end: 400000, overlap: false },
        { start: 400000, end: 800000, overlap: false },
        { start: 800000, end: 1200000, overlap: false },
      ],
      decode,
      onSegment: (_s, _p, info) => romanize.push(info.romanizeLanguage),
    });
    expect(res.segments.map((s) => [s.id, s.review_reasons])).toEqual([
      [0, ['repeated_phrase']],
      [1, []],
    ]);
    expect(res.kind === 'done' && res.language).toBe('en');
    // the Hinglish step uses `detected or language` per chunk, like qwen_engine
    expect(romanize).toEqual(['en', 'hi']);
  });

  it('hands back its state for a recycle and continues from it', async () => {
    const plan: QwenChunk[] = [
      { start: 0, end: 400000, overlap: false },
      { start: 400000, end: 800000, overlap: true },
      { start: 800000, end: 1200000, overlap: false },
    ];
    const m1 = fake(['one two three four']);
    const first = await transcribeChunks({ totalSamples: 1200000, plan, decode: m1.decode, recycleEvery: 1 });
    expect(first.kind).toBe('recycle');
    expect(first.state).toMatchObject({ next: 1, previousText: 'one two three four', emitted: 1, chunksDone: 1, language: 'en' });
    const m2 = fake(['two three four five', 'six']);
    const second = await transcribeChunks({ totalSamples: 1200000, plan, decode: m2.decode, state: first.state });
    expect(second.kind).toBe('done');
    // the overlap after the recycle still trims against the text from before it
    expect(second.segments.map((s) => [s.id, s.text, s.overlap_words_removed])).toEqual([
      [1, 'five', 3],
      [2, 'six', 0],
    ]);
  });
});
