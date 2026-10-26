import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, RendererFactory2, Signal, effect, inject, isSignal, untracked } from '@angular/core';
import { SiteService } from './site.service';

/** One question and its answer, exactly as the visitor reads them (plain text, no HTML). */
export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStepInput {
  name: string;
  text: string;
}

/** The steps of a how-to, exactly as the visitor reads them (plain text, no HTML). */
export interface HowToInput {
  name: string;
  description?: string;
  steps: HowToStepInput[];
}

/** An article (a guide): what the page shows about itself, so the data can say the same. */
export interface ArticleInput {
  headline: string;
  description: string;
  /** path without query string, e.g. "/guides/srt-vs-vtt" */
  path: string;
  /** ISO dates (YYYY-MM-DD): when it was first published and when its text last really changed */
  published: string;
  updated: string;
  /** number of words of the visible text (optional) */
  wordCount?: number;
}

/** What the title strategy knows about the page that was just opened. */
export interface RouteSchemaInput {
  /** path without query string, e.g. "/faq" */
  path: string;
  /** the page's own name, e.g. "Frequently asked questions" */
  name: string;
  /** the name to show in the breadcrumb (defaults to `name`) */
  crumb?: string;
  /** pages between Home and this one in the breadcrumb (a guide: "Guides") */
  parents?: { name: string; path: string }[];
  description: string;
  /** false for private pages and the 404 page: they get no structured data at all */
  indexable: boolean;
  /** the page is a tool page: describe it as a free web application */
  app?: boolean;
}

type Json = Record<string, unknown>;
type MaybeSignal<T> = T | Signal<T>;

/** data-vt="route:..." belongs to the current route (replaced on every navigation); "page:..." to the open page component. */
const ROUTE = 'route:';
const PAGE = 'page:';

const FEATURES = [
  'Video and audio to text in the browser',
  'No account or sign-up',
  'More than 50 languages',
  'Timestamped transcripts',
  'Export to SRT, VTT, TXT, Markdown, JSON and PDF',
];

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Puts schema.org JSON-LD in the document head, one <script type="application/ld+json" data-vt="..."> per block, and
 * removes it again when the page goes away, so a page never keeps another page's data.
 *
 *  - The title strategy calls `forRoute()` after every navigation: WebSite + Organization + WebApplication on the home
 *    page, BreadcrumbList on inner pages, WebApplication on tool pages, nothing on private pages and the 404 page.
 *  - A page component adds what only it knows with `faqPage()` and `howTo()`, called from its constructor (or a field
 *    initialiser). They clean up by themselves when the component is destroyed.
 *
 * Only mark up text the visitor can actually see on the page. SSR-safe: the DOM is reached through DOCUMENT and Renderer2.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private doc = inject(DOCUMENT);
  private renderer = inject(RendererFactory2).createRenderer(null, null);
  private site = inject(SiteService);
  /** who wrote each "page:" block last, so a page that is being replaced cannot remove its successor's data */
  private owners = new Map<string, symbol>();

  // ------------------------------------------------------------------------------------------ page API

  /**
   * FAQPage from the questions and answers the page really shows. Pass an array, or a signal when the text can change
   * (for example when the size limits arrive from the server). Call it from a constructor / field initialiser.
   * Note: Google no longer shows FAQ rich results (since May 2026), but the markup is valid and harmless.
   */
  faqPage(items: MaybeSignal<FaqItem[]>): void {
    this.pageBlock('faq', items, (list) => {
      const rows = list.filter((i) => clean(i.question) && clean(i.answer));
      return rows.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: rows.map((i) => ({
              '@type': 'Question',
              name: clean(i.question),
              acceptedAnswer: { '@type': 'Answer', text: clean(i.answer) },
            })),
          }
        : null;
    });
  }

  /**
   * HowTo from the steps the page really shows. Pass the object or a signal. Call it from a constructor / field initialiser.
   * Note: Google no longer shows How-to rich results, but the markup is valid and describes the page.
   */
  howTo(input: MaybeSignal<HowToInput>): void {
    this.pageBlock('howto', input, (h) => {
      const steps = h.steps.filter((s) => clean(s.name) && clean(s.text));
      return steps.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: clean(h.name),
            ...(h.description ? { description: clean(h.description) } : {}),
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: clean(s.name),
              text: clean(s.text),
            })),
          }
        : null;
    });
  }

  /**
   * Article data for a guide, from what the page shows (headline, dates). Pass the object or a signal. Call it from a
   * constructor / field initialiser. The dates are the ones printed on the page: never a build time or "now".
   */
  article(input: MaybeSignal<ArticleInput>): void {
    this.pageBlock('article', input, (a) => {
      const base = this.site.brand().url;
      const url = base + a.path;
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: clean(a.headline),
        description: clean(a.description),
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        datePublished: a.published,
        dateModified: a.updated,
        inLanguage: 'en',
        image: `${base}/og-image.png`,
        ...(a.wordCount ? { wordCount: a.wordCount } : {}),
        author: this.publisher(base),
        publisher: { ...this.publisher(base), logo: { '@type': 'ImageObject', url: `${base}/icon-512.png` } },
      };
    });
  }

  // ------------------------------------------------------------------------------------------ route API

  /** Called by the title strategy after every navigation. Replaces the previous route's blocks. */
  forRoute(page: RouteSchemaInput): void {
    const blocks: Record<string, Json> = {};
    if (page.indexable) {
      const base = this.site.brand().url;
      if (page.path === '/' || page.path === '') {
        blocks['organization'] = this.organization(base);
        blocks['website'] = this.website(base);
        blocks['app'] = this.webApplication(base, '/', page.description);
      } else {
        const crumb = clean(page.crumb || page.name);
        blocks['breadcrumb'] = this.breadcrumbs(base, [
          { name: 'Home', path: '/' },
          ...(page.parents ?? []),
          { name: crumb, path: page.path },
        ]);
        if (page.app) blocks['app'] = this.webApplication(base, page.path, page.description, crumb);
      }
    }
    // remove the blocks of the previous route that this route does not have
    for (const el of Array.from(this.doc.head.querySelectorAll(`script[data-vt^="${ROUTE}"]`))) {
      const key = el.getAttribute('data-vt')?.slice(ROUTE.length) ?? '';
      if (!(key in blocks)) this.renderer.removeChild(this.doc.head, el);
    }
    for (const [key, data] of Object.entries(blocks)) this.write(ROUTE + key, data);
  }

  // ------------------------------------------------------------------------------------------ builders

  private organization(base: string): Json {
    const brand = this.site.brand();
    const mail = brand.contact_email;
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: brand.name,
      url: `${base}/`,
      logo: `${base}/icon-512.png`,
      ...(mail ? { contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: mail } } : {}),
    };
  }

  /** What Google reads for the site name in results: the brand, with the domain as the alternative name. */
  private website(base: string): Json {
    const brand = this.site.brand();
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      name: brand.name,
      ...(brand.domain && brand.domain !== brand.name ? { alternateName: brand.domain } : {}),
      url: `${base}/`,
      inLanguage: 'en',
      publisher: this.publisher(base),
    };
  }

  /** The organisation by reference, with its name and address too: pages other than the home page do not carry the
   * full Organization block, and a bare @id would point at nothing there. */
  private publisher(base: string): Json {
    return { '@type': 'Organization', '@id': `${base}/#organization`, name: this.site.brand().name, url: `${base}/` };
  }

  /** A free web application. No ratings or reviews are claimed, because there are none. */
  private webApplication(base: string, path: string, description: string, label?: string): Json {
    const brand = this.site.brand();
    const url = base + (path === '/' ? '/' : path);
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: label ? `${brand.name}: ${label}` : brand.name,
      url,
      description: clean(description),
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript and a modern web browser',
      inLanguage: 'en',
      isAccessibleForFree: true,
      image: `${base}/og-image.png`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: FEATURES,
      publisher: this.publisher(base),
    };
  }

  private breadcrumbs(base: string, trail: { name: string; path: string }[]): Json {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.name,
        item: base + (t.path === '/' ? '/' : t.path),
      })),
    };
  }

  // ------------------------------------------------------------------------------------------ DOM

  private pageBlock<T>(key: string, input: MaybeSignal<T>, build: (value: T) => Json | null): void {
    const full = PAGE + key;
    const owner = Symbol(full);
    this.owners.set(full, owner);
    const apply = (value: T) => {
      if (this.owners.get(full) === owner) this.write(full, build(value));
    };
    if (isSignal(input)) {
      effect(() => {
        const value = (input as Signal<T>)();
        untracked(() => apply(value));
      });
    } else {
      apply(input as T);
    }
    inject(DestroyRef).onDestroy(() => {
      if (this.owners.get(full) === owner) {
        this.owners.delete(full);
        this.write(full, null);
      }
    });
  }

  /** Create or update the block with this key; null removes it. A block that is already in the HTML (prerendered) is reused. */
  private write(key: string, data: Json | null): void {
    const head = this.doc.head;
    let el = head.querySelector(`script[data-vt="${key}"]`);
    if (!data) {
      if (el) this.renderer.removeChild(head, el);
      return;
    }
    if (!el) {
      el = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.setAttribute(el, 'type', 'application/ld+json');
      this.renderer.setAttribute(el, 'data-vt', key);
      this.renderer.appendChild(head, el);
    }
    // "<" is escaped so that text can never close the script tag
    this.renderer.setProperty(el, 'textContent', JSON.stringify(data).replace(/</g, '\\u003c'));
  }
}
