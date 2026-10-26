/**
 * The Word export (.docx): the transcript document (document.ts) as a minimal Office Open XML package (ECMA-376 part
 * 1 and 2), zipped without compression (zip.ts). No dependency and no fonts to ship: Word, LibreOffice and Google Docs
 * draw and shape every script themselves (Devanagari, Arabic, CJK), so any transcript works.
 *
 * Parts: [Content_Types].xml, _rels/.rels, docProps/core.xml (the title), word/document.xml, word/styles.xml,
 * word/settings.xml (current Word mode, not "Compatibility Mode") and word/_rels/document.xml.rels. Element order
 * inside w:pPr / w:rPr follows the schema's sequences: Word refuses a file whose order is wrong.
 */
import { FACTS_SEPARATOR, NO_SPEECH, RTL_LANGUAGES, transcriptDocument, type DocumentJob, type TranscriptDocument } from './document';
import { zipStore, type ZipFile } from './zip';

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface DocxOptions {
  /** the author in the file's properties (the site's name) */
  creator?: string;
  /** the time the file is made (file properties and ZIP entry dates); tests pass a fixed one */
  now?: Date;
}

const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';

/** Word's complex-script languages besides the RTL ones: their text is set with w:cs fonts and w:lang w:bidi. */
const COMPLEX_LANGUAGES = new Set('hi mr ne sa bn as pa gu ta te kn ml si th lo km my bo'.split(' '));
/** East Asian languages: w:lang w:eastAsia (line breaking, the matching Han glyphs) */
const EAST_ASIAN_LANGUAGES = new Set('zh ja ko yue'.split(' '));

/** Characters XML 1.0 does not allow at all (controls, lone surrogates, U+FFFE/U+FFFF): dropped. */
const NOT_XML = /[^\u0009\u000a\u000d -퟿-�\u{10000}-\u{10ffff}]/gu;

/** Text for an XML element or a double-quoted attribute. */
export function xmlEscape(text: string): string {
  return text
    .replace(NOT_XML, '')
    .replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
}

/** A run of text; `rtl` marks Arabic / Hebrew text so Word orders it right to left. */
function run(text: string, opts: { style?: string; rtl?: boolean } = {}): string {
  const props = (opts.style ? `<w:rStyle w:val="${opts.style}"/>` : '') + (opts.rtl ? '<w:rtl/>' : '');
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>`;
}

/** A paragraph of runs; `bidi` makes it a right-to-left paragraph (it starts at the right margin). */
function paragraph(runs: string, opts: { style?: string; bidi?: boolean } = {}): string {
  const props = (opts.style ? `<w:pStyle w:val="${opts.style}"/>` : '') + (opts.bidi ? '<w:bidi/>' : '');
  return `<w:p>${props ? `<w:pPr>${props}</w:pPr>` : ''}${runs}</w:p>`;
}

/** word/document.xml: the title, the facts line, then one paragraph per transcript paragraph, A4 pages. */
export function documentXml(doc: TranscriptDocument): string {
  const body: string[] = [paragraph(run(doc.title, { rtl: doc.titleRtl }), { style: 'Title', bidi: doc.titleRtl })];
  if (doc.facts.length) body.push(paragraph(run(doc.facts.join(FACTS_SEPARATOR)), { style: 'Subtitle' }));
  for (const p of doc.paragraphs) {
    body.push(paragraph(run(`${p.stamp} `, { style: 'Timestamp' }) + run(p.text, { rtl: p.rtl }), { bidi: p.rtl }));
  }
  if (!doc.paragraphs.length) body.push(paragraph(run(NO_SPEECH)));
  // A4 (11906 x 16838 twentieths of a point), 22 mm margins like the server's PDF
  const section =
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
    '<w:pgMar w:top="1247" w:right="1247" w:bottom="1247" w:left="1247" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>';
  return `${XML_DECL}<w:document xmlns:w="${W}" xmlns:r="${REL}"><w:body>${body.join('')}${section}</w:body></w:document>`;
}

/**
 * The language attribute for the whole text: Word keeps one language per script class, so Hindi goes in w:bidi (the
 * complex-script language, which also covers Indic scripts), Chinese in w:eastAsia, French in w:val. A Hinglish
 * transcript (language hi, Latin letters) then keeps Word's own language for its Latin text.
 */
function langElement(lang: string | null): string {
  if (!lang) return '';
  const attr = RTL_LANGUAGES.has(lang) || COMPLEX_LANGUAGES.has(lang) ? 'w:bidi' : EAST_ASIAN_LANGUAGES.has(lang) ? 'w:eastAsia' : 'w:val';
  return `<w:lang ${attr}="${xmlEscape(lang)}"/>`;
}

/**
 * word/styles.xml: Arial 11 pt (Helvetica's metrics, like the PDF; Word substitutes a font for scripts Arial lacks),
 * the built-in Title and Subtitle styles (Google Docs and LibreOffice map them to their own), and a character style
 * for the times. Every size is set for complex scripts too (w:szCs), or Hindi and Arabic would come out at 10 pt.
 */
export function stylesXml(lang: string | null): string {
  const size = (halfPoints: number) => `<w:sz w:val="${halfPoints}"/><w:szCs w:val="${halfPoints}"/>`;
  return (
    `${XML_DECL}<w:styles xmlns:w="${W}">` +
    '<w:docDefaults>' +
    `<w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>${size(22)}${langElement(lang)}</w:rPr></w:rPrDefault>` +
    '<w:pPrDefault><w:pPr><w:spacing w:after="180" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
    '</w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/>' +
    '<w:rPr><w:color w:val="1F2328"/></w:rPr></w:style>' +
    '<w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/>' +
    '<w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>' +
    '<w:uiPriority w:val="10"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:after="80" w:line="240" w:lineRule="auto"/>' +
    `<w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:bCs/>${size(44)}</w:rPr></w:style>` +
    '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>' +
    '<w:uiPriority w:val="11"/><w:qFormat/><w:pPr><w:spacing w:after="360"/></w:pPr>' +
    `<w:rPr><w:color w:val="6B7280"/>${size(19)}</w:rPr></w:style>` +
    '<w:style w:type="character" w:styleId="Timestamp"><w:name w:val="Timestamp"/><w:basedOn w:val="DefaultParagraphFont"/>' +
    `<w:uiPriority w:val="99"/><w:rPr><w:b/><w:bCs/><w:color w:val="2563EB"/>${size(18)}</w:rPr></w:style>` +
    '</w:styles>'
  );
}

const SETTINGS_XML =
  `${XML_DECL}<w:settings xmlns:w="${W}"><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/>` +
  '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>' +
  '</w:settings>';

const CONTENT_TYPES_XML =
  `${XML_DECL}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>' +
  '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
  '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
  '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>' +
  '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
  '</Types>';

const PACKAGE_RELS_XML =
  `${XML_DECL}<Relationships xmlns="${PKG_REL}">` +
  `<Relationship Id="rId1" Type="${REL}/officeDocument" Target="word/document.xml"/>` +
  `<Relationship Id="rId2" Type="${PKG_REL}/metadata/core-properties" Target="docProps/core.xml"/>` +
  '</Relationships>';

const DOCUMENT_RELS_XML =
  `${XML_DECL}<Relationships xmlns="${PKG_REL}">` +
  `<Relationship Id="rId1" Type="${REL}/styles" Target="styles.xml"/>` +
  `<Relationship Id="rId2" Type="${REL}/settings" Target="settings.xml"/>` +
  '</Relationships>';

/** docProps/core.xml: title, author, dates (W3CDTF without milliseconds, which Word insists on). */
export function coreXml(doc: TranscriptDocument, creator: string, now: Date): string {
  const when = (Number.isNaN(now.getTime()) ? new Date(0) : now).toISOString().replace(/\.\d{3}Z$/, 'Z');
  return (
    `${XML_DECL}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ` +
    'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    `<dc:title>${xmlEscape(doc.title)}</dc:title>` +
    (creator ? `<dc:creator>${xmlEscape(creator)}</dc:creator>` : '') +
    (doc.lang ? `<dc:language>${xmlEscape(doc.lang)}</dc:language>` : '') +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${when}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${when}</dcterms:modified>` +
    '</cp:coreProperties>'
  );
}

/** The package parts in archive order ([Content_Types].xml first, as Office writes it). */
export function docxParts(job: DocumentJob, options: DocxOptions = {}): ZipFile[] {
  const doc = transcriptDocument(job);
  const now = options.now ?? new Date();
  const utf8 = new TextEncoder();
  const parts: [string, string][] = [
    ['[Content_Types].xml', CONTENT_TYPES_XML],
    ['_rels/.rels', PACKAGE_RELS_XML],
    ['docProps/core.xml', coreXml(doc, options.creator ?? '', now)],
    ['word/document.xml', documentXml(doc)],
    ['word/styles.xml', stylesXml(doc.lang)],
    ['word/settings.xml', SETTINGS_XML],
    ['word/_rels/document.xml.rels', DOCUMENT_RELS_XML],
  ];
  return parts.map(([name, xml]) => ({ name, data: utf8.encode(xml) }));
}

/** The .docx file of a transcript. */
export function writeDocx(job: DocumentJob, options: DocxOptions = {}): Uint8Array<ArrayBuffer> {
  return zipStore(docxParts(job, options), options.now ?? new Date());
}
