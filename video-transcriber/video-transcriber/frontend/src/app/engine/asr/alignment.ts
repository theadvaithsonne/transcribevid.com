/**
 * Word timestamps from the cross-attention of the alignment heads: normalise per head and frame,
 * median filter over time, average the heads, DTW, then faster-whisper's duration clean-up and
 * punctuation merge. Pure functions over typed arrays; the engine supplies the tensors.
 */
import { dtw, median, medianFilterRows } from './dsp';

export const SAMPLE_RATE = 16000;
export const HOP_LENGTH = 160;
/** 20 ms per encoder frame. */
export const TOKENS_PER_SECOND = 50;
export const MAX_ENCODER_FRAMES = 1500;

export interface AlignedWord {
  word: string;
  tokens: number[];
  /** Indices into the text-token list. */
  idx: number[];
  start: number;
  end: number;
  probability: number;
}

/** Encoder frames that carry real audio (the rest of the 1500 is padding). */
export function encoderFramesFor(audioSeconds: number): number {
  const mel = Math.floor((audioSeconds * SAMPLE_RATE) / HOP_LENGTH);
  return Math.min(MAX_ENCODER_FRAMES, Math.max(1, Math.floor(mel / 2)));
}

/**
 * Probability of every text token under the teacher-forced logits. `logits` is [S, V] row-major;
 * the logits at position headLen - 1 + i predict text token i.
 */
export function tokenProbabilities(
  logits: Float32Array,
  vocab: number,
  headLen: number,
  textTokens: number[],
): Float32Array {
  const n = textTokens.length;
  const probs = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const pos = headLen - 1 + i;
    const row = logits.subarray(pos * vocab, pos * vocab + vocab);
    let max = -Infinity;
    for (let j = 0; j < vocab; j++) if (row[j] > max) max = row[j];
    let sum = 0;
    for (let j = 0; j < vocab; j++) sum += Math.exp(row[j] - max);
    probs[i] = Math.exp(row[textTokens[i]] - max) / sum;
  }
  return probs;
}

export interface CrossAttentionLayer {
  /** [heads, S, cols] row-major float32 of one decoder layer. */
  data: Float32Array;
  cols: number;
}

/**
 * Builds the negated, head-averaged alignment cost matrix (rows x encFrames) from the cross-attention
 * weights. `rows` = text tokens + 1 (the <|notimestamps|> position first); `r0` is the sequence
 * position of that first row; `S` the full teacher-forced sequence length.
 */
export function alignmentCost(
  layers: Map<number, CrossAttentionLayer>,
  heads: Array<[number, number]>,
  S: number,
  r0: number,
  rows: number,
  encFrames: number,
  medianWidth: number,
): Float32Array {
  const weights = new Float32Array(heads.length * rows * encFrames);
  heads.forEach(([l, h], hi) => {
    const lc = layers.get(l);
    if (!lc)
      throw new Error(`decoder did not return cross_attentions.${l}: use a *_timestamped repo`);
    for (let r = 0; r < rows; r++) {
      const src = (h * S + (r0 + r)) * lc.cols;
      const dst = (hi * rows + r) * encFrames;
      for (let c = 0; c < encFrames; c++) weights[dst + c] = lc.data[src + c];
    }
  });
  for (let hi = 0; hi < heads.length; hi++) {
    const hbase = hi * rows * encFrames;
    for (let c = 0; c < encFrames; c++) {
      let mean = 0;
      for (let r = 0; r < rows; r++) mean += weights[hbase + r * encFrames + c];
      mean /= rows;
      let v = 0;
      for (let r = 0; r < rows; r++) {
        const d = weights[hbase + r * encFrames + c] - mean;
        v += d * d;
      }
      const sd = Math.sqrt(v / rows) || 1e-9;
      for (let r = 0; r < rows; r++) {
        weights[hbase + r * encFrames + c] = (weights[hbase + r * encFrames + c] - mean) / sd;
      }
    }
  }
  const filtered = medianFilterRows(weights, heads.length * rows, encFrames, medianWidth);
  const matrix = new Float32Array(rows * encFrames);
  for (let hi = 0; hi < heads.length; hi++) {
    for (let i = 0; i < rows * encFrames; i++) matrix[i] += filtered[hi * rows * encFrames + i];
  }
  for (let i = 0; i < matrix.length; i++) matrix[i] = -matrix[i] / heads.length;
  return matrix;
}

/** DTW over the cost matrix -> the time (s) at which each text row starts. */
export function jumpTimes(matrix: Float32Array, rows: number, encFrames: number): number[] {
  const path = dtw(matrix, rows, encFrames);
  const out: number[] = [];
  for (let i = 0; i < path.textIndices.length; i++) {
    if (i === 0 || path.textIndices[i] !== path.textIndices[i - 1]) {
      out.push(path.timeIndices[i] / TOKENS_PER_SECOND);
    }
  }
  return out;
}

export interface WordGroups {
  /** Word strings (the last one is the <|endoftext|> sentinel). */
  words: string[];
  tokens: number[][];
  indices: number[][];
}

/** Word groups + jump times + token probabilities -> words with start / end / probability. */
export function wordsFromJumps(
  groups: WordGroups,
  jumps: number[],
  probs: Float32Array,
): AlignedWord[] {
  const out: AlignedWord[] = [];
  const lastJump = jumps[jumps.length - 1];
  for (let w = 0; w < groups.words.length - 1; w++) {
    const idx = groups.indices[w];
    const start = jumps[idx[0]] ?? lastJump;
    const end = jumps[idx[idx.length - 1] + 1] ?? lastJump;
    let p = 0;
    for (const i of idx) p += probs[i];
    out.push({
      word: groups.words[w],
      tokens: groups.tokens[w],
      idx,
      start,
      end,
      probability: p / idx.length,
    });
  }
  return out;
}

const SENTENCE_END_MARKS = '.。!！?？';

/** faster-whisper's duration clean-up: sentence-end marks (still separate words) must not swallow pauses. */
export function cleanWordDurations(words: AlignedWord[]): AlignedWord[] {
  const durations = words.map((w) => w.end - w.start).filter((d) => d > 0);
  if (!durations.length) return words;
  const maxDur = Math.min(0.7, median(durations)) * 2;
  for (let i = 1; i < words.length; i++) {
    if (words[i].end - words[i].start > maxDur) {
      const cur = words[i].word.trim();
      const prev = words[i - 1].word.trim();
      if (cur && SENTENCE_END_MARKS.includes(cur)) words[i].end = words[i].start + maxDur;
      else if (prev && SENTENCE_END_MARKS.includes(prev)) words[i].start = words[i].end - maxDur;
    }
  }
  return words;
}

const PREPENDED = '"\'“¡¿([{-';
const APPENDED = '"\'.。,，!！?？:：”)]}、';

/**
 * faster-whisper `merge_punctuations`: punctuation is glued to the neighbouring word's text and tokens
 * only. The word keeps its own start / end / probability on purpose: a trailing "." is aligned to the
 * pause after the word, so extending the word to it would make every word before a pause late.
 */
export function mergePunctuation(words: AlignedWord[]): AlignedWord[] {
  const w = words.map((x) => ({ ...x, tokens: [...x.tokens], idx: [...x.idx] }));
  let i = w.length - 2;
  let j = w.length - 1;
  while (i >= 0) {
    const pw = w[i].word;
    if (pw.startsWith(' ') && pw.trim() && PREPENDED.includes(pw.trim())) {
      w[j].word = pw + w[j].word;
      w[j].tokens = [...w[i].tokens, ...w[j].tokens];
      w[j].idx = [...w[i].idx, ...w[j].idx];
      w[i].word = '';
      w[i].tokens = [];
      w[i].idx = [];
    } else j = i;
    i--;
  }
  i = 0;
  j = 1;
  while (j < w.length) {
    if (!w[i].word.endsWith(' ') && w[j].word && APPENDED.includes(w[j].word)) {
      w[i].word += w[j].word;
      w[i].tokens = [...w[i].tokens, ...w[j].tokens];
      w[i].idx = [...w[i].idx, ...w[j].idx];
      w[j].word = '';
      w[j].tokens = [];
      w[j].idx = [];
    } else i = j;
    j++;
  }
  return w.filter((x) => x.word);
}
