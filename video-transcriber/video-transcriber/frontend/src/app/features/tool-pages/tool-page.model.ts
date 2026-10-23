/** The text of one keyword landing page. Plain strings only: the same text is shown on the page and put in the FAQ / HowTo data. */
export interface ToolStep {
  title: string;
  text: string;
}

export interface ToolTip {
  title: string;
  text: string;
}

export interface ToolFaq {
  question: string;
  /** may contain {limits}, replaced with the announced size / length limits */
  answer: string;
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
