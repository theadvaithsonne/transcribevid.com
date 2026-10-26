import { RULE_NEURAL, RULE_TEXTS, RULE_WORDS } from './hinglish-fixtures';
import { SPELLINGS } from './hinglish-data';
import {
  BASIC_WARNING,
  LONG_RUN_WARNING,
  MAX_NEURAL_RUN,
  NeuralConverter,
  RomanizerUnavailable,
  Segment,
  convertSegment,
  convertSegmentBasic,
  devanagariRuns,
  restyleSegment,
  romanize,
  romanizeBasic,
} from './hinglish';

/** Looks the word up in the outputs of the real model (recorded from the server's pipeline). */
class RecordedModel implements NeuralConverter {
  readonly calls: string[][] = [];
  transliterate(words: string[]): string[] {
    this.calls.push([...words]);
    return words.map((w) => {
      const out = RULE_NEURAL.get(w);
      if (out === undefined) throw new Error(`no recorded output for ${w}`);
      return out;
    });
  }
}

describe('hinglish rule layer (port of backend/tests/test_hinglish.py)', () => {
  const cases: [string, string][] = [
    [
      "तो एक स्टूडेंट की लाइफ में डिसिप्लिन बहुत इंपॉर्टेंट है while you're preparing.",
      "toh ek student ki life mein discipline bahut important hai while you're preparing.",
    ],
    ['तो उस डिसिप्लिन को कैसे मेंटेन किया जाए?', 'toh us discipline ko kaise maintain kiya jaaye?'],
    ['मैं यहाँ हूँ, आप कहाँ हैं?', 'main yahan hoon, aap kahan hain?'],
    ['करना समझना लड़का राम अमित', 'karna samajhna ladka raam amit'],
    ['फ़ाइल ज़रा', 'file zara'],
    ['नंबर १२३।\nटाइम 00:04!', 'number 123.\ntime 00:04!'],
    ['English  PostgreSQL, API v2.0\n你好 مرحبا', 'English  PostgreSQL, API v2.0\n你好 مرحبا'],
    ['', ''],
  ];

  it.each(cases)(
    'converts conversational Hindi and preserves other text: %j',
    (source, expected) => {
      expect(romanizeBasic(source)).toBe(expected);
    },
  );

  it('gives both Unicode spellings of a nukta letter the same romanization', () => {
    const text = 'फ़ाइल ज़रा';
    expect(romanizeBasic(text.normalize('NFC'))).toBe(romanizeBasic(text.normalize('NFD')));
  });

  it('keeps recognition evidence, timing, confidence and the input segment', async () => {
    const segment: Segment = {
      id: 1,
      start: 4.0,
      end: 5.0,
      confidence: 0.8,
      text: 'तो student है।',
      words: [
        { word: ' तो', start: 4.0, end: 4.2, probability: 0.7 },
        { word: ' student', start: 4.2, end: 4.7, probability: 0.9 },
        { word: ' है।', start: 4.7, end: 5.0, probability: 0.8 },
      ],
    };
    const before: Segment = JSON.parse(JSON.stringify(segment));
    const converted = await convertSegment(segment);
    expect(segment).toEqual(before);
    expect(converted.text).toBe('toh student hai.');
    expect(converted.original_text).toBe(segment.text);
    expect(
      (converted.words ?? [])
        .map((w) => w.word)
        .join('')
        .trim(),
    ).toBe(converted.text);
    segment.words!.forEach((original, i) => {
      const word = converted.words![i];
      expect([word['start'], word['end'], word['probability']]).toEqual([
        original['start'],
        original['end'],
        original['probability'],
      ]);
      expect(word.original_word ?? word.word).toBe(original.word);
    });
    expect([converted['start'], converted['end'], converted['confidence']]).toEqual([
      4.0, 5.0, 0.8,
    ]);
    expect(converted.romanizer).toBe('basic');
    expect(converted.conversion_warning).toBe(BASIC_WARNING);
  });

  it('needs no original copy for text that is already Latin', async () => {
    const segment: Segment = { text: 'Hello English.', words: null };
    expect(await convertSegment(segment)).toEqual(segment);
    expect(convertSegmentBasic(segment)).toEqual(segment);
  });

  it('is not a semantic rewrite', () => {
    // Do not invent 'important' from the incomplete recognition 'इंट'.
    expect(romanizeBasic('इंट')).not.toContain('important');
  });

  it.each(['basic', 'indicxlit'] as const)(
    'uses the Hindi evidence for natural spellings without rewriting English (%s)',
    async (method) => {
      const source = 'आ रखूँ बनाई बनाए बीच सकता लगता उसके वापस beach aaa rakhuun API';
      // every Devanagari word is in the spelling dictionary, so the trained model is not needed
      expect(await romanize(source, method)).toBe(
        'aa rakhun banayi banaye beech sakta lagta uske wapas beach aaa rakhuun API',
      );
      // Distinct source words must not be merged by a broad spelling correction.
      const [a, b] = romanizeBasic('भर बढ़').split(' ');
      expect(a).not.toBe(b);
    },
  );

  it('restyles from the saved recognition and keeps user edits', async () => {
    const source: Segment = {
      text: 'तो student है।',
      start: 4,
      end: 6,
      words: [{ word: ' तो', start: 4, end: 4.2, probability: 0.8 }],
    };
    const roman = await restyleSegment(source, 'hinglish', 'basic');
    expect(roman.text).toBe('toh student hai.');
    const native = await restyleSegment(roman, 'original');
    expect(native.text).toBe(source.text);
    expect(native.words![0].word).toBe(' तो');
    expect('conversion_warning' in native).toBe(false);
    const edited: Segment = { ...roman, edited: true, text: 'My correction', words: null };
    expect(await restyleSegment(edited, 'original')).toEqual(edited);
  });

  it('asks the trained model only for Hindi words, once per distinct word, and keeps word timing', async () => {
    const calls: string[][] = [];
    const model: NeuralConverter = {
      transliterate: (words) => {
        calls.push([...words]);
        return words.map((w) => ({ नमस्ते: 'namaste', भारत: 'bharat' })[w] as string);
      },
    };
    const result = await convertSegment(
      {
        text: 'नमस्ते API, भारत!',
        words: [{ word: ' नमस्ते', start: 1, end: 2, probability: 0.7 }],
      },
      'indicxlit',
      { neural: model },
    );
    expect(result.text).toBe('namaste API, bharat!');
    expect(result.romanizer).toBe('indicxlit');
    expect('conversion_warning' in result).toBe(false);
    expect(result.words![0]['start']).toBe(1);
    expect(result.words![0]['probability']).toBe(0.7);
    expect(result.words![0].word).toBe(' namaste');
    expect(calls).toEqual([['नमस्ते', 'भारत']]); // one request-local conversion reused for the timing words
    await convertSegment({ text: 'नमस्ते', words: null }, 'indicxlit', { neural: model });
    expect(calls.length).toBe(2); // nothing is cached across segments
    expect(calls[1]).toEqual(['नमस्ते']);
  });

  it('refuses invalid model output and a missing model, and auto falls back to basic', async () => {
    const empty: NeuralConverter = { transliterate: (words) => words.map(() => '') };
    await expect(romanize('नमस्ते', 'indicxlit', { neural: empty })).rejects.toBeInstanceOf(
      RomanizerUnavailable,
    );
    const digits: NeuralConverter = { transliterate: (words) => words.map(() => 'abc123') };
    await expect(romanize('नमस्ते', 'indicxlit', { neural: digits })).rejects.toThrow(
      /no valid Roman spelling/,
    );
    await expect(romanize('नमस्ते', 'indicxlit')).rejects.toThrow(/unavailable/);
    const auto = await convertSegment({ text: 'नमस्ते' }, 'auto');
    expect(auto.romanizer).toBe('basic');
    const trained = await convertSegment({ text: 'नमस्ते' }, 'auto', {
      neural: new RecordedModel(),
    });
    expect(trained.romanizer).toBe('indicxlit');
  });

  it('gives runs longer than MAX_NEURAL_RUN the basic spelling and a warning instead of the model', async () => {
    const calls: string[][] = [];
    const model: NeuralConverter = {
      transliterate: (words) => {
        calls.push([...words]);
        return words.map(() => 'namaste');
      },
    };
    const long = 'क'.repeat(MAX_NEURAL_RUN + 1);
    const edge = 'क'.repeat(MAX_NEURAL_RUN);
    const result = await convertSegment(
      { text: `नमस्ते ${long} ${edge}`, words: [{ word: ` ${long}` }] },
      'indicxlit',
      { neural: model },
    );
    expect(calls).toEqual([['नमस्ते', edge]]); // the over-long run never reaches the model
    expect(result.text).toBe(`namaste ${romanizeBasic(long)} namaste`);
    expect(result.words![0].word).toBe(` ${romanizeBasic(long)}`);
    expect(result.romanizer).toBe('indicxlit');
    expect(result.conversion_warning).toBe(LONG_RUN_WARNING);
    const normal = await convertSegment({ text: `नमस्ते ${edge}` }, 'indicxlit', { neural: model });
    expect('conversion_warning' in normal).toBe(false);
  });

  it('accepts apostrophes and hyphens in model output like the server', async () => {
    const odd: NeuralConverter = { transliterate: (words) => words.map(() => "ma'am-ji") };
    expect(await romanize('मैडम', 'indicxlit', { neural: odd })).toBe("ma'am-ji");
  });

  it('finds Devanagari runs the way the Python regular expression does', () => {
    // danda, digits and the abbreviation sign are not part of a word; ZWJ / ZWNJ split it
    expect(devanagariRuns('क्‍ष और क्‌ष। १२३ ॰')).toEqual(['क्', 'ष', 'और', 'क्', 'ष']);
  });
});

describe('hinglish rule layer against the server module', () => {
  it('has the same spelling dictionary size as backend/app/hinglish.py', () => {
    expect(SPELLINGS.size).toBe(196);
    for (const key of SPELLINGS.keys()) expect(key).toBe(key.normalize('NFC'));
  });

  it(`reproduces the server for ${RULE_WORDS.length} words (basic romanizer and the full pipeline)`, async () => {
    const recorded = new Map(RULE_WORDS.map(([word, , pipeline]) => [word, pipeline] as const));
    const model: NeuralConverter = {
      transliterate: (words) => words.map((w) => recorded.get(w) ?? ''),
    };
    const mismatches: string[] = [];
    for (const [word, basic, pipeline] of RULE_WORDS) {
      if (romanizeBasic(word) !== basic) mismatches.push(`basic ${word}`);
      // words of the spelling dictionary never reach the model; the others get its recorded output
      if ((await romanize(word, 'indicxlit', { neural: model })) !== pipeline)
        mismatches.push(`pipeline ${word}`);
    }
    expect(mismatches).toEqual([]);
  });

  it.each(RULE_TEXTS.map((c) => [c.text, c] as const))(
    'reproduces the server for the text %j',
    async (_text, c) => {
      expect(romanizeBasic(c.text)).toBe(c.basic);
      if (c.indicxlit !== null) {
        const out = await romanize(c.text, 'indicxlit', { neural: new RecordedModel() });
        expect(out).toBe(c.indicxlit);
      }
    },
  );
});
