import { HttpErrorResponse } from '@angular/common/http';
import { errorDetail, isBusy, isTransient } from './http-error';

describe('errorDetail', () => {
  it('returns the server detail string', () => {
    expect(errorDetail({ status: 409, error: { detail: 'The title is too long.' } }, 'fallback')).toBe(
      'The title is too long.',
    );
  });

  it('works with a real HttpErrorResponse', () => {
    const e = new HttpErrorResponse({ status: 409, error: { detail: 'Cancel the running job first.' } });
    expect(errorDetail(e, 'fallback')).toBe('Cancel the running job first.');
  });

  it('keeps only the first line of a multi-line message', () => {
    expect(errorDetail({ status: 400, error: { detail: 'Invalid model "x".\nValid models: a, b, c\n  at foo' } }, 'f')).toBe('Invalid model "x".');
    expect(errorDetail({ status: 400, error: { detail: '\r\n  \r\nsecond line is first\r\nthird' } }, 'f')).toBe('second line is first');
  });

  it('joins validation errors (array of {msg}) and keeps the first line', () => {
    const e = { status: 422, error: { detail: [{ msg: 'beam_size must be <= 10' }, { msg: 'unknown language' }] } };
    expect(errorDetail(e, 'f')).toBe('beam_size must be <= 10; unknown language');
    expect(errorDetail({ status: 422, error: { detail: [{ msg: 'line one\nline two' }] } }, 'f')).toBe('line one');
    expect(errorDetail({ status: 422, error: { detail: ['plain string'] } }, 'f')).toBe('plain string');
  });

  it('falls back when there is no usable detail', () => {
    expect(errorDetail({ status: 500, error: {} }, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail({ status: 500, error: 'Internal Server Error' }, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail({ status: 500, error: { detail: '   ' } }, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail({ status: 422, error: { detail: [{}] } }, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail(null, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail(undefined, 'Could not do it.')).toBe('Could not do it.');
    expect(errorDetail('weird', 'Could not do it.')).toBe('Could not do it.');
  });

  it('says the server is unreachable for status 0', () => {
    expect(errorDetail({ status: 0, error: new ProgressEvent('error') }, 'Could not do it.')).toBe('Cannot reach the server.');
  });
});

describe('isTransient', () => {
  it('is true for an unreachable server and 5xx', () => {
    expect(isTransient({ status: 0 })).toBe(true);
    expect(isTransient({ status: 500 })).toBe(true);
    expect(isTransient({ status: 503 })).toBe(true);
    expect(isTransient(new Error('no status'))).toBe(true);
    expect(isTransient(null)).toBe(true);
  });

  it('is false for client errors such as 404', () => {
    expect(isTransient({ status: 404 })).toBe(false);
    expect(isTransient({ status: 409 })).toBe(false);
    expect(isTransient({ status: 422 })).toBe(false);
  });
});

describe('isBusy', () => {
  it('is true for 429, and for a 503 that explains itself ("server full")', () => {
    expect(isBusy({ status: 429 })).toBe(true);
    expect(isBusy({ status: 429, error: { detail: 'Too many jobs.' } })).toBe(true);
    expect(isBusy({ status: 503, error: { detail: 'The server is full.' } })).toBe(true);
  });

  it('is false for a bare 503 (a proxy while the backend is down), other errors and an unreachable server', () => {
    expect(isBusy({ status: 503 })).toBe(false);
    expect(isBusy({ status: 503, error: {} })).toBe(false);
    expect(isBusy({ status: 500, error: { detail: 'Boom.' } })).toBe(false);
    expect(isBusy({ status: 404 })).toBe(false);
    expect(isBusy({ status: 0 })).toBe(false);
    expect(isBusy(null)).toBe(false);
  });
});
