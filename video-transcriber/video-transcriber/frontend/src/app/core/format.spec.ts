import { PHASE_LABEL, fmtBytes, fmtBytesShort, fmtEta, fmtTime, prefersReducedMotion, timeAgo, triggerDownload } from './format';

describe('fmtTime', () => {
  it('shows a placeholder for missing / non-finite values', () => {
    expect(fmtTime(null)).toBe('--:--');
    expect(fmtTime(undefined)).toBe('--:--');
    expect(fmtTime(NaN)).toBe('--:--');
    expect(fmtTime(Infinity)).toBe('--:--');
  });

  it('formats minutes and seconds', () => {
    expect(fmtTime(0)).toBe('00:00');
    expect(fmtTime(5.9)).toBe('00:05');
    expect(fmtTime(65)).toBe('01:05');
    expect(fmtTime(3599)).toBe('59:59');
  });

  it('adds hours from one hour up', () => {
    expect(fmtTime(3600)).toBe('1:00:00');
    expect(fmtTime(3723)).toBe('1:02:03');
    expect(fmtTime(36000)).toBe('10:00:00');
  });

  it('clamps negatives to zero', () => {
    expect(fmtTime(-4)).toBe('00:00');
  });
});

describe('fmtBytes', () => {
  it('uses KB below 1 MB, never showing 0 KB', () => {
    expect(fmtBytes(0)).toBe('1 KB');
    expect(fmtBytes(2048)).toBe('2 KB');
  });

  it('uses MB and GB', () => {
    expect(fmtBytes(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(fmtBytes(1.5 * 1024 ** 3)).toBe('1.50 GB');
  });
});

describe('fmtBytesShort', () => {
  it('drops trailing zeros', () => {
    expect(fmtBytesShort(4 * 1024 ** 3)).toBe('4 GB');
    expect(fmtBytesShort(5.2 * 1024 ** 3)).toBe('5.2 GB');
    expect(fmtBytesShort(1.05 * 1024 ** 3)).toBe('1.05 GB');
    expect(fmtBytesShort(512 * 1024 ** 2)).toBe('512 MB');
    expect(fmtBytesShort(10.5 * 1024 ** 2)).toBe('10.5 MB');
    expect(fmtBytesShort(100 * 1024)).toBe('100 KB');
  });
});

describe('fmtEta', () => {
  it('is empty when unknown', () => {
    expect(fmtEta(null)).toBe('');
    expect(fmtEta(undefined)).toBe('');
  });

  it('shows seconds under a minute (at least 1s)', () => {
    expect(fmtEta(0)).toBe('1s left');
    expect(fmtEta(42)).toBe('42s left');
  });

  it('shows minutes from 60s', () => {
    expect(fmtEta(60)).toBe('1 min left');
    expect(fmtEta(600)).toBe('10 min left');
  });
});

describe('timeAgo', () => {
  const now = () => Date.now() / 1000;

  it('buckets recent times', () => {
    expect(timeAgo(now() - 5)).toBe('just now');
    expect(timeAgo(now() - 300)).toBe('5 min ago');
    expect(timeAgo(now() - 7300)).toBe('2 h ago');
  });

  it('falls back to a date after a day', () => {
    const t = now() - 3 * 86400;
    expect(timeAgo(t)).toBe(new Date(t * 1000).toLocaleDateString());
  });
});

describe('PHASE_LABEL', () => {
  it('has a plain sentence for every phase the server reports', () => {
    expect(PHASE_LABEL['extracting']).toBe('Preparing audio…');
    expect(PHASE_LABEL['loading_model']).toBe('Loading model… (first use downloads it)');
    expect(PHASE_LABEL['transcribing']).toBe('Transcribing…');
  });
});

describe('prefersReducedMotion', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('is true when the system asks for less motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q === '(prefers-reduced-motion: reduce)' }));
    expect(prefersReducedMotion()).toBe(true);
  });

  it('is false otherwise, when matchMedia is missing (jsdom) and when it throws', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    expect(prefersReducedMotion()).toBe(false);
    vi.stubGlobal('matchMedia', undefined);
    expect(prefersReducedMotion()).toBe(false);
    vi.stubGlobal('matchMedia', () => {
      throw new Error('nope');
    });
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('triggerDownload', () => {
  afterEach(() => vi.restoreAllMocks());

  it('clicks a temporary link to the address and removes it again', () => {
    const clicked: { href: string; download: string; inDocument: boolean }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push({ href: this.getAttribute('href')!, download: this.download, inDocument: document.body.contains(this) });
    });
    triggerDownload('/api/jobs/a/export?format=srt');
    expect(clicked).toEqual([{ href: '/api/jobs/a/export?format=srt', download: '', inDocument: true }]);
    expect(document.body.querySelector('a[href="/api/jobs/a/export?format=srt"]')).toBeNull();
  });
});
