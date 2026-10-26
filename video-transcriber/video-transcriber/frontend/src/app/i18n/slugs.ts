import { Locale } from './locales';
import { SLUGS as ar } from './slugs/ar';
import { SLUGS as bn } from './slugs/bn';
import { SLUGS as de } from './slugs/de';
import { SLUGS as es } from './slugs/es';
import { SLUGS as fr } from './slugs/fr';
import { SLUGS as hi } from './slugs/hi';
import { SLUGS as id } from './slugs/id';
import { SLUGS as it } from './slugs/it';
import { SLUGS as ja } from './slugs/ja';
import { SLUGS as ko } from './slugs/ko';
import { SLUGS as pt } from './slugs/pt';
import { SLUGS as th } from './slugs/th';
import { SLUGS as tr } from './slugs/tr';
import { SLUGS as ur } from './slugs/ur';
import { SLUGS as vi } from './slugs/vi';

/**
 * English path -> localised path (without the /<code> prefix) for every language. A page without an entry keeps its
 * English path ("/faq" -> "/es/faq"). Small on purpose: it is in the first download, so the router can build every
 * address before any dictionary is loaded.
 */
export const PAGE_SLUGS: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  en: {},
  es, pt, fr, de, it, id, ja, ko, th, vi, tr, hi, bn, ar, ur,
};
