import { DEFAULT_OPTIONS, type Job, type Segment } from '../../core/models';
import { convertSegmentBasic, type Segment as HinglishSegment } from '../hinglish/hinglish';
import { POST_GOLDENS, type GoldenCase } from './post-goldens';
import {
  addWordTimestamps,
  applyEdits,
  avgLogprobFromScore,
  cleanTitle,
  computeStats,
  deflatedSize,
  etaSeconds,
  fixNumberText,
  generateWithFallback,
  generateWithFallbackAsync,
  hallucinationGuard,
  isLowConfidence,
  isSegmentAnomaly,
  mergeNumberPieces,
  mergePunctuations,
  norm,
  postprocessSegments,
  pyFloatRepr,
  pyJsonDumps,
  pyLen,
  pyRound,
  pyStrip,
  qualityConcern,
  recognitionResult,
  REVIEW_MESSAGES,
  restoreSpeechTimestamps,
  segmentDict,
  segmentFlag,
  SegmentFilter,
  shouldSkipWindow,
  storedProgress,
  wordAnomalyScore,
  wordLevel,
} from './index';

/** Golden cases written by backend/tools/dump_engine_goldens.py from the production Python code. */
const golden = (group: string): GoldenCase[] => {
  const cases = POST_GOLDENS[group];
  if (!cases?.length) throw new Error(`no golden cases for ${group}`);
  return cases;
};

const hinglishBasic = (seg: Segment) =>
  convertSegmentBasic(seg as unknown as HinglishSegment) as unknown as Segment;

describe('Python helpers', () => {
  describe('pyRound and pyFloatRepr match round() and repr()', () => {
    for (const c of golden('round')) {
      it(c.name, () => {
        if (c.input.repr) expect(pyFloatRepr(c.input.x)).toBe(c.expected);
        else if (c.input.n) expect(pyRound(c.input.x, c.input.n)).toEqual(c.expected);
        else expect(pyRound(c.input.x)).toEqual(c.expected);
      });
    }
  });

  it('measures and strips like Python', () => {
    expect(pyLen('😀ab')).toBe(3);
    expect(pyStrip('\u0085 x \u001f')).toBe('x');
    expect(pyStrip('﻿x')).toBe('﻿x');
  });

  it('dumps JSON like json.dumps(ensure_ascii=False, indent=2)', () => {
    expect(pyJsonDumps({ start: 0, end: 2.5, id: 3, a: [], b: {}, t: 'é"\n\u0001' })).toBe(
      '{\n  "start": 0.0,\n  "end": 2.5,\n  "id": 3,\n  "a": [],\n  "b": {},\n  "t": "é\\"\\n\\u0001"\n}',
    );
  });
});

describe('text normalisation (engine.py)', () => {
  describe('_norm', () => {
    for (const c of golden('norm')) it(c.name, () => expect(norm(c.input)).toBe(c.expected));
  });

  describe('fix_number_text', () => {
    for (const c of golden('fix_number_text')) {
      it(c.name, () => expect(fixNumberText(c.input)).toBe(c.expected));
    }
  });

  describe('merge_number_pieces', () => {
    for (const c of golden('merge_number_pieces')) {
      it(c.name, () => {
        const before = structuredClone(c.input.words);
        expect(mergeNumberPieces(c.input.words, c.input.text)).toEqual(c.expected);
        expect(c.input.words).toEqual(before);
      });
    }
  });
});

describe('segments (engine.py _segment_dict / _recognise)', () => {
  describe('_segment_dict', () => {
    for (const c of golden('segment_dict')) {
      it(c.name, () => expect(segmentDict(c.input.idx, c.input.segment)).toEqual(c.expected));
    }
  });

  describe('the filter pipeline', () => {
    for (const c of golden('pipeline')) {
      it(c.name, () => {
        const inp = c.input;
        const options = { ...DEFAULT_OPTIONS, ...inp.options };
        const out = postprocessSegments(inp.segments, {
          options,
          language: inp.language,
          duration: inp.duration,
          convert: hinglishBasic,
        });
        expect(
          recognitionResult(inp.language, inp.language_probability, inp.duration, out.segments),
        ).toEqual(c.expected.result);
        expect(out.dropped).toEqual(c.expected.dropped);
        expect(out.progress).toEqual(c.expected.progress);
      });
    }
  });

  it('reports the dropped counts in the server log format', () => {
    const f = new SegmentFilter();
    const raw = { start: 0, end: 1, text: ' x ', words: null, avg_logprob: -0.1, no_speech_prob: 0 };
    for (let i = 0; i < 5; i++) f.accept(raw);
    f.accept({ ...raw, text: '  ' });
    expect(f.summary()).toBe('filtered out segments: empty=1, repetition=2');
  });
});

describe('decoding guards (faster-whisper transcribe.py)', () => {
  describe('generate_with_fallback', () => {
    for (const c of golden('fallback')) {
      it(c.name, async () => {
        const attempts = c.input.attempts;
        const decode = (_t: number, i: number) => {
          const a = attempts[i];
          return {
            index: i,
            avgLogprob: avgLogprobFromScore(a.score, a.seq_len),
            compressionRatio: a.compression_ratio,
            noSpeechProb: a.no_speech_prob,
          };
        };
        for (const r of [
          generateWithFallback(decode),
          await generateWithFallbackAsync(async (t, i) => decode(t, i)),
        ]) {
          expect(r.result.index).toBe(c.expected.chosen);
          expect(r.result.avgLogprob).toBe(c.expected.avg_logprob);
          expect(r.result.compressionRatio).toBe(c.expected.compression_ratio);
          expect(r.temperature).toBe(c.expected.temperature);
          expect(r.tried).toBe(c.expected.tried);
        }
      });
    }
  });

  describe('get_compression_ratio (zlib through CompressionStream)', () => {
    for (const c of golden('compression')) {
      it.skipIf(typeof CompressionStream === 'undefined')(c.name, async () => {
        const bytes = new TextEncoder().encode(c.input);
        expect(bytes.length).toBe(c.expected.bytes);
        // zlib builds may pick other matches; parity/engine.md EN-035 note 3 allows a few bytes
        expect(Math.abs((await deflatedSize(bytes)) - c.expected.compressed)).toBeLessThanOrEqual(3);
      });
    }
  });

  describe('no-speech window skip', () => {
    for (const c of golden('window_skip')) {
      it(c.name, () => {
        const skip = shouldSkipWindow(c.input.no_speech_prob, c.input.avg_logprob);
        expect(skip).toBe(c.expected.skip);
        expect(skip ? c.input.seek + c.input.segment_size : c.input.seek).toBe(c.expected.seek);
      });
    }
  });

  describe('word / segment anomaly', () => {
    for (const c of golden('anomaly')) {
      it(c.name, () => {
        const words = c.input ?? [];
        expect(words.map(wordAnomalyScore)).toEqual(c.expected.scores);
        expect(isSegmentAnomaly(c.input === null ? null : { words })).toBe(c.expected.anomaly);
      });
    }
  });

  describe('hallucination-silence guard', () => {
    for (const c of golden('hallucination')) {
      it(c.name, () => {
        const i = c.input;
        const r = hallucinationGuard({
          segments: i.segments,
          timeOffset: i.time_offset,
          segmentDuration: i.segment_duration,
          windowEndTime: i.window_end_time,
          contentDuration: i.content_duration,
          contentFrames: i.content_frames,
          previousSeek: i.previous_seek,
          seek: i.seek,
          lastSpeechTimestamp: i.last_speech_timestamp,
        });
        expect(r.skipWindow).toBe(c.expected.skip_window);
        expect(r.seek).toBe(c.expected.seek);
        expect(r.segments).toEqual(c.expected.segments);
        expect(r.lastSpeechTimestamp).toBe(c.expected.last_speech_timestamp);
      });
    }
  });
});

describe('word timing (faster-whisper transcribe.py, vad.py)', () => {
  describe('merge_punctuations', () => {
    for (const c of golden('merge_punctuations')) {
      it(c.name, () => {
        const alignment = structuredClone(c.input);
        mergePunctuations(alignment);
        expect(alignment).toEqual(c.expected);
      });
    }
  });

  describe('add_word_timestamps clean-up', () => {
    for (const c of golden('word_timestamps')) {
      it(c.name, () => {
        const r = addWordTimestamps(c.input.subsegments, c.input.alignment, c.input.last_speech_timestamp, {
          eot: c.input.eot,
        });
        expect(r.subsegments).toEqual(c.expected.subsegments);
        expect(r.lastSpeechTimestamp).toBe(c.expected.last_speech_timestamp);
      });
    }
  });

  describe('restore_speech_timestamps', () => {
    for (const c of golden('restore')) {
      it(c.name, () => {
        const r = restoreSpeechTimestamps(c.input.segments, c.input.chunks, c.input.sampling_rate);
        expect(r.map((s) => ({ start: s.start, end: s.end, words: s.words }))).toEqual(c.expected);
      });
    }
  });
});

describe('stats and keywords (formats.py compute_stats)', () => {
  for (const c of golden('stats')) {
    it(c.name, () => expect(computeStats(c.input.segments, c.input.duration)).toEqual(c.expected));
  }
});

describe('edits and rename (jobs.py)', () => {
  describe('update_segments', () => {
    for (const c of golden('edits')) {
      it(c.name, () => {
        const before = structuredClone(c.input.segments);
        const r = applyEdits(c.input.segments, c.input.edits, c.input.duration);
        expect(r.segments).toEqual(c.expected.segments);
        expect(r.segment_count).toBe(c.expected.segment_count);
        expect(r.stats).toEqual(c.expected.stats);
        expect(c.input.segments).toEqual(before);
      });
    }
  });

  describe('update_title', () => {
    for (const c of golden('title')) {
      it(c.name, () => expect(cleanTitle(c.input.title, c.input.previous)).toBe(c.expected));
    }
  });

  it('computes the ETA only after 3 % and 3 s, rounded half to even', () => {
    expect(etaSeconds(10, 0.02)).toBeNull();
    expect(etaSeconds(3, 0.5)).toBeNull();
    expect(etaSeconds(10, 0.5)).toBe(10);
    expect(etaSeconds(3.5, 0.25)).toBe(10); // 10.5 -> 10
    expect(etaSeconds(4.5, 0.25)).toBe(14); // 13.5 -> 14
    expect(storedProgress(0.123456)).toBe(0.1235);
  });
});

describe('review marks and prompts (transcript.ts, job.ts)', () => {
  const seg = (extra: Partial<Segment>): Segment => ({
    id: 0,
    start: 0,
    end: 1,
    text: 'x',
    words: null,
    confidence: 0.9,
    ...extra,
  });
  const job = (extra: Partial<Job>) => ({
    status: 'done' as const,
    segments: [seg({})],
    stats: null,
    language_probability: 0.99,
    options: { ...DEFAULT_OPTIONS },
    ...extra,
  });

  it('underlines words below 0.5 / 0.75 and flags low-confidence lines without marks', () => {
    expect([0.49, 0.5, 0.74, 0.75].map((probability) => wordLevel({ probability }))).toEqual([
      'low',
      'mid',
      'mid',
      undefined,
    ]);
    expect(isLowConfidence(seg({ confidence: 0.59 }))).toBe(true);
    expect(isLowConfidence(seg({ confidence: null }))).toBe(false);
    expect(segmentFlag(seg({ confidence: 0.5 }))).toBe(true);
    const marked = [{ start: 0, end: 1, word: ' x', probability: 0.3 }];
    expect(segmentFlag(seg({ confidence: 0.5, words: marked }))).toBe(false);
  });

  it('picks the first matching review prompt', () => {
    expect(qualityConcern(job({ status: 'running' }))).toBe('');
    expect(qualityConcern(job({ segments: [] }))).toBe(REVIEW_MESSAGES.noSpeech);
    expect(qualityConcern(job({ segments: [seg({ review_reasons: ['boundary_retry'] })] }))).toBe(
      REVIEW_MESSAGES.reviewReasons,
    );
    expect(
      qualityConcern(job({ segments: [seg({ review_reasons: ['repeated_phrase'], edited: true })] })),
    ).toBe('');
    const stats = computeStats([seg({ confidence: 0.38 })]);
    expect(qualityConcern(job({ stats }))).toBe(REVIEW_MESSAGES.lowConfidence);
    expect(qualityConcern(job({ language_probability: 0.55 }))).toBe(REVIEW_MESSAGES.uncertainLanguage);
    expect(
      qualityConcern(job({ language_probability: 0.4, options: { ...DEFAULT_OPTIONS, language: 'en' } })),
    ).toBe('');
  });
});
