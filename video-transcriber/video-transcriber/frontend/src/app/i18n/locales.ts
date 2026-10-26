/**
 * The languages of the site (docs/in-browser/I18N.md). English is the default and has no address prefix; every other
 * language lives under /<code>. Kept small and free of page text so the router, the sitemap check and the language menu
 * can import it without pulling any dictionary into the first download.
 */
export const LOCALE_CODES = ['en', 'es', 'pt', 'fr', 'de', 'it', 'id', 'ja', 'ko', 'th', 'vi', 'tr', 'hi', 'bn', 'ar', 'ur'] as const;
export type Locale = (typeof LOCALE_CODES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type Dir = 'ltr' | 'rtl';

/** The short sentences of the "this page is also available in <language>" bar, written in that language. */
export interface LocaleHint {
  message: string;
  action: string;
  dismiss: string;
}

export interface LocaleInfo {
  code: Locale;
  /** the language's own name, as its speakers write it (shown in the language menu) */
  name: string;
  /** the name in English (for people who cannot read the script, and for tests) */
  englishName: string;
  dir: Dir;
  /** Open Graph locale, e.g. "es_ES" */
  og: string;
  hint: LocaleHint;
}

export const LOCALES: Readonly<Record<Locale, LocaleInfo>> = {
  en: { code: 'en', name: 'English', englishName: 'English', dir: 'ltr', og: 'en_US', hint: { message: 'This page is also available in English.', action: 'View in English', dismiss: 'Close' } },
  es: { code: 'es', name: 'Español', englishName: 'Spanish', dir: 'ltr', og: 'es_ES', hint: { message: 'Esta página también está disponible en español.', action: 'Ver en español', dismiss: 'Cerrar' } },
  pt: { code: 'pt', name: 'Português', englishName: 'Portuguese', dir: 'ltr', og: 'pt_BR', hint: { message: 'Esta página também está disponível em português.', action: 'Ver em português', dismiss: 'Fechar' } },
  fr: { code: 'fr', name: 'Français', englishName: 'French', dir: 'ltr', og: 'fr_FR', hint: { message: 'Cette page est aussi disponible en français.', action: 'Voir en français', dismiss: 'Fermer' } },
  de: { code: 'de', name: 'Deutsch', englishName: 'German', dir: 'ltr', og: 'de_DE', hint: { message: 'Diese Seite gibt es auch auf Deutsch.', action: 'Auf Deutsch ansehen', dismiss: 'Schließen' } },
  it: { code: 'it', name: 'Italiano', englishName: 'Italian', dir: 'ltr', og: 'it_IT', hint: { message: 'Questa pagina è disponibile anche in italiano.', action: 'Vedi in italiano', dismiss: 'Chiudi' } },
  id: { code: 'id', name: 'Bahasa Indonesia', englishName: 'Indonesian', dir: 'ltr', og: 'id_ID', hint: { message: 'Halaman ini juga tersedia dalam bahasa Indonesia.', action: 'Lihat dalam bahasa Indonesia', dismiss: 'Tutup' } },
  ja: { code: 'ja', name: '日本語', englishName: 'Japanese', dir: 'ltr', og: 'ja_JP', hint: { message: 'このページは日本語でもご覧いただけます。', action: '日本語で見る', dismiss: '閉じる' } },
  ko: { code: 'ko', name: '한국어', englishName: 'Korean', dir: 'ltr', og: 'ko_KR', hint: { message: '이 페이지는 한국어로도 볼 수 있습니다.', action: '한국어로 보기', dismiss: '닫기' } },
  th: { code: 'th', name: 'ไทย', englishName: 'Thai', dir: 'ltr', og: 'th_TH', hint: { message: 'หน้านี้มีให้บริการเป็นภาษาไทยด้วย', action: 'ดูเป็นภาษาไทย', dismiss: 'ปิด' } },
  vi: { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', dir: 'ltr', og: 'vi_VN', hint: { message: 'Trang này cũng có bằng tiếng Việt.', action: 'Xem bằng tiếng Việt', dismiss: 'Đóng' } },
  tr: { code: 'tr', name: 'Türkçe', englishName: 'Turkish', dir: 'ltr', og: 'tr_TR', hint: { message: 'Bu sayfa Türkçe olarak da mevcut.', action: 'Türkçe görüntüle', dismiss: 'Kapat' } },
  hi: { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', og: 'hi_IN', hint: { message: 'यह पेज हिन्दी में भी उपलब्ध है।', action: 'हिन्दी में देखें', dismiss: 'बंद करें' } },
  bn: { code: 'bn', name: 'বাংলা', englishName: 'Bengali', dir: 'ltr', og: 'bn_BD', hint: { message: 'এই পৃষ্ঠাটি বাংলাতেও পাওয়া যায়।', action: 'বাংলায় দেখুন', dismiss: 'বন্ধ করুন' } },
  ar: { code: 'ar', name: 'العربية', englishName: 'Arabic', dir: 'rtl', og: 'ar_AR', hint: { message: 'هذه الصفحة متوفرة أيضًا بالعربية.', action: 'عرض بالعربية', dismiss: 'إغلاق' } },
  ur: { code: 'ur', name: 'اردو', englishName: 'Urdu', dir: 'rtl', og: 'ur_PK', hint: { message: 'یہ صفحہ اردو میں بھی دستیاب ہے۔', action: 'اردو میں دیکھیں', dismiss: 'بند کریں' } },
};

export const isLocale = (s: unknown): s is Locale => typeof s === 'string' && (LOCALE_CODES as readonly string[]).includes(s);

/** The languages other than English, in menu order. */
export const OTHER_LOCALES: readonly Locale[] = LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE);

/**
 * The language a browser language tag asks for, or null: "es-MX" -> "es", "pt-BR" -> "pt", "zh-TW" -> null (not offered).
 * Both the old "in" and the new "id" tag mean Indonesian.
 */
export function localeFromTag(tag: string | null | undefined): Locale | null {
  const primary = (tag ?? '').toLowerCase().split(/[-_]/)[0];
  const code = primary === 'in' ? 'id' : primary;
  return isLocale(code) ? code : null;
}
