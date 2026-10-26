import {
  AlignedWord,
  alignmentCost,
  cleanWordDurations,
  CrossAttentionLayer,
  encoderFramesFor,
  jumpTimes,
  mergePunctuation,
  tokenProbabilities,
  wordsFromJumps,
} from './alignment';

const word = (w: string, start: number, end: number, probability = 0.9, t = [0]): AlignedWord => ({
  word: w,
  tokens: [...t],
  idx: [...t],
  start,
  end,
  probability,
});

describe('encoderFramesFor', () => {
  it('crops the 1500 encoder frames to the real audio (20 ms per frame)', () => {
    expect(encoderFramesFor(30)).toBe(1500);
    expect(encoderFramesFor(31)).toBe(1500);
    expect(encoderFramesFor(22.74)).toBe(1137);
    expect(encoderFramesFor(0.001)).toBe(1);
  });
});

describe('tokenProbabilities', () => {
  it('reads the probability of each text token from the position before it', () => {
    const V = 4;
    const headLen = 2;
    const text = [3, 1];
    const S = headLen + text.length + 1;
    const logits = new Float32Array(S * V);
    // position headLen - 1 predicts text[0]; give it 3x the weight of each other token -> p = 0.5
    logits[(headLen - 1) * V + 3] = Math.log(3);
    logits[headLen * V + 1] = 10;
    const p = tokenProbabilities(logits, V, headLen, text);
    expect(p[0]).toBeCloseTo(0.5, 6);
    expect(p[1]).toBeCloseTo(Math.exp(10) / (Math.exp(10) + 3), 6);
  });
});

describe('alignmentCost + jumpTimes', () => {
  // 3 text tokens + eot after a 4-token head; row k of the alignment attends frames 5k..5k+4
  const headLen = 4;
  const n = 3;
  const S = headLen + n + 1;
  const rows = n + 1;
  const frames = 20;
  const cols = 24;
  function layer(heads: number): CrossAttentionLayer {
    const data = new Float32Array(heads * S * cols).fill(0.01);
    for (let h = 0; h < heads; h++) {
      for (let r = 0; r < rows; r++) {
        for (let c = 5 * r; c < 5 * r + 5; c++) data[(h * S + headLen - 1 + r) * cols + c] = 0.9;
      }
    }
    return { data, cols };
  }

  it('recovers where each token starts (DTW over the head-averaged, filtered attention)', () => {
    const layers = new Map([[2, layer(2)]]);
    const heads: Array<[number, number]> = [
      [2, 0],
      [2, 1],
    ];
    const m = alignmentCost(layers, heads, S, headLen - 1, rows, frames, 7);
    expect(m.length).toBe(rows * frames);
    // cost is low (negative) on the attended block
    expect(m[0 * frames + 2]).toBeLessThan(m[1 * frames + 2]);
    expect(jumpTimes(m, rows, frames)).toEqual([0, 0.1, 0.2, 0.3]);
  });

  it('names the missing layer when the export has no cross attentions', () => {
    expect(() => alignmentCost(new Map(), [[1, 0]], S, 3, rows, frames, 7)).toThrow(
      /cross_attentions\.1.*_timestamped/,
    );
  });
});

describe('wordsFromJumps', () => {
  it('gives each word the start of its first token and the start of the next token as end', () => {
    const groups = {
      words: [' Hi', ' there', '.', '<|endoftext|>'],
      tokens: [[10], [11, 12], [13], [50257]],
      indices: [[0], [1, 2], [3], [4]],
    };
    const jumps = [0, 0.3, 0.5, 0.9, 1.0];
    const probs = Float32Array.from([0.9, 0.8, 0.6, 0.99, 1]);
    const words = wordsFromJumps(groups, jumps, probs);
    expect(words.map((w) => [w.word, w.start, w.end])).toEqual([
      [' Hi', 0, 0.3],
      [' there', 0.3, 0.9],
      ['.', 0.9, 1.0],
    ]);
    expect(words[1].probability).toBeCloseTo(0.7, 6);
    expect(words[1].tokens).toEqual([11, 12]);
  });
});

describe('cleanWordDurations', () => {
  it('caps a sentence-end mark that swallowed the pause, and the word after it', () => {
    const words = [
      word(' one', 0, 0.2),
      word(' two', 0.2, 0.4),
      word('.', 0.4, 2.4),
      word(' Three', 2.4, 4.0),
      word(' four', 4.0, 4.2),
    ];
    cleanWordDurations(words);
    // median duration 0.2 -> max 0.4
    expect(words[2].end).toBeCloseTo(0.8, 6);
    expect(words[3].start).toBeCloseTo(3.6, 6);
    expect(words[4]).toEqual(word(' four', 4.0, 4.2));
  });

  it('leaves ordinary long words alone', () => {
    const words = [word(' a', 0, 0.2), word(' b', 0.2, 0.4), word(' longword', 0.4, 2)];
    cleanWordDurations(words);
    expect(words[2].end).toBe(2);
  });
});

describe('mergePunctuation', () => {
  it('glues punctuation to the word text and tokens but keeps the word times', () => {
    const merged = mergePunctuation([
      word(' Hello', 0, 0.5, 0.9, [1]),
      word(',', 0.5, 0.9, 0.5, [2]),
      word(' world', 0.9, 1.3, 0.8, [3]),
      word('.', 1.3, 2.0, 0.4, [4]),
    ]);
    expect(merged.map((w) => [w.word, w.start, w.end, w.probability, w.tokens])).toEqual([
      [' Hello,', 0, 0.5, 0.9, [1, 2]],
      [' world.', 0.9, 1.3, 0.8, [3, 4]],
    ]);
  });

  it('prepends opening marks to the next word', () => {
    const merged = mergePunctuation([
      word(' (', 0, 0.1, 0.9, [1]),
      word('aside', 0.1, 0.5, 0.8, [2]),
      word(')', 0.5, 0.6, 0.7, [3]),
    ]);
    expect(merged.map((w) => [w.word, w.start, w.end, w.tokens])).toEqual([
      [' (aside)', 0.1, 0.5, [1, 2, 3]],
    ]);
  });
});
