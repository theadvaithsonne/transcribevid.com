import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService, Params } from './i18n.service';

/**
 * `{{ 'Add another file' | t }}`, `{{ '"{name}" is ready.' | t: { name } }}`: the translation of the English text in the
 * current language (the English text when there is none). Impure on purpose: the app shell stays alive while the visitor
 * changes language, and reading the dictionary signal inside the pipe makes every template that uses it update by itself.
 */
@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  private i18n = inject(I18nService);
  transform(key: string, params?: Params): string {
    return this.i18n.t(key, params);
  }
}

/**
 * `[routerLink]="'/faq' | lp"`: the address of an English path in the current language ("/faq" -> "/es/faq"), so a link
 * inside a translated page stays in that language. English pages are untouched.
 */
@Pipe({ name: 'lp', pure: false })
export class LocalePathPipe implements PipeTransform {
  private i18n = inject(I18nService);
  transform(enPath: string): string {
    // read the language so the template depends on it (zoneless: re-rendered when the language changes)
    this.i18n.locale();
    return this.i18n.path(enPath);
  }
}
