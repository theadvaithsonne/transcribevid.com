import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SiteService } from './site.service';
import { StructuredDataService } from './structured-data.service';

/** The home page description (also the fallback for a page that has none): 155 characters or fewer. */
export const DEFAULT_DESCRIPTION =
  'Free video to text and audio to text transcription. No login, no daily limit, 50+ languages. Get timestamped text and export SRT, VTT, TXT, PDF.';

/** The robots tag of a page that may be found: indexed, links followed, and Google may show the share image large. */
export const INDEXABLE = 'index, follow, max-image-preview:large';

/** What a page tells the browser and search engines about itself. */
export interface PageMeta {
  /** the page's own name; the brand is appended ("How it works - TranscribeVid") */
  title: string;
  description?: string;
  /** keep the page out of search results (private transcripts, admin pages, the 404 page) */
  noindex?: boolean;
  /** path for the canonical / og:url link; defaults to the current location */
  path?: string;
  /** share image: a path on this site ("/og-image.png", the default) or a full URL */
  image?: string;
  /** what the share image shows (og:image:alt); the default image has its own */
  imageAlt?: string;
  /** Open Graph type; "website" unless a page is an article */
  type?: string;
}

/** Sets the document title and the description / Open Graph / Twitter / canonical / robots tags. */
@Injectable({ providedIn: 'root' })
export class TitleService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);
  private site = inject(SiteService);

  /** The full title for a page name: "How it works - TranscribeVid" (just the brand for the home page without a name). */
  full(title: string): string {
    const brand = this.site.brand().name;
    return title && title !== brand ? `${title} - ${brand}` : brand;
  }

  set(page: PageMeta) {
    const brand = this.site.brand();
    const full = this.full(page.title);
    const description = page.description || DEFAULT_DESCRIPTION;
    this.title.setTitle(full);
    this.tag('name', 'description', description);
    this.tag('property', 'og:title', full);
    this.tag('property', 'og:description', description);
    this.tag('property', 'og:site_name', brand.name);
    this.tag('property', 'og:type', page.type || 'website');
    this.tag('name', 'twitter:card', 'summary_large_image');
    this.tag('name', 'twitter:title', full);
    this.tag('name', 'twitter:description', description);
    this.tag('name', 'robots', page.noindex ? 'noindex, nofollow' : INDEXABLE);

    // one address per page: no query string, no fragment, no trailing slash (except the home page)
    const raw = (page.path ?? this.doc.location?.pathname ?? '/').split(/[?#]/)[0] || '/';
    const path = (raw.startsWith('/') ? raw : '/' + raw).replace(/(.)\/+$/, '$1');
    const url = brand.url + (path === '/' ? '/' : path);
    this.tag('property', 'og:url', url);

    const image = this.absolute(brand.url, page.image || '/og-image.png');
    this.tag('property', 'og:image', image);
    this.tag('name', 'twitter:image', image);
    if (page.imageAlt) {
      this.tag('property', 'og:image:alt', page.imageAlt);
      this.tag('name', 'twitter:image:alt', page.imageAlt);
    }

    // a page that must not be indexed has no canonical address
    this.canonical(page.noindex ? null : url);
  }

  private absolute(base: string, src: string): string {
    return /^https?:\/\//i.test(src) ? src : base + (src.startsWith('/') ? src : '/' + src);
  }

  private tag(attr: 'name' | 'property', key: string, content: string) {
    this.meta.updateTag({ [attr]: key, content }, `${attr}='${key}'`);
  }

  private canonical(href: string | null) {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }
}

/** What a route's `data` may carry besides the title. */
interface RouteData {
  description?: string;
  noindex?: boolean;
  /** short name for the breadcrumb (defaults to the page title) */
  label?: string;
  /** a tool page: also described as a free web application */
  app?: boolean;
}

/**
 * Every route's `title` becomes "<title> - TranscribeVid"; `data.description` / `data.noindex` feed the meta tags and
 * the page's structured data (JSON-LD) follows the same route data.
 */
@Injectable({ providedIn: 'root' })
export class BrandTitleStrategy extends TitleStrategy {
  private pages = inject(TitleService);
  private schema = inject(StructuredDataService);

  override updateTitle(snapshot: RouterStateSnapshot) {
    let leaf = snapshot.root;
    while (leaf.firstChild) leaf = leaf.firstChild;
    const data = leaf.data as RouteData;
    const path = snapshot.url.split(/[?#]/)[0] || '/';
    const title = this.buildTitle(snapshot) ?? '';
    const noindex = data.noindex === true;
    this.pages.set({ title, description: data.description, noindex, path });
    this.schema.forRoute({
      path: path.replace(/(.)\/+$/, '$1'),
      name: title,
      crumb: data.label,
      description: data.description || DEFAULT_DESCRIPTION,
      indexable: !noindex,
      app: data.app === true,
    });
  }
}
