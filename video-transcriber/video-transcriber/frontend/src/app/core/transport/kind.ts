import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Which transport this build uses (angular.json: `production` = browser; `development` / `self-hosted` = server).
 * In its own file (only the environment as a dependency) so services that ApiService's transports use, such as
 * LogService, can read it without an import cycle; `token.ts` re-exports it.
 */
export const TRANSPORT_KIND = new InjectionToken<'server' | 'browser'>('TRANSPORT_KIND', {
  providedIn: 'root',
  factory: () => environment.transport,
});
