import { casefold, detectAndFixRepetitions, parseAsrOutput, repeatedPhrase, tokenKey, trimOverlap } from './qwen-text';

// The assertions of backend/tests/test_backends.py (the Qwen ones) and the qwen_asr behaviours the adapter inherits,
// against the port. The port itself was differential-tested against the Python on 16,000 random cases in the spike
// (scratchpad qwen/port_doc); these keep it honest in the app.

describe('qwen-text: token keys (Python casefold + NFC, letters / numbers / marks)', () => {
  it('folds like Python, not like toLowerCase()', () => {
    expect(casefold('Straße')).toBe('strasse');
    expect(casefold('ﬁle')).toBe('file'); // ligatures unfold, as in Python (toLowerCase keeps them)
    expect(tokenKey('ΣΊΣΥΦΟΣ,')).toBe('σίσυφοσ'); // final sigma folds to σ, punctuation dropped
    expect(tokenKey('Kubernetes!')).toBe('kubernetes');
    expect(tokenKey('...')).toBe('');
    expect(tokenKey('करें।')).toBe('करें'); // combining marks (category M) are kept
  });
});

describe('qwen-text: trim_overlap', () => {
  it.each([
    ['we should maintain discipline', 'Maintain discipline every day', 'Maintain discipline every day', 0],
    ['we should maintain discipline daily.', 'MAINTAIN discipline daily, and study', 'and study', 3],
    ['I think', 'think think again', 'think think again', 0],
    ['तो उसको कैसे करें?', 'उसको कैसे करें। फिर देखें', 'फिर देखें', 3],
    ['a different sentence', 'unrelated new words', 'unrelated new words', 0],
    ['start one two three', 'one two three', '', 3],
  ])('preserves uncertain matches and real short repetitions: %s | %s', (prev, cur, text, removed) => {
    expect(trimOverlap(prev, cur)).toEqual([text, removed]);
  });

  it('uses Python whitespace (U+001C-1F, U+0085 split words; U+FEFF does not)', () => {
    expect(trimOverlap('a b c d', 'b\u001cc\u0085d tail')).toEqual(['tail', 3]);
    expect(trimOverlap('a b c', 'a﻿b c d')[1]).toBe(0);
  });
});

describe('qwen-text: repeated_phrase (a review signal only)', () => {
  it.each([
    ['go go go', false],
    ['This is a test. This is a test. This is a test.', true],
    ['यह मेरी बात यह मेरी बात यह मेरी बात', true],
    ['mañana veremos física mañana veremos química', false],
    ['नाम राम था नाम रमा था नाम रीमा था', false],
  ])('%s -> %s', (text, expected) => {
    expect(repeatedPhrase(text as string)).toBe(expected);
  });
});

describe('qwen-text: the qwen_asr output rules the adapter inherits', () => {
  it('collapses runaway character and pattern repetitions, keeps normal text', () => {
    expect(detectAndFixRepetitions('a'.repeat(25))).toBe('a');
    expect(detectAndFixRepetitions('a'.repeat(20))).toBe('a'.repeat(20));
    expect(detectAndFixRepetitions('hello ' + 'ab'.repeat(30))).toBe('hello ab');
    expect(detectAndFixRepetitions('normal sentence, nothing repeats')).toBe('normal sentence, nothing repeats');
  });

  it('parses `language X<asr_text>text`, silence and forced languages', () => {
    expect(parseAsrOutput('language English<asr_text>Hello world.')).toEqual({ language: 'English', text: 'Hello world.' });
    expect(parseAsrOutput('language hindi<asr_text> नमस्ते ')).toEqual({ language: 'Hindi', text: 'नमस्ते' });
    expect(parseAsrOutput('language None<asr_text>')).toEqual({ language: '', text: '' });
    expect(parseAsrOutput('Hello', 'English')).toEqual({ language: 'English', text: 'Hello' });
    expect(parseAsrOutput('  just text ')).toEqual({ language: '', text: 'just text' });
    expect(parseAsrOutput('\n\nlanguage French\n<asr_text>Bonjour')).toEqual({ language: 'French', text: 'Bonjour' });
    expect(parseAsrOutput('')).toEqual({ language: '', text: '' });
    expect(parseAsrOutput(null)).toEqual({ language: '', text: '' });
  });
});
