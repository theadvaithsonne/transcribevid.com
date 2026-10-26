/**
 * Uncertainty marks and review prompts: the data contract between the engine and the transcript page
 * (frontend/src/app/features/job/transcript.ts:46-47, 152, 310 and job.ts:195-209; parity/engine.md EN-077).
 * "Model confidence is not a measured accuracy percentage": these are review hints, not accuracy.
 */
import type { Job, Segment, Word } from '../../core/models';
import { LOW_CONFIDENCE } from './stats';

/** transcript.ts:46 `LOW`: a word below this probability gets the strong underline */
export const WORD_LOW = 0.5;
/** transcript.ts:47 `MID`: a word below this probability gets the light underline */
export const WORD_MID = 0.75;
/** job.ts:202: the whole transcript is flagged below this average confidence */
export const AVG_CONFIDENCE_CONCERN = 0.6;
/** job.ts:205: auto-detected language below this probability asks the visitor to choose it */
export const LANGUAGE_PROBABILITY_CONCERN = 0.8;

export const REVIEW_MESSAGES = {
  noSpeech: 'No speech was transcribed. Check the recording and the selected language.',
  reviewReasons:
    'Some passages need a listening check because of repeated text or an uncertain speech boundary.',
  lowConfidence:
    'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.',
  uncertainLanguage:
    'The spoken language could not be identified confidently. Choose the language you hear and try again.',
} as const;

/** transcript.ts:310: underline level of a word. */
export function wordLevel(word: Pick<Word, 'probability'>): 'low' | 'mid' | undefined {
  if (word.probability < WORD_LOW) return 'low';
  if (word.probability < WORD_MID) return 'mid';
  return undefined;
}

/** transcript.ts:152 and formats.py:221: a segment below 0.6 confidence (null = no confidence, e.g. Qwen). */
export function isLowConfidence(segment: Pick<Segment, 'confidence'>): boolean {
  return segment.confidence != null && segment.confidence < LOW_CONFIDENCE;
}

/**
 * transcript.ts:154: the warning mark after a line: low confidence and no single word of it is underlined (there are
 * no word timings, or every word is above 0.75).
 */
export function segmentFlag(segment: Pick<Segment, 'confidence' | 'words'>): boolean {
  if (!isLowConfidence(segment)) return false;
  return !(segment.words ?? []).some((w) => wordLevel(w) !== undefined);
}

/** job.ts:195-209 `qualityConcern`: the first matching review prompt of a finished job, or ''. */
export function qualityConcern(
  job: Pick<Job, 'status' | 'segments' | 'stats' | 'language_probability'> & {
    options: Pick<Job['options'], 'language'>;
  },
): string {
  if (job.status !== 'done') return '';
  if (!job.segments.length) return REVIEW_MESSAGES.noSpeech;
  if (job.segments.some((s) => !s.edited && s.review_reasons?.length)) {
    return REVIEW_MESSAGES.reviewReasons;
  }
  if (job.stats?.avg_confidence != null && job.stats.avg_confidence < AVG_CONFIDENCE_CONCERN) {
    return REVIEW_MESSAGES.lowConfidence;
  }
  if (
    job.options.language == null &&
    job.language_probability != null &&
    job.language_probability < LANGUAGE_PROBABILITY_CONCERN
  ) {
    return REVIEW_MESSAGES.uncertainLanguage;
  }
  return '';
}
