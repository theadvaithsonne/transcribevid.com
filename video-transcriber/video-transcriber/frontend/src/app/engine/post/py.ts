/**
 * Python semantics that change output when ported naively (docs/in-browser/parity/engine.md section 0): banker's
 * rounding on the exact binary value, code-point lengths, Python's whitespace set, float repr and json.dumps.
 * Everything in engine/post and engine/export that rounds, measures or prints goes through these helpers.
 */

/**
 * The characters Python's str.isspace() accepts; str.strip(), str.split() and the re classes \s / \S use the same set.
 * JS differs: String.prototype.trim also strips U+FEFF and keeps U+001C..U+001F and U+0085.
 */
export const PY_SPACE =
  '\\t\\n\\v\\f\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000';

const STRIP_RE = new RegExp(`^[${PY_SPACE}]+|[${PY_SPACE}]+$`, 'gu');
/** re.findall(r"\S+", text) */
export const PY_NON_SPACE_RUNS = new RegExp(`[^${PY_SPACE}]+`, 'gu');
/** re.sub(r"\s+", " ", text) */
export const PY_SPACE_RUNS = new RegExp(`[${PY_SPACE}]+`, 'gu');

/** str.strip() with no argument. */
export function pyStrip(text: string): string {
  return text.replace(STRIP_RE, '');
}

/** len(str): code points, not UTF-16 units (an emoji counts 1, as in Python). */
export function pyLen(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

/** text[:n] in code points. */
export function pySlice(text: string, n: number): string {
  return [...text].slice(0, n).join('');
}

/**
 * Python's round(). With `ndigits` (round(x, n)) the result is a float rounded half to even on the EXACT binary value
 * (round(2.675, 2) == 2.67, round(0.125, 2) == 0.12); without it (round(x)) an integer, half to even
 * (round(2.5) == 2, round(-0.5) == 0). Math.round and toFixed do not do this.
 */
export function pyRound(x: number, ndigits?: number): number {
  if (!Number.isFinite(x)) return x;
  if (x === 0) return ndigits === undefined ? 0 : x;
  const neg = x < 0;
  const ax = Math.abs(x);
  if (ax >= 2 ** 52) return x; // already an integer; round() returns it unchanged
  const n = ndigits ?? 0;
  // toFixed(100) is exact for every value that can be a tie at n <= 14 decimals (a tie has at most n + 1 binary
  // fraction digits), and far enough from a tie for every other value.
  const [intPart, frac] = ax.toFixed(100).split('.');
  let k = BigInt(intPart + frac.slice(0, n));
  const rest = frac.slice(n);
  const first = rest.charCodeAt(0) - 48;
  const above = /[1-9]/.test(rest.slice(1));
  if (first > 5 || (first === 5 && (above || k % 2n === 1n))) k += 1n;
  let digits = k.toString();
  if (n > 0) {
    digits = digits.padStart(n + 1, '0');
    digits = `${digits.slice(0, -n)}.${digits.slice(-n)}`;
  }
  const value = Number(digits);
  if (ndigits === undefined) return neg && value !== 0 ? -value : value;
  return neg ? -value : value;
}

/**
 * sum() of floats as CPython 3.12+ computes it (Neumaier compensated summation, the compensation added once at the
 * end when finite). A plain `+=` loop differs in the last bit, which flips round(x, 3) on ties such as 5.769 / 6.
 */
export function pySum(values: Iterable<number>): number {
  let f = 0.0;
  let c = 0.0;
  for (const x of values) {
    const t = f + x;
    if (Math.abs(f) >= Math.abs(x)) c += f - t + x;
    else c += x - t + f;
    f = t;
  }
  if (c !== 0 && Number.isFinite(c)) f += c;
  return f;
}

/** repr(float): shortest round-trip digits, fixed notation for 1e-4 <= |x| < 1e16, always with a '.0' or exponent. */
export function pyFloatRepr(x: number): string {
  if (Number.isNaN(x)) return 'NaN';
  if (!Number.isFinite(x)) return x > 0 ? 'Infinity' : '-Infinity';
  if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
  const [mantissa, expText] = x.toExponential().split('e');
  const neg = mantissa.startsWith('-');
  const digits = mantissa.replace('-', '').replace('.', '');
  const decpt = Number(expText) + 1; // value = 0.<digits> * 10^decpt
  let body: string;
  if (decpt > -4 && decpt <= 16) {
    if (decpt <= 0) body = `0.${'0'.repeat(-decpt)}${digits}`;
    else if (decpt >= digits.length) body = `${digits}${'0'.repeat(decpt - digits.length)}.0`;
    else body = `${digits.slice(0, decpt)}.${digits.slice(decpt)}`;
  } else {
    const m = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
    const e = decpt - 1;
    body = `${m}e${e < 0 ? '-' : '+'}${String(Math.abs(e)).padStart(2, '0')}`;
  }
  return (neg ? '-' : '') + body;
}

/** str() of a value as an f-string prints it (None -> 'None', floats as repr). */
export function pyStr(value: unknown): string {
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : pyFloatRepr(value);
  return String(value);
}

/**
 * Keys whose values are Python floats in the transcript data (segment / word times, probabilities, confidence,
 * no_speech_prob, job duration, language_probability, stats.speech_seconds / avg_confidence). Python prints such a
 * value as `2.0` where JSON.stringify prints `2`; integers under any other key print as integers.
 */
export const FLOAT_KEYS: ReadonlySet<string> = new Set([
  'start',
  'end',
  'probability',
  'confidence',
  'no_speech_prob',
  'duration',
  'language_probability',
  'speech_seconds',
  'avg_confidence',
]);

const JSON_ESCAPES: Record<string, string> = {
  '"': '\\"',
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\b': '\\b',
  '\f': '\\f',
};

/** json.dumps of a str with ensure_ascii=False: only '"', '\\' and U+0000..U+001F are escaped. */
export function pyJsonString(text: string): string {
  const body = text.replace(
    // eslint-disable-next-line no-control-regex
    /["\\\u0000-\u001f]/g,
    (c) => JSON_ESCAPES[c] ?? `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
  return `"${body}"`;
}

/**
 * json.dumps(value, ensure_ascii=False, indent=indent) for transcript data: insertion key order, Python float repr for
 * FLOAT_KEYS (and any non-integer number), `[]` / `{}` for empty containers, undefined properties left out.
 */
export function pyJsonDumps(
  value: unknown,
  indent = 2,
  floatKeys: ReadonlySet<string> = FLOAT_KEYS,
): string {
  const pad = (level: number) => ' '.repeat(indent * level);
  const encode = (v: unknown, key: string | null, level: number): string => {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'number') {
      if (Number.isInteger(v) && !(key !== null && floatKeys.has(key))) return String(v);
      return pyFloatRepr(v);
    }
    if (typeof v === 'string') return pyJsonString(v);
    if (Array.isArray(v)) {
      if (v.length === 0) return '[]';
      const items = v.map((item) => pad(level + 1) + encode(item, null, level + 1));
      return `[\n${items.join(',\n')}\n${pad(level)}]`;
    }
    const entries = Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined);
    if (entries.length === 0) return '{}';
    const items = entries.map(
      ([k, x]) => `${pad(level + 1)}${pyJsonString(k)}: ${encode(x, k, level + 1)}`,
    );
    return `{\n${items.join(',\n')}\n${pad(level)}}`;
  };
  return encode(value, null, 0);
}
