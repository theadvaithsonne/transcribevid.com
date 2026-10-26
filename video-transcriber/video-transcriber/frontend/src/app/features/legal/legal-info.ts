/** Shown as "Last updated" on both legal pages: change it whenever their text changes. */
export const LEGAL_UPDATED = '26 October 2026';

/** The same date as ISO (YYYY-MM-DD), so each language can write it its own way: keep it equal to LEGAL_UPDATED (a spec checks). */
export const LEGAL_UPDATED_ISO = '2026-10-26';

/**
 * A date written out in a language: "26 October 2026", "26 de octubre de 2026", "2026年10月26日". English is written the
 * British way (the exact text LEGAL_UPDATED has). The Gregorian calendar and Western digits are always used, so a page in Thai
 * or Arabic does not show a Buddhist year or digits the visitor may not expect in a legal date.
 */
export function fmtLegalDate(iso: string, locale: string): string {
  const tag = locale === 'en' ? 'en-GB' : `${locale}-u-ca-gregory-nu-latn`;
  return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}
