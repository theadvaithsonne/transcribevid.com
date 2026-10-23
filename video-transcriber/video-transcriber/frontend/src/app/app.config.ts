import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TitleStrategy, provideRouter, withComponentInputBinding, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { GlobalErrorHandler, errorLogInterceptor } from './core/log.service';
import { BrandTitleStrategy } from './core/title.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([errorLogInterceptor])),
    // Blocking initial navigation: the app starts only once the first page's lazy chunk is loaded, so the prerendered HTML
    // (or the shell's text) stays on screen until the real page can replace it in one step, with no blank frame.
    provideRouter(routes, withComponentInputBinding(), withEnabledBlockingInitialNavigation()),
    { provide: TitleStrategy, useExisting: BrandTitleStrategy },
  ],
};
