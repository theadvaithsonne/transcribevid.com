import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

/** What a tool page is called in a link ("MP4 to text"): its English label, plus the path that identifies it. */
export interface ToolLabelled {
  path: string;
  label: string;
}

/**
 * `{{ tool | toolLabel }}`: the page's name in the current language, from the dictionary key `label:<path>` that every
 * translated page has (the English label when there is none). Impure on purpose, like the `t` pipe: the app shell stays
 * alive while the visitor changes language.
 */
@Pipe({ name: 'toolLabel', pure: false })
export class ToolLabelPipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(page: ToolLabelled): string {
    const key = `label:${page.path}`;
    const hit = this.i18n.t(key);
    return hit === key ? page.label : hit;
  }
}
