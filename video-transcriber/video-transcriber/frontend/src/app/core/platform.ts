import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

/**
 * True in the visitor's browser, false while the build prerenders a page. Everything that needs the network, timers or
 * browser APIs (polling, storage, listeners on the document) must only start when this is true. A token (not a bare
 * `isPlatformBrowser(...)` call) so a test can switch it.
 */
export const IS_BROWSER = new InjectionToken<boolean>('IS_BROWSER', {
  providedIn: 'root',
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
});

/** Attribute the prerender puts on <html>: "this page was built from the public website's static HTML". */
export const PRERENDERED_ATTR = 'data-prerendered';

/**
 * Should the page present itself as the public website (default brand, announced limits, public wording) until the server
 * has answered? Always while prerendering, and in the browser when the page came from prerendered HTML, so the first
 * client render shows exactly the words of that HTML (no jump when the app takes over). A page that was not prerendered
 * (the client shell, `ng serve`) makes no claim until /api/health answers, as before.
 */
export const ASSUME_PUBLIC = new InjectionToken<boolean>('ASSUME_PUBLIC', {
  providedIn: 'root',
  factory: () => {
    if (isPlatformServer(inject(PLATFORM_ID))) return true;
    try {
      return inject(DOCUMENT).documentElement.hasAttribute(PRERENDERED_ATTR);
    } catch {
      return false;
    }
  },
});
