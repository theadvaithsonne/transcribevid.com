/** backend/app/formats.py:26-36 `fmt_ts`. (The UI's fmtTime in core/format.ts floors and is a different formatter.) */
import { pyRound } from '../post/py';

export type TimestampStyle = 'short' | 'srt' | 'vtt';

const two = (n: number) => String(n).padStart(2, '0');

/** short: [h:]mm:ss   srt: hh:mm:ss,mmm   vtt: hh:mm:ss.mmm (milliseconds rounded half to even, negatives -> 0) */
export function fmtTs(sec: number, style: TimestampStyle = 'short'): string {
  const total = Math.max(0, pyRound(sec * 1000));
  const h = Math.floor(total / 3_600_000);
  let rem = total % 3_600_000;
  const m = Math.floor(rem / 60_000);
  rem %= 60_000;
  const s = Math.floor(rem / 1000);
  const ms = rem % 1000;
  if (style === 'srt') return `${two(h)}:${two(m)}:${two(s)},${String(ms).padStart(3, '0')}`;
  if (style === 'vtt') return `${two(h)}:${two(m)}:${two(s)}.${String(ms).padStart(3, '0')}`;
  return h ? `${h}:${two(m)}:${two(s)}` : `${two(m)}:${two(s)}`;
}
