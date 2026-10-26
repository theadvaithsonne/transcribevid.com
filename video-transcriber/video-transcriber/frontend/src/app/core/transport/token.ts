import { InjectionToken, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BrowserTransport } from './browser-transport';
import { ServerTransport } from './server-transport';
import type { Transport } from './transport';

/** Which transport this build uses (angular.json: `production` = browser; `development` / `self-hosted` = server). */
export const TRANSPORT_KIND = new InjectionToken<'server' | 'browser'>('TRANSPORT_KIND', {
  providedIn: 'root',
  factory: () => environment.transport,
});

/**
 * The transport behind ApiService, chosen by the build configuration. A spec can provide `TRANSPORT_KIND`, or
 * `{ provide: TRANSPORT, useExisting: ServerTransport | BrowserTransport }`, or a fake.
 */
export const TRANSPORT = new InjectionToken<Transport>('TRANSPORT', {
  providedIn: 'root',
  factory: () => (inject(TRANSPORT_KIND) === 'browser' ? inject(BrowserTransport) : inject(ServerTransport)),
});
