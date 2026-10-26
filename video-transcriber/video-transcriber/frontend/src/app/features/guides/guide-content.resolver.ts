import { ResolveFn } from '@angular/router';
import { DEFAULT_LOCALE, isLocale } from '../../i18n/locales';
import { loadGuideContent } from './content';
import { GuideContent } from './guide.model';

/** Loads the text of the guide being opened (route data `guide` is its slug) before the page shows. */
export const guideContentResolver: ResolveFn<GuideContent> = (route) =>
  loadGuideContent(String(route.data['guide'] ?? ''), isLocale(route.data['locale']) ? route.data['locale'] : DEFAULT_LOCALE);
