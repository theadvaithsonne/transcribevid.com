/**
 * The text of one keyword landing page. Plain strings only: the same text is shown on the page and put in the FAQ / HowTo data.
 *
 * Two editions read the same text: the server (public website or local install) and the in-browser edition (the file never
 * leaves the device: no upload, no size limit, no queue of other visitors). Where a sentence is only true for the server, the
 * item carries a `browser` variant that replaces those fields in the in-browser edition (SiteService.inBrowser()).
 */
export interface ToolStep {
  title: string;
  text: string;
  /** the in-browser edition's wording, where the server's is not true there */
  browser?: { title?: string; text: string };
}

export interface ToolTip {
  title: string;
  text: string;
  /** the in-browser edition's wording, where the server's is not true there */
  browser?: { title?: string; text: string };
}

export interface ToolFaq {
  question: string;
  /** may contain {limits}, replaced with the announced size / length limits */
  answer: string;
  /** the in-browser edition's question and answer, where the server's are not true there (no placeholders: there are no limits) */
  browser?: { question?: string; answer: string };
}

export interface ToolDownload {
  /** format name, e.g. "SRT" */
  name: string;
  /** what it is good for */
  use: string;
}

/** What the drop box in the hero accepts: a video page takes video and audio (like the main uploader), an audio page takes audio only. */
export type DropKind = 'video' | 'audio';

export interface ToolPageContent {
  /** short name of the page, used for the breadcrumb when the route gives no label */
  eyebrow: string;
  /** the one H1 of the page (unique per page) */
  h1: string;
  /** unique intro, one or two sentences */
  lead: string;
  /** which files the hero drop box accepts */
  dropKind: DropKind;
  /** what the drop box asks for: "Drop your {dropNoun} here, or choose a file" (e.g. "MP3", "video", "voice recording") */
  dropNoun: string;
  /** recording is part of this page's job: a quiet "Record with your microphone" link (to the home page) under the drop box */
  record?: boolean;
  whyTitle: string;
  /** paragraphs: why / when to use it */
  why: string[];
  /** the in-browser edition's paragraphs, when one of `why` is only true for the server */
  browserWhy?: string[];
  howTitle: string;
  /** one sentence for the HowTo data */
  howToDescription: string;
  /** exactly four steps */
  steps: ToolStep[];
  formatsTitle: string;
  formatsIntro: string;
  uploadTitle: string;
  /** file types that can be uploaded, e.g. "MP4" */
  accepts: string[];
  downloads: ToolDownload[];
  /** a short worked example shown as a code block (the SRT page) */
  example?: string;
  exampleLabel?: string;
  tipsTitle: string;
  tips: ToolTip[];
  /** four or five questions that are specific to this page */
  faqs: ToolFaq[];
}
