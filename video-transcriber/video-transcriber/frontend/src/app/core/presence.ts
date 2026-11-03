/**
 * The live-visitor signal: while a page of the public website is open and in view, the browser tells the live-visitor
 * Worker (workers/live) "I am here" once a minute, so the owner can see how many people are using the site right now.
 *
 * What is sent: one POST to `<counter>/ping?t=<code>` with no body, where the code is 16 random characters made up when the
 * page opened. The code is kept in memory only: no cookie, no localStorage, no sessionStorage, and a reload makes a new
 * one. Nothing is sent when the browser says Do Not Track or Global Privacy Control, while the tab is hidden, or after
 * three hours on one page. Any failure is silent. The privacy policy, the FAQ and the guides describe this.
 *
 * Loaded on its own, a few seconds after the page is up (see App), so it is not part of the first download.
 */
const PING_MS = 60_000;
/** three hours of one page: a tab left open overnight stops pinging (and stops counting as a visitor) */
const MAX_PINGS = 180;
/** coming back to a tab sooner than this after its last ping does not send another */
const MIN_GAP_MS = 30_000;

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

/** Starts pinging. `counterUrl` is the counter's address without a trailing slash. Returns a function that stops it. */
export function startPresence(counterUrl: string, win: Window = window): () => void {
  const none = () => undefined;
  const code = makeCode(win);
  if (!counterUrl || !code || optedOut(win) || typeof win.fetch !== 'function') return none;

  const doc = win.document;
  let sent = 0;
  let last = 0;
  const send = () => {
    if (doc.visibilityState === 'hidden' || sent >= MAX_PINGS) return;
    sent++;
    last = Date.now();
    // keepalive: the request may outlive the page; no cookies are sent or accepted; the answer is ignored
    win
      .fetch(`${counterUrl.replace(/\/+$/, '')}/ping?t=${code}`, { method: 'POST', keepalive: true, cache: 'no-store', credentials: 'omit' })
      .catch(none);
  };
  const timer = win.setInterval(send, PING_MS);
  const onVisible = () => {
    if (doc.visibilityState === 'visible' && Date.now() - last >= MIN_GAP_MS) send();
  };
  doc.addEventListener('visibilitychange', onVisible);
  send();
  return () => {
    win.clearInterval(timer);
    doc.removeEventListener('visibilitychange', onVisible);
  };
}
