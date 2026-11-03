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
});
