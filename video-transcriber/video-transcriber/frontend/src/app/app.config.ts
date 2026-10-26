import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TitleStrategy, provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler, errorLogInterceptor } from './core/log.service';
import { BrandTitleStrategy } from './core/title.service';
import { I18nService } from './i18n/i18n.service';
import { LocaleHintService } from './i18n/locale-hint.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // the language follows the router (applied just before a page is created); the hint service only acts in the browser
    provideAppInitializer(() => {
      inject(I18nService).start();
      inject(LocaleHintService).start();
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([errorLogInterceptor])),
    // Blocking initial navigation: the app starts only once the first page's lazy chunk is loaded, so the prerendered HTML
    // (or the shell's text) stays on screen until the real page can replace it in one step, with no blank frame.
    provideRouter(routes, withComponentInputBinding(), withEnabledBlockingInitialNavigation()),
    { provide: TitleStrategy, useExisting: BrandTitleStrategy },
  ],
};
