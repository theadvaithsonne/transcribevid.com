import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalePathPipe } from './t.pipe';

/** One piece of a sentence with light markup. */
export interface RichPart {
  kind: 'text' | 'bold' | 'link';
  text: string;
  /** link target: an English path of this site ("/faq") or a full https address */
  href?: string;
  external?: boolean;
}

const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Splits a sentence with the two bits of markup translators may use: `**bold**` and `[label](/path)`. Anything else is
 * plain text (never HTML), so a translation can not inject markup. A link to "/path" is an English path of this site; the
 * component localises it, so the same sentence works in every language.
 */
export function parseRich(text: string): RichPart[] {
  const parts: RichPart[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) parts.push({ kind: 'text', text: text.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ kind: 'bold', text: m[1] });
    else parts.push({ kind: 'link', text: m[2], href: m[3], external: /^https?:\/\//.test(m[3]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) });
  return parts;
}

/**
 * The words of a sentence with the markup taken away: `**bold**` -> bold, `[label](/path)` -> label. For plain-text uses of a
 * translated sentence (structured data, a title attribute) where no markup may appear.
 */
export function plainText(text: string): string {
  return parseRich(text)
    .map((p) => p.text)
    .join('');
}

/**
 * A sentence with bold words and links, e.g. `<app-rich [text]="'Read **How it works** or [ask us](/contact).' | t" />`.
 * Links are real anchors (crawlers and keyboards work) and stay in the page's language.
 */
@Component({
  selector: 'app-rich',
  imports: [RouterLink, LocalePathPipe],
  template: `@for (p of parts(); track $index) {@switch (p.kind) {@case ('bold') {<b>{{ p.text }}</b>}@case ('link') {@if (p.external) {<a [href]="p.href" target="_blank" rel="noopener noreferrer">{{ p.text }}</a>} @else {<a [routerLink]="p.href! | lp">{{ p.text }}</a>}}@default {{{ p.text }}}}}`,
})
export class RichText {
  readonly text = input.required<string>();
  readonly parts = computed(() => parseRich(this.text()));
}
