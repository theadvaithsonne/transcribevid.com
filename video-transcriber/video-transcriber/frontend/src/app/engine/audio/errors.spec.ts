import {
  DECODE_ERROR_CODES,
  DecodeError,
  classifyError,
  friendlyCodec,
  messageFor,
  reviveError,
  serializeError,
  toDecodeError,
} from './errors';

describe('DecodeError messages', () => {
  it('has a plain-language sentence for every code (no placeholders, no emoji, no technical detail)', () => {
    for (const code of DECODE_ERROR_CODES) {
      const e = new DecodeError({
        code,
        codec: 'ac3',
        technical: 'TypeError: secret-internal-detail',
      });
      expect(e.userMessage.length, code).toBeGreaterThan(5);
      expect(e.userMessage, code).not.toMatch(/undefined|null|\[object/);
      expect(e.userMessage, code).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
      expect(e.userMessage, code).not.toContain('secret-internal-detail');
      expect(e.message).toBe(e.userMessage);
      expect(e.technical).toBe('TypeError: secret-internal-detail');
      expect(e.name).toBe('DecodeError');
    }
  });

  it('names the codec in words for an unsupported codec and says what to do', () => {
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'ac3' })).toMatch(
      /Dolby Digital \(AC-3\).*Convert it to MP3, M4A or WAV first/,
    );
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'eac3' })).toMatch(/E-AC-3/);
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'samr' })).toMatch(/AMR-NB/);
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'dts' })).toMatch(/DTS/);
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'wmav2' })).toMatch(
      /Windows Media Audio/,
    );
    expect(messageFor({ code: 'UNSUPPORTED_CODEC', codec: 'alac' })).toMatch(/Apple Lossless/);
    expect(messageFor({ code: 'UNSUPPORTED_CODEC' })).toMatch(/an audio format.*Convert/);
  });

  it('tells the visitor to convert a file in a container the browser cannot open (no ffmpeg.wasm in v1)', () => {
    const e = new DecodeError({ code: 'NOT_MEDIA' });
    expect(e.userMessage).toMatch(/does not look like an audio or video file/);
    expect(e.userMessage).toMatch(/Convert it to MP3, M4A or WAV first/);
    expect(e.suggestion).toBe('convert-first');
  });

  it("keeps the Python engine's own sentences", () => {
    expect(messageFor({ code: 'CORRUPT' })).toMatch(/corrupted or not a supported media format/);
    expect(messageFor({ code: 'NO_AUDIO_TRACK' })).toMatch(/no audio track/);
    expect(messageFor({ code: 'TOO_SHORT' })).toBe('The audio is too short to transcribe.');
    expect(messageFor({ code: 'CANCELLED' })).toBe('Cancelled.');
  });

  it('suggests the next step', () => {
    expect(new DecodeError({ code: 'UNSUPPORTED_CODEC' }).suggestion).toBe('convert-first');
    expect(new DecodeError({ code: 'CORRUPT' }).suggestion).toBe('redownload');
    expect(new DecodeError({ code: 'TOO_LARGE' }).suggestion).toBe('use-desktop-browser');
    expect(new DecodeError({ code: 'OUT_OF_MEMORY' }).suggestion).toBe('use-desktop-browser');
    expect(new DecodeError({ code: 'EMPTY_FILE' }).suggestion).toBe('none');
    expect(new DecodeError({ code: 'EMPTY_FILE', suggestion: 'redownload' }).suggestion).toBe(
      'redownload',
    );
  });

  it('spells out codec ids and upper-cases unknown ones', () => {
    expect(friendlyCodec('AC3')).toBe('Dolby Digital (AC-3)');
    expect(friendlyCodec(' samr ')).toBe('AMR-NB (phone voice)');
    expect(friendlyCodec('weird')).toBe('WEIRD');
  });
});

describe('DecodeError across the worker boundary', () => {
  it('survives structured clone / JSON as a plain object and is revived with every field', () => {
    const e = new DecodeError({
      code: 'UNSUPPORTED_CODEC',
      codec: 'eac3',
      container: 'MP4',
      technical: 'track 0',
    });
    const r = reviveError(JSON.parse(JSON.stringify(serializeError(e))));
    expect(r).toBeInstanceOf(DecodeError);
    expect(r.code).toBe('UNSUPPORTED_CODEC');
    expect(r.userMessage).toBe(e.userMessage);
    expect(r.codec).toBe('eac3');
    expect(r.container).toBe('MP4');
    expect(r.technical).toBe('track 0');
    expect(r.suggestion).toBe('convert-first');
  });

  it('turns any other thrown value into DECODE_FAILED with its name and message as the technical reason', () => {
    const s = serializeError(new TypeError('boom'));
    expect(s.code).toBe('DECODE_FAILED');
    expect(s.technical).toBe('TypeError: boom');
    expect(s.userMessage).not.toContain('boom');
    expect(toDecodeError('plain string').technical).toBe('Error: plain string');
    const own = new DecodeError({ code: 'CORRUPT' });
    expect(toDecodeError(own)).toBe(own);
  });
});

describe('classifyError', () => {
  it('maps what mediabunny and WebCodecs throw to stable codes', () => {
    expect(classifyError(new Error('Encrypted media samples encountered')).code).toBe(
      'DRM_PROTECTED',
    );
    const unsupported = classifyError(
      new DOMException('Unsupported configuration', 'NotSupportedError'),
      {
        codec: 'ac3',
        container: 'MP4',
      },
    );
    expect(unsupported.code).toBe('UNSUPPORTED_CODEC');
    expect(unsupported.codec).toBe('ac3');
    expect(unsupported.container).toBe('MP4');
    expect(classifyError(new RangeError('Array buffer allocation failed')).code).toBe(
      'OUT_OF_MEMORY',
    );
    expect(classifyError(new RangeError('Invalid typed array length: 99999999999')).code).toBe(
      'OUT_OF_MEMORY',
    );
    const other = classifyError(new TypeError('x is not a function'));
    expect(other.code).toBe('DECODE_FAILED');
    expect(other.technical).toBe('TypeError: x is not a function');
  });

  it('reports CANCELLED for anything thrown after the signal fired', () => {
    const ac = new AbortController();
    ac.abort();
    expect(classifyError(new Error('Input has been disposed.'), { signal: ac.signal }).code).toBe(
      'CANCELLED',
    );
  });

  it('leaves a DecodeError alone', () => {
    const e = new DecodeError({ code: 'NO_AUDIO_TRACK' });
    expect(classifyError(e)).toBe(e);
  });
});
