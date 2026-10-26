import {
  applyLogitRules,
  DEFAULT_TOKEN_IDS,
  LogitRuleOptions,
  languageProbabilities,
} from './logits';

const ids = DEFAULT_TOKEN_IDS;
const V = ids.tsBegin + 1501; // multilingual vocabulary: 51865
const ts = (s: number) => ids.tsBegin + Math.round(s / 0.02);
const A = 100;
const B = 200;
const rules = (o: Partial<LogitRuleOptions> = {}): LogitRuleOptions => ({
  timestamps: true,
  repetitionPenalty: 1,
  noRepeatNgram: 0,
  suppress: [],
  beginSuppress: [220, ids.eot],
  maxInitialTimestampIndex: 50,
  ...o,
});
const row = () => new Float32Array(V);
const allowed = (r: Float32Array, from: number, to: number) => {
  for (let t = from; t < to; t++) if (r[t] === -Infinity) return false;
  return true;
};
const masked = (r: Float32Array, from: number, to: number) => {
  for (let t = from; t < to; t++) if (r[t] !== -Infinity) return false;
  return true;
};

describe('applyLogitRules: timestamp rules (OpenAI / faster-whisper)', () => {
  it('starts with a timestamp no later than max_initial_timestamp (1.00 s)', () => {
    const r = row();
    applyLogitRules(r, [], true, ids, rules());
    expect(masked(r, 0, ids.tsBegin)).toBe(true);
    expect(allowed(r, ts(0), ts(1.0) + 1)).toBe(true);
    expect(masked(r, ts(1.0) + 1, V)).toBe(true);
  });

  it('lets timestamps only move forward after text', () => {
    const r = row();
    r[A] = 10; // a confident text token, so the timestamp-mass rule does not force a timestamp
    applyLogitRules(r, [ts(0.5), A], false, ids, rules());
    expect(masked(r, ids.tsBegin, ts(0.5) + 1)).toBe(true);
    expect(allowed(r, ts(0.52), V)).toBe(true);
    expect(r[A]).toBe(10);
    expect(r[ids.noTimestamps]).toBe(-Infinity);
  });

  it('after text + one timestamp: another timestamp (not earlier) or the end, never text', () => {
    const r = row();
    r[ids.eot] = 10;
    applyLogitRules(r, [ts(0), A, ts(1.0)], false, ids, rules());
    expect(masked(r, 0, ids.eot)).toBe(true);
    expect(r[ids.eot]).toBe(10);
    expect(masked(r, ids.tsBegin, ts(1.0))).toBe(true);
    expect(allowed(r, ts(1.0), V)).toBe(true);
  });

  it('after a timestamp pair: text (or the end), never a third timestamp', () => {
    const r = row();
    applyLogitRules(r, [ts(0), A, ts(1.0), ts(1.0)], false, ids, rules());
    expect(masked(r, ids.tsBegin, V)).toBe(true);
    expect(r[A]).toBe(0);
  });

  it('forces a timestamp when the timestamps together are more likely than any text token', () => {
    const r = row();
    r.fill(2, ids.tsBegin);
    r[A] = 3;
    applyLogitRules(r, [ts(0), B], false, ids, rules());
    expect(masked(r, 0, ids.tsBegin)).toBe(true);

    const r2 = row();
    r2.fill(2, ids.tsBegin);
    r2[A] = 15;
    applyLogitRules(r2, [ts(0), B], false, ids, rules());
    expect(r2[A]).toBe(15);
  });

  it('masks every timestamp and <|notimestamps|> when timestamps are off', () => {
    const r = row();
    applyLogitRules(r, [A], false, ids, rules({ timestamps: false }));
    expect(masked(r, ids.tsBegin, V)).toBe(true);
    expect(r[ids.noTimestamps]).toBe(-Infinity);
    expect(r[A]).toBe(0);
  });
});

describe('applyLogitRules: suppression and repetition controls', () => {
  it('applies suppress_tokens always and begin_suppress_tokens on the first step only', () => {
    const first = row();
    applyLogitRules(first, [], true, ids, rules({ timestamps: false, suppress: [7] }));
    expect([first[7], first[220], first[ids.eot]]).toEqual([-Infinity, -Infinity, -Infinity]);
    const later = row();
    applyLogitRules(later, [A], false, ids, rules({ timestamps: false, suppress: [7] }));
    expect([later[7], later[220], later[ids.eot]]).toEqual([-Infinity, 0, 0]);
  });

  it('repetition penalty divides positive and multiplies negative logits of seen tokens', () => {
    const r = row();
    r[A] = 2.6;
    r[B] = -1;
    applyLogitRules(r, [A, B, A], false, ids, rules({ timestamps: false, repetitionPenalty: 1.3 }));
    expect(r[A]).toBeCloseTo(2, 6);
    expect(r[B]).toBeCloseTo(-1.3, 6);
  });

  it('no_repeat_ngram_size bans the token that would repeat an n-gram', () => {
    const r = row();
    applyLogitRules(r, [A, B, 300, A], false, ids, rules({ timestamps: false, noRepeatNgram: 2 }));
    expect(r[B]).toBe(-Infinity);
    expect(r[300]).toBe(0);
  });
});

describe('languageProbabilities', () => {
  it('is a softmax over the language tokens only, codes without the brackets, descending', () => {
    const r = row();
    r[50259] = 3;
    r[50265] = 2;
    r[50261] = 1;
    r[A] = 50; // not a language token: ignored
    const p = languageProbabilities(r, { '<|en|>': 50259, '<|de|>': 50261, '<|fr|>': 50265 });
    const z = Math.exp(3) + Math.exp(2) + Math.exp(1);
    expect(p.map(([c]) => c)).toEqual(['en', 'fr', 'de']);
    expect(p[0][1]).toBeCloseTo(Math.exp(3) / z, 6);
    expect(p.reduce((s, [, v]) => s + v, 0)).toBeCloseTo(1, 6);
  });
});
