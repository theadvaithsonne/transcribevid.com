/**
 * Marks an English string that is translated later: `{ title: _t('Fastest') }` in a constant, shown with
 * `{{ item.title | t }}`. It returns the text unchanged; its job is to let scripts/extract-i18n.mjs find the string,
 * which it could not through `item.title | t`.
 */
export const _t = (text: string): string => text;
