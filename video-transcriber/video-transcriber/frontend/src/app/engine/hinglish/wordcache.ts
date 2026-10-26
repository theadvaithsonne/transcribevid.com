/**
 * Optional exact lookup table of frequent words (public/models/indicxlit/wordcache.tsv).
 *
 * Each line maps a Devanagari word (NFC) to what the *server's* CTranslate2 model returns for it with the server's
 * decoding settings (beam 4, at most 96 symbols). Because the browser model reproduces that output bit for bit, a
 * hit is indistinguishable from running the network - it just skips ~25 ms of work. The header line pins the table
 * to one model file; a table made for another model is ignored rather than trusted.
 *
 *   #indicxlit-wordcache v1 model=<sha256 of indicxlit.bin> beam=4 max=96 count=<n>
 *   <word>\t<roman>
 */
const HEADER = /^#indicxlit-wordcache v1 model=([0-9a-f]{64}) beam=(\d+) max=(\d+) count=(\d+)$/;

export interface WordCacheSettings {
  beam: number;
  maxDecodingLength: number;
}

/** Returns the table, or null when the text is not a well-formed table for this model and these settings. */
export function parseWordCache(
  text: string,
  modelSha256: string,
  settings: WordCacheSettings,
): Map<string, string> | null {
  const lines = text.split('\n');
  const head = HEADER.exec(lines[0].replace(/\r$/, ''));
  if (!head) return null;
  if (
    head[1] !== modelSha256 ||
    +head[2] !== settings.beam ||
    +head[3] !== settings.maxDecodingLength
  )
    return null;
  const table = new Map<string, string>();
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    if (line === '') continue;
    const tab = line.indexOf('\t');
    if (tab <= 0 || tab === line.length - 1) return null;
    table.set(line.slice(0, tab), line.slice(tab + 1));
  }
  return table.size === +head[4] ? table : null;
}
