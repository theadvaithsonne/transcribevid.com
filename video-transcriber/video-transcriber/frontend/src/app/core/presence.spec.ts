import { makeCode, startPresence } from './presence';

const MINUTE = 60_000;

/** A stand-in window: only what startPresence reads. */
function fakeWindow(opts: { dnt?: string; gpc?: boolean; visible?: boolean; crypto?: boolean; beacon?: boolean } = {}) {
  const listeners: Record<string, (() => void)[]> = {};
  const doc = {
    visibilityState: opts.visible === false ? 'hidden' : 'visible',
    addEventListener: (t: string, fn: () => void) => (listeners[t] ??= []).push(fn),
    removeEventListener: (t: string, fn: () => void) => (listeners[t] = (listeners[t] ?? []).filter((f) => f !== fn)),
  };
  const fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
  const sendBeacon = vi.fn(() => true);
  const winListeners: Record<string, (() => void)[]> = {};
  const win = {
    document: doc,
    navigator: { doNotTrack: opts.dnt ?? null, globalPrivacyControl: opts.gpc, sendBeacon: opts.beacon === false ? undefined : sendBeacon },
    addEventListener: (t: string, fn: () => void) => (winListeners[t] ??= []).push(fn),
    removeEventListener: (t: string, fn: () => void) => (winListeners[t] = (winListeners[t] ?? []).filter((f) => f !== fn)),
    crypto: opts.crypto === false ? undefined : { getRandomValues: (a: Uint8Array) => a.fill(7) },
    btoa: (s: string) => btoa(s),
    fetch,
    setInterval: (fn: () => void, ms: number) => setInterval(fn, ms),
    setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
    clearInterval: (id: number) => clearInterval(id),
  };
  return { win: win as unknown as Window, doc, fetch, listeners, sendBeacon, winListeners };
}

describe('presence (the live-visitor signal)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('makes a 16-character URL-safe code, and none without a secure random source', () => {
    expect(makeCode(fakeWindow().win)).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(makeCode(fakeWindow({ crypto: false }).win)).toBe('');
  });

  it('pings once at once, then once a minute, with the same code and no body', () => {
    const { win, fetch } = fakeWindow();
    const stop = startPresence('https://transcribevid.com/api', win);
    expect(fetch).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(MINUTE);
    vi.advanceTimersByTime(MINUTE);
    expect(fetch).toHaveBeenCalledTimes(3);
    const calls = fetch.mock.calls as unknown as [string, RequestInit][];
    const urls = calls.map((c) => c[0]);
    expect(urls[0]).toMatch(/^https:\/\/transcribevid\.com\/_live\/ping\?t=[A-Za-z0-9_-]{16}$/);
    expect(new Set(urls).size).toBe(1);
    const init = calls[0][1];
    expect(init.method).toBe('POST');
    expect(init.body).toBeUndefined();
    expect(init.credentials).toBe('omit');
    stop();
  });

  it('closing the page sends one "bye" for the same code so it is deleted at once, and stopping removes the listener', () => {
    const { win, fetch, sendBeacon, winListeners } = fakeWindow();
    const stop = startPresence('https://transcribevid.com/api', win);
    const code = (fetch.mock.calls as unknown as [string][])[0][0].split('t=')[1];
    winListeners['pagehide'].forEach((f) => f());
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect((sendBeacon.mock.calls as unknown as [string][])[0][0]).toBe(`https://transcribevid.com/_live/ping?t=${code}&bye=1`);
    stop();
    expect(winListeners['pagehide']).toEqual([]);
  });

  it('without sendBeacon the bye is a keepalive fetch; with nothing sent yet there is nothing to delete', () => {
    const { win, fetch, winListeners } = fakeWindow({ beacon: false });
    startPresence('https://transcribevid.com/api', win);
    winListeners['pagehide'].forEach((f) => f());
    expect(fetch).toHaveBeenCalledTimes(2);
    expect((fetch.mock.calls as unknown as [string, RequestInit][])[1][0]).toMatch(/&bye=1$/);

    const hidden = fakeWindow({ visible: false });
    startPresence('https://transcribevid.com/api', hidden.win);
    hidden.winListeners['pagehide'].forEach((f) => f());
    expect(hidden.fetch).not.toHaveBeenCalled();
    expect(hidden.sendBeacon).not.toHaveBeenCalled();
  });

  it('a trailing slash on the address does not matter', () => {
    const { win, fetch } = fakeWindow();
    startPresence('https://transcribevid.com/api/', win)();
    expect((fetch.mock.calls as unknown as [string][])[0][0]).toMatch(/^https:\/\/transcribevid\.com\/_live\/ping\?t=/);
  });

  it('sends nothing when the browser says Do Not Track or Global Privacy Control', () => {
    for (const opts of [{ dnt: '1' }, { dnt: 'yes' }, { gpc: true }]) {
      const { win, fetch } = fakeWindow(opts);
      startPresence('https://transcribevid.com/api', win);
      vi.advanceTimersByTime(5 * MINUTE);
      expect(fetch).not.toHaveBeenCalled();
    }
  });

  it('sends nothing without an address (the local edition) or without a random source', () => {
    const a = fakeWindow();
    startPresence('', a.win);
    const b = fakeWindow({ crypto: false });
    startPresence('https://transcribevid.com/api', b.win);
    vi.advanceTimersByTime(5 * MINUTE);
    expect(a.fetch).not.toHaveBeenCalled();
    expect(b.fetch).not.toHaveBeenCalled();
  });

  it('does not ping while the tab is hidden, and pings when it comes back after a while', () => {
    const { win, doc, fetch, listeners } = fakeWindow({ visible: false });
    startPresence('https://transcribevid.com/api', win);
    vi.advanceTimersByTime(3 * MINUTE);
    expect(fetch).not.toHaveBeenCalled();
    doc.visibilityState = 'visible';
    listeners['visibilitychange'].forEach((f) => f());
    expect(fetch).toHaveBeenCalledTimes(1);
    // switching straight away again does not send a second one
    listeners['visibilitychange'].forEach((f) => f());
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('stops for good when asked, and after three hours on one page', () => {
    const a = fakeWindow();
    const stop = startPresence('https://transcribevid.com/api', a.win);
    stop();
    vi.advanceTimersByTime(10 * MINUTE);
    expect(a.fetch).toHaveBeenCalledTimes(1);

    const b = fakeWindow();
    startPresence('https://transcribevid.com/api', b.win);
    vi.advanceTimersByTime(300 * MINUTE);
    expect(b.fetch).toHaveBeenCalledTimes(180);
  });

  it('a failed request is silent and does not stop the next one', async () => {
    const { win, fetch } = fakeWindow();
    fetch.mockRejectedValue(new Error('offline'));
    startPresence('https://transcribevid.com/api', win);
    vi.advanceTimersByTime(MINUTE);
    await Promise.resolve();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('keeps nothing in the browser: no cookie, no local or session storage', () => {
    const { win } = fakeWindow();
    const w = win as unknown as Record<string, unknown>;
    startPresence('https://transcribevid.com/api', win)();
    expect(w['localStorage']).toBeUndefined();
    expect(w['sessionStorage']).toBeUndefined();
    expect((w['document'] as Record<string, unknown>)['cookie']).toBeUndefined();
  });

  describe('reading the number for the header', () => {
    /** a window whose fetch answers /_live/count with `body` (a number, or a function of the call number) and everything else with 204 */
    function withCount(body: unknown | ((n: number) => unknown), opts: Parameters<typeof fakeWindow>[0] = {}) {
      const f = fakeWindow(opts);
      let reads = 0;
      f.fetch.mockImplementation(((url: string) => {
        if (String(url).endsWith('/_live/count')) {
          const b = typeof body === 'function' ? (body as (n: number) => unknown)(++reads) : body;
          return b === 'fail' ? Promise.reject(new Error('down')) : Promise.resolve(new Response(JSON.stringify(b), { status: 200 }));
        }
        return Promise.resolve(new Response(null, { status: 204 }));
      }) as never);
      return f;
    }
    const flush = async () => {
      for (let i = 0; i < 6; i++) await Promise.resolve();
    };

    it('reads the number right after the first ping has been answered (no fixed wait), then once a minute, with a plain GET that sends nothing', async () => {
      const { win, fetch } = withCount({ active: 7 });
      const seen: (number | undefined)[] = [];
      startPresence('https://transcribevid.com/api', win, (n) => seen.push(n));
      expect(seen).toEqual([]); // nothing synchronously: the read waits for the ping's answer, not for a timer
      await flush();
      expect(seen).toEqual([7]);
      await vi.advanceTimersByTimeAsync(MINUTE);
      expect(seen).toEqual([7, 7]);
      const calls = fetch.mock.calls as unknown as [string, RequestInit | undefined][];
      const reads = calls.filter((c) => c[0].endsWith('/_live/count'));
      expect(reads[0][0]).toBe('https://transcribevid.com/_live/count');
      expect(reads[0][1]?.method).toBeUndefined();
      expect(reads[0][1]?.credentials).toBe('omit');
      expect(reads[0][1]?.body).toBeUndefined();
    });

    it('a visitor who opted out of tracking sends no ping and no code, but still sees the number', async () => {
      const { win, fetch } = withCount({ active: 3 }, { dnt: '1' });
      const seen: (number | undefined)[] = [];
      startPresence('https://transcribevid.com/api', win, (n) => seen.push(n));
      await flush();
      expect(seen).toEqual([3]);
      const urls = (fetch.mock.calls as unknown as [string][]).map((c) => c[0]);
      expect(urls.every((u) => u.endsWith('/_live/count'))).toBe(true);
      expect(urls.some((u) => u.includes('t='))).toBe(false);
    });

    it('the read happens after the ping even when the ping fails', async () => {
      const f = fakeWindow();
      f.fetch.mockImplementation(((url: string) => (String(url).endsWith('/_live/count') ? Promise.resolve(new Response(JSON.stringify({ active: 5 }), { status: 200 })) : Promise.reject(new Error('offline')))) as never);
      const seen: (number | undefined)[] = [];
      startPresence('https://transcribevid.com/api', f.win, (n) => seen.push(n));
      await flush();
      expect(seen).toEqual([5]);
    });

    it('does not read while the tab is hidden', async () => {
      const { win, fetch } = withCount({ active: 3 }, { visible: false });
      startPresence('https://transcribevid.com/api', win, () => undefined);
      await vi.advanceTimersByTimeAsync(3 * MINUTE);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('ignores nonsense answers, retries soon, and hides the number after three failures in a row', async () => {
      // first read: 4. A minute later: -1, then "many", then an error, each retried 4 seconds after the one before
      const { win, fetch } = withCount((n: number) => (n === 1 ? { active: 4 } : n === 2 ? { active: -1 } : n === 3 ? { active: 'many' } : 'fail'));
      const seen: (number | undefined)[] = [];
      startPresence('https://transcribevid.com/api', win, (n) => seen.push(n));
      await flush();
      expect(seen).toEqual([4]);
      await vi.advanceTimersByTimeAsync(MINUTE); // the next ping and read: -1 is failure 1
      await flush();
      expect(seen).toEqual([4]);
      await vi.advanceTimersByTimeAsync(4_000); // retry: "many" is failure 2
      await flush();
      expect(seen).toEqual([4]);
      await vi.advanceTimersByTimeAsync(4_000); // retry: an error is failure 3: the header drops the pill
      await flush();
      expect(seen).toEqual([4, undefined]);
      const reads = (fetch.mock.calls as unknown as [string][]).filter((c) => c[0].endsWith('/_live/count')).length;
      await vi.advanceTimersByTimeAsync(20_000); // no further retries after giving up (the next read is the next minute's)
      expect((fetch.mock.calls as unknown as [string][]).filter((c) => c[0].endsWith('/_live/count')).length).toBe(reads);
    });

    it('rounds down, and a success resets the failure count', async () => {
      // two quick failures, then 2.9 (shown as 2); the count of failures starts again
      const { win } = withCount((n: number) => (n === 1 ? 'fail' : n === 2 ? 'fail' : n === 3 ? { active: 2.9 } : 'fail'));
      const seen: (number | undefined)[] = [];
      startPresence('https://transcribevid.com/api', win, (n) => seen.push(n));
      await flush();
      await vi.advanceTimersByTimeAsync(4_000);
      await flush();
      await vi.advanceTimersByTimeAsync(4_000);
      await flush();
      expect(seen).toEqual([2]);
    });

    it('stopping also stops a pending retry', async () => {
      const { win, fetch } = withCount('fail');
      const stop = startPresence('https://transcribevid.com/api', win, () => undefined);
      await flush();
      stop();
      const before = fetch.mock.calls.length;
      await vi.advanceTimersByTimeAsync(10_000);
      expect(fetch.mock.calls.length).toBe(before);
    });
  });
});
