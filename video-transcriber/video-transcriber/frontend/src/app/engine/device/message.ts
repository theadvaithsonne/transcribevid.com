/**
 * Messages the device code produces for the visitor (plan notes, time estimates, warnings) are English strings by
 * contract: the specs, the worker and the self-hosted edition all read them as text. To let the page translate them at
 * DISPLAY time (so a language change is never stale) every message that has values in it is built with `msg()`:
 *
 *   msg(_t('about {n} min'), { n: 7 })   ->  'about 7 min'   (and remembered as key + values)
 *
 * The result is the plain English sentence. `translateMessage()` finds the remembered key and values for such a sentence
 * and translates them, values that are themselves messages first. A sentence that was never built with `msg()` (a fixed
 * reason, say) is simply looked up as it is, which is how a fixed English text is its own key.
 *
 * No Angular and no i18n imports: the engine and the worker may load this file.
 */
export type MessageParams = Readonly<Record<string, string | number>>;
export type Translate = (key: string, params?: MessageParams) => string;

interface Entry {
  key: string;
  params: MessageParams;
}

/** English sentence -> how it was built. The set of distinct sentences is small (durations, sizes), so it is never trimmed. */
const registry = new Map<string, Entry>();

const fill = (text: string, params: MessageParams) => text.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m));

/** The English sentence for `key` with `params` filled in, remembered so it can be translated later. */
export function msg(key: string, params: MessageParams = {}): string {
  const english = fill(key, params);
  registry.set(english, { key, params });
  return english;
}

/** The translation of a message produced by `msg()` (or of a plain fixed text) with the page's translate function. */
export function translateMessage(english: string, t: Translate): string {
  const entry = registry.get(english);
  if (!entry) return t(english);
  const params: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(entry.params)) {
    // a value that is a message of its own ("about 7 min") is translated too; any other value (a model name, a number) is kept
    params[name] = typeof value === 'string' && registry.has(value) ? translateMessage(value, t) : value;
  }
  return t(entry.key, params);
}
