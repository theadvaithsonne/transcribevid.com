import { InjectionToken, inject } from '@angular/core';
import { BrowserTransport } from './browser-transport';
import { TRANSPORT_KIND } from './kind';
import { ServerTransport } from './server-transport';
import type { Transport } from './transport';

export { TRANSPORT_KIND } from './kind';

/**
 * The transport behind ApiService, chosen by the build configuration. A spec can provide `TRANSPORT_KIND`, or
 * `{ provide: TRANSPORT, useExisting: ServerTransport | BrowserTransport }`, or a fake.
 */
export const TRANSPORT = new InjectionToken<Transport>('TRANSPORT', {
  providedIn: 'root',
  factory: () => (inject(TRANSPORT_KIND) === 'browser' ? inject(BrowserTransport) : inject(ServerTransport)),
});
