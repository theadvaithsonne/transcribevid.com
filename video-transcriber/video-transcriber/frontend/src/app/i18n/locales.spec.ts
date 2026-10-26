import { DEFAULT_LOCALE, LOCALES, LOCALE_CODES, OTHER_LOCALES, isLocale, localeFromTag } from './locales';

describe('the language list', () => {
  it('has sixteen languages, English first and the default', () => {
    expect(LOCALE_CODES.length).toBe(16);
    expect(LOCALE_CODES[0]).toBe('en');
    expect(DEFAULT_LOCALE).toBe('en');
    expect(OTHER_LOCALES.length).toBe(15);
    expect(OTHER_LOCALES).not.toContain('en');
  });

  it('describes every code once: its own name, English name, Open Graph locale and direction', () => {
    for (const code of LOCALE_CODES) {
      const l = LOCALES[code];
      expect(l.code).toBe(code);
      expect(l.name.trim()).not.toBe('');
      expect(l.englishName.trim()).not.toBe('');
      expect(l.og).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      expect(l.og.startsWith(code)).toBe(true);
      expect(['ltr', 'rtl']).toContain(l.dir);
    }
    for (const key of ['name', 'englishName', 'og'] as const) {
      const values = LOCALE_CODES.map((c) => LOCALES[c][key]);
      expect(new Set(values).size, key).toBe(values.length);
    }
  });

  it('only Arabic and Urdu are right to left', () => {
    expect(LOCALE_CODES.filter((c) => LOCALES[c].dir === 'rtl').sort()).toEqual(['ar', 'ur']);
  });

  it('every language has the three short sentences of the "also available" bar, in its own words', () => {
    const messages = LOCALE_CODES.map((c) => LOCALES[c].hint.message);
    expect(new Set(messages).size).toBe(messages.length);
    for (const c of LOCALE_CODES) {
      const h = LOCALES[c].hint;
      expect(h.message.trim().length).toBeGreaterThan(10);
      expect(h.action.trim().length).toBeGreaterThan(2);
      expect(h.dismiss.trim().length).toBeGreaterThan(1);
      expect(h.message).toContain(c === 'en' ? 'English' : '');
    }
  });

  describe('isLocale', () => {
    it('knows the codes and nothing else', () => {
      for (const c of LOCALE_CODES) expect(isLocale(c)).toBe(true);
      for (const x of ['EN', 'es-MX', 'zh', '', null, undefined, 5, 'jobs']) expect(isLocale(x)).toBe(false);
    });
  });

  describe('localeFromTag (browser language tags)', () => {
    it.each([
      ['es-MX', 'es'],
      ['es', 'es'],
      ['pt-BR', 'pt'],
      ['PT-pt', 'pt'],
      ['de-AT', 'de'],
      ['ja-JP', 'ja'],
      ['en-GB', 'en'],
      ['in', 'id'], // the old Indonesian tag
      ['id-ID', 'id'],
      ['hi-IN', 'hi'],
      ['ar_EG', 'ar'],
    ])('%s -> %s', (tag, expected) => {
      expect(localeFromTag(tag)).toBe(expected);
    });

    it('is null for a language the site does not offer and for nothing', () => {
      for (const tag of ['zh-CN', 'ru', 'pl-PL', 'sv', '', null, undefined]) expect(localeFromTag(tag)).toBeNull();
    });
  });
});
