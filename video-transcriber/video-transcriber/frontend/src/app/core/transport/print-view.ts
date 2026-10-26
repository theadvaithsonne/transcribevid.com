/**
 * PDF in the browser edition when the direct PDF (engine/export/pdf.ts) cannot be written, i.e. the text needs more
 * than the standard PDF fonts (Hindi in Devanagari, Chinese, Arabic, ...): a print-styled copy of the transcript in a
 * hidden frame, then the browser's print dialog ("Save as PDF"). A4, selectable text in any script (the browser's
 * fonts), the title on every page after the first, "Page X of Y" at the bottom (Chrome; Firefox / Safari print
 * without the margin boxes). Title, facts and paragraphs come from engine/export/document.ts, like the .docx and the
 * direct PDF.
 */
import { FACTS_SEPARATOR, NO_SPEECH, transcriptDocument, type DocumentJob } from '../../engine/export/document';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

/** A CSS string literal (for the running title in the page margin); `<` escaped so a title cannot end the <style>. */
const cssString = (s: string) => `"${s.replace(/[\\"]/g, (c) => `\\${c}`).replace(/</g, '\\3c ').replace(/[\n\r\f]/g, ' ')}"`;

/** The print document of one transcript (exported for the spec). */
export function printHtml(transcript: DocumentJob): string {
  const doc = transcriptDocument(transcript);
  const meta = doc.facts.map(esc);
  const body = doc.paragraphs
    .map((p) => `<p dir="auto"><span class="t">${esc(p.stamp)}</span>${esc(p.text)}</p>`)
    .join('\n');
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${esc(doc.title)}</title>
<style>
@page { size: A4; margin: 18mm 16mm 20mm;
  @top-center { content: ${cssString(doc.title)}; font: 9pt sans-serif; color: #555; }
  @bottom-center { content: "Page " counter(page) " of " counter(pages); font: 9pt sans-serif; color: #555; } }
@page :first { @top-center { content: none; } }
html, body { background: #fff; color: #111; }
body { margin: 0; font: 11pt/1.55 system-ui, "Noto Sans", "Segoe UI", Arial, sans-serif; }
h1 { font-size: 18pt; line-height: 1.25; margin: 0 0 4pt; }
.meta { color: #555; font-size: 9.5pt; margin: 0 0 14pt; }
p { margin: 0 0 9pt; orphans: 2; widows: 2; }
.t { color: #666; font-size: 8.5pt; margin-right: 6pt; font-variant-numeric: tabular-nums; }
</style></head>
<body><h1 dir="auto">${esc(doc.title)}</h1>${meta.length ? `<p class="meta">${meta.join(FACTS_SEPARATOR)}</p>` : ''}
${body || `<p>${NO_SPEECH}</p>`}
</body></html>`;
}

/** Opens the print dialog for the transcript. Returns false when the browser has no way to print here. */
export function printTranscript(job: DocumentJob, doc: Document = document): boolean {
  const frame = doc.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.setAttribute('tabindex', '-1');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  frame.srcdoc = printHtml(job);
  let printed = false;
  frame.onload = () => {
    const w = frame.contentWindow;
    if (!w || printed) return;
    printed = true;
    try {
      w.focus();
      w.print(); // blocks until the dialog closes in most browsers
    } finally {
      setTimeout(() => frame.remove(), 60_000); // Safari prints asynchronously: keep the frame a while
    }
  };
  doc.body.appendChild(frame);
  return typeof frame.contentWindow?.print === 'function' || !frame.contentWindow;
}
