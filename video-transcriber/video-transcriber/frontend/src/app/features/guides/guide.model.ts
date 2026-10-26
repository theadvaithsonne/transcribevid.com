import { ToolFaq, ToolLink } from '../tool-pages/tool-page.model';

/**
 * The text of one guide. Plain strings only: the same text is shown on the page and (the questions) put in the FAQPage
 * data. Where a sentence is only true for one edition (the in-browser website or a self-hosted server), the block carries
 * a `browser` variant that replaces its paragraphs / list in the in-browser edition (SiteService.inBrowser()).
 */
export interface GuideStep {
  title: string;
  text: string;
}

/** A list item: an optional bold lead-in, then the text. */
export interface GuideBullet {
  title?: string;
  text: string;
}

export interface GuideTable {
  /** what the table shows (a visible caption, also its accessible name) */
  caption: string;
  head: string[];
  rows: string[][];
}

export interface GuideBlock {
  /** the H2 of the section */
  title: string;
  paragraphs?: string[];
  /** a short list: optional bold lead-in, then the text */
  bullets?: GuideBullet[];
  /** numbered steps */
  steps?: GuideStep[];
  /** a worked example in a code block (a snippet of an SRT file, a command) */
  code?: { label: string; text: string };
  table?: GuideTable;
  /** paragraphs shown after the list / steps / code / table */
  after?: string[];
  /** the in-browser edition's wording, where the server's is not true there */
  browser?: { paragraphs?: string[]; bullets?: GuideBullet[]; steps?: GuideStep[]; after?: string[] };
}

export interface GuideContent {
  /** the one H1 of the page (unique per guide) */
  h1: string;
  /** unique intro: two or three sentences that answer the question in short */
  lead: string;
  /** reading time, whole minutes (about 200 words a minute) */
  readingMinutes: number;
  /** the tool page this guide leads to: its quiet call to action at the end links there, e.g. "/srt-subtitle-generator" */
  toolPath: string;
  /** what the call to action says, e.g. "Make an SRT file from your video" */
  toolCta: string;
  /** six to nine sections, each with an H2 */
  blocks: GuideBlock[];
  /** three to five questions that are specific to this guide */
  faqs: ToolFaq[];
  /** "Keep reading": three to five links to tool pages and other guides, each with a sentence saying what is there */
  links: ToolLink[];
}
