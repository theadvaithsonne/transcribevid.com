import { ResolveFn } from '@angular/router';
import { DEFAULT_LOCALE, isLocale } from '../../i18n/locales';
import { loadToolContent } from './content';
import { ToolPageContent } from './tool-page.model';

/**
 * Loads the text of the tool page being opened (route data `tool` is its slug) before the page shows, so the prerender
 * and a first visit have the whole page, and only that page's text is downloaded.
 */
export const toolContentResolver: ResolveFn<ToolPageContent> = (route) =>
  loadToolContent(String(route.data['tool'] ?? ''), isLocale(route.data['locale']) ? route.data['locale'] : DEFAULT_LOCALE);
