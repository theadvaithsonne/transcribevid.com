/**
 * Transcript edits, rename and live ETA of backend/app/jobs.py, as pure functions over the stored data.
 */
import type { Segment, SegmentEdit, Stats } from '../../core/models';
import { pyRound, pySlice, pyStrip } from './py';
import { computeStats } from './stats';

/** jobs.py:438 `max(s.start + 0.1, end)`: an edited line lasts at least 0.1 s */
export const MIN_EDITED_DURATION = 0.1;
/** jobs.py:410 `title.strip()[:200]` */
export const MAX_TITLE_LENGTH = 200;
/** jobs.py:536: an ETA only after 3 % progress and 3 s of transcribing */
export const ETA_MIN_PROGRESS = 0.03;
export const ETA_MIN_ELAPSED = 3;

export interface EditResult<S> {
  segments: S[];
  segment_count: number;
  stats: Stats;
  changed: number;
  removed: number;
}

/**
 * jobs.py:415-445 `update_segments` (the caller checks status == 'done' first: 'The transcript is not finished
 * yet.'). Unknown ids are ignored, deleted ids dropped, ids are not renumbered. A changed text drops the word timings
 * and marks the line `edited` (confidence and original_text stay); start / end are applied even when only the times
 * changed. A missing or null start / end keeps the stored value (the API sends model_dump(exclude_none=True)).
 * Returns copies; the inputs are not modified.
 */
export function applyEdits<S extends Segment>(
  segments: readonly S[],
  edits: readonly SegmentEdit[],
  duration: number | null = null,
): EditResult<S> {
  const byId = new Map<number, SegmentEdit>();
  for (const e of edits) byId.set(e.id, e);
  const out: S[] = [];
  let changed = 0;
  let removed = 0;
  for (const source of segments) {
    const e = byId.get(source.id);
    if (e && e.deleted) {
      removed += 1;
      continue;
    }
    const s = { ...source };
    if (e) {
      const text = pyStrip(e.text);
      if (text !== s.text) {
        s.text = text;
        s.words = null;
        s.edited = true;
        changed += 1;
      }
      s.start = Math.max(0.0, e.start ?? s.start);
      s.end = Math.max(s.start + MIN_EDITED_DURATION, e.end ?? s.end);
    }
    out.push(s);
  }
  return { segments: out, segment_count: out.length, stats: computeStats(out, duration), changed, removed };
}

/** jobs.py:410: trimmed, at most 200 characters; a blank title keeps the previous one. */
export function cleanTitle(title: string, previous: string): string {
  return pySlice(pyStrip(title), MAX_TITLE_LENGTH) || previous;
}

/** jobs.py:534 `round(progress, 4)`: the progress value the job stores. */
export function storedProgress(progress: number): number {
  return pyRound(progress, 4);
}

/** jobs.py:535-536: seconds left from the time spent transcribing and the progress, or null while unknown. */
export function etaSeconds(elapsed: number, progress: number): number | null {
  return progress > ETA_MIN_PROGRESS && elapsed > ETA_MIN_ELAPSED
    ? pyRound(elapsed / progress - elapsed)
    : null;
}
