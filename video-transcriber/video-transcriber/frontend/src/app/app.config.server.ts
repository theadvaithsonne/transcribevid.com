import { DOCUMENT } from '@angular/common';
import { ApplicationConfig, inject, mergeApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { PRERENDERED_ATTR } from './core/platform';

/** Only used by the production build's prerender (src/main.server.ts). `ng serve` and the browser never load it. */
const serverOnly: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // the browser reads this mark to start from the same words the HTML already shows (core/platform.ts)
    provideAppInitializer(() => inject(DOCUMENT).documentElement.setAttribute(PRERENDERED_ATTR, '')),
  ],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverOnly);
