/**
 * The live-visitor signal: while a page of the public website is open and in view, the browser tells the live-visitor
 * Worker (workers/live) "I am here" once a minute, and reads back how many pages are open right now, which the page header
 * shows (core/live-count.ts).
 *
 * What is sent: one POST to `/_live/ping?t=<code>` on the site's own address (the counter's origin) with no body, where the
 * code is 16 random characters made up when the page opened. The code is kept in memory only: no cookie, no localStorage,
 * no sessionStorage, and a reload makes a new one. When the page is closed one more POST (`&bye=1`) asks for the code to be
 * deleted at once. Nothing is sent when the browser says Do Not Track or Global Privacy Control, while the tab is hidden, or
 * after three hours on one page. The number is read with a plain GET `/_live/count`, which sends nothing and is also read
 * by a visitor who opted out. Any failure is silent. The privacy policy, the FAQ and the guides describe this.
 *
 * Loaded on its own, right after the page is up (see App), so it is not part of the first download.
 */
const PING_MS = 60_000;
/** three hours of one page: a tab left open overnight stops pinging (and stops counting as a visitor) */
const MAX_PINGS = 180;
/** coming back to a tab sooner than this after its last ping does not send another */
const MIN_GAP_MS = 30_000;
/** after this many failed reads in a row the number is hidden again */
const MAX_FAILS = 3;
/** a failed read is tried again after this long, so "…" never stays for minutes */
const RETRY_MS = 4_000;

/** true when the browser asks not to be tracked */
function optedOut(win: Window): boolean {
  const nav = win.navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = win as Window & { doNotTrack?: string };
  return nav.doNotTrack === '1' || nav.doNotTrack === 'yes' || nav.msDoNotTrack === '1' || w.doNotTrack === '1' || nav.globalPrivacyControl === true;
}

/** 16 URL-safe random characters, or '' when the browser has no secure random source (then nothing is sent) */
export function makeCode(win: Window = window): string {
  const c = win.crypto;
  if (!c?.getRandomValues) return '';
  const bytes = c.getRandomValues(new Uint8Array(12));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return win.btoa(bin).replace(/\+/g, '-').replace(/\//g, '_');
}

/** The live-visitor Worker's origin: the same site as the counter, outside its /api path (see workers/live). */
function siteOrigin(counterUrl: string): string {
  try {
    return counterUrl ? new URL(counterUrl).origin : '';
  } catch {
    return '';
  }
}

/**
 * Starts pinging, and (when `onCount` is given) reading the number of pages open now. `counterUrl` is the counter's
 * address (only its site is used). `onCount` gets the number, or undefined after three failed reads in a row (the header then
 * hides it). The number is read right after the ping has been answered, so the visitor's own page is already in it. Returns a
 * function that stops everything.
 */
export function startPresence(counterUrl: string, win: Window = window, onCount?: (active: number | undefined) => void): () => void {
  const none = () => undefined;
  const origin = siteOrigin(counterUrl);
  if (!origin || typeof win.fetch !== 'function') return none;
  // a visitor who asks not to be tracked sends no ping (no code is even made), but may still see the number
  const code = optedOut(win) ? '' : makeCode(win);
  if (!code && !onCount) return none;

  const doc = win.document;
  const base = `${origin}/_live/ping`;
  let ticks = 0;
  let sent = 0;
  let last = 0;
  let fails = 0;
  let stopped = false;
  const visible = () => doc.visibilityState !== 'hidden';

  const send = (): Promise<unknown> => {
    if (!code || !visible()) return Promise.resolve();
    sent++;
    last = Date.now();
    // keepalive: the request may outlive the page; no cookies are sent or accepted; the answer is ignored
    return win.fetch(`${base}?t=${code}`, { method: 'POST', keepalive: true, cache: 'no-store', credentials: 'omit' }).catch(none);
  };
  // a failed read is tried again soon (not at the next minute), and after three in a row the header drops the pill
  const failed = () => {
    if (++fails >= MAX_FAILS) onCount?.(undefined);
    else win.setTimeout(read, RETRY_MS);
  };
  const read = () => {
    if (!onCount || stopped || !visible()) return;
    win
      .fetch(`${origin}/_live/count`, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { active?: unknown } | null) => {
        const n = j?.active;
        if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
          fails = 0;
          onCount(Math.floor(n));
        } else failed();
      })
      .catch(failed);
  };
  const tick = () => {
    if (ticks >= MAX_PINGS || !visible()) return;
    ticks++;
    const pinged = send();
    if (onCount) void pinged.then(read);
  };

  // the page is being closed or left: ask for this code to be deleted now (a beacon survives the page; fetch is the fallback)
  const onLeave = () => {
    if (sent === 0) return;
    const url = `${base}?t=${code}&bye=1`;
    if (typeof win.navigator.sendBeacon === 'function') win.navigator.sendBeacon(url);
    else win.fetch(url, { method: 'POST', keepalive: true, cache: 'no-store', credentials: 'omit' }).catch(none);
  };
  const timer = win.setInterval(tick, PING_MS);
  const onVisible = () => {
    if (visible() && Date.now() - last >= MIN_GAP_MS) tick();
  };
  doc.addEventListener('visibilitychange', onVisible);
  win.addEventListener('pagehide', onLeave);
  tick();
  return () => {
    stopped = true;
    win.clearInterval(timer);
    doc.removeEventListener('visibilitychange', onVisible);
    win.removeEventListener('pagehide', onLeave);
  };
}
