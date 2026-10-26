import { EXPORT_GOLDENS, type GoldenCase } from './export-goldens';
import {
  buildCues,
  EXPORT_FORMATS,
  exportFilename,
  fmtTs,
  paragraphs,
  pyQuote,
  render,
  toMarkdown,
  toTxt,
  wrap,
  type ExportJob,
} from './index';

/** Golden cases written by backend/tools/dump_engine_goldens.py from the production Python code. */
const golden = (group: string): GoldenCase[] => {
  const cases = EXPORT_GOLDENS[group];
  if (!cases?.length) throw new Error(`no golden cases for ${group}`);
  return cases;
};

describe('fmt_ts', () => {
  for (const c of golden('fmt_ts')) {
    it(c.name, () => expect(fmtTs(c.input.sec, c.input.style)).toBe(c.expected));
  }
});

describe('_wrap', () => {
  for (const c of golden('wrap')) {
    it(c.name, () => expect(wrap(c.input.text, c.input.max_chars, c.input.max_lines)).toBe(c.expected));
  }
});

describe('build_cues', () => {
  for (const c of golden('cues')) {
    it(c.name, () => {
      const o = c.input.options;
      expect(buildCues(c.input.segments, { maxChars: o.max_chars, maxLines: o.max_lines })).toEqual(
        c.expected,
      );
    });
  }
});

describe('exports are byte-identical to formats.render', () => {
  for (const c of golden('jobs')) {
    describe(c.name, () => {
      const job = c.input as ExportJob;
      const e = c.expected;
      if (!e.txt) {
        it('markdown', () => expect(toMarkdown(job)).toBe(e.md.body));
        return;
      }
      for (const fmt of ['txt', 'plain', 'srt', 'vtt', 'json', 'md', 'bogus']) {
        it(fmt, () => {
          const r = render(job, fmt);
          expect(r.body).toBe(e[fmt].body);
          expect([r.mime, r.ext]).toEqual([e[fmt].mime, e[fmt].ext]);
        });
      }
      it('subtitle line length and line count', () => {
        expect(render(job, 'srt', { maxChars: 20, maxLines: 1 }).body).toBe(e.srt_20x1);
        expect(render(job, 'srt', { maxChars: 80, maxLines: 3 }).body).toBe(e.srt_80x3);
        expect(render(job, 'vtt', { maxChars: 30, maxLines: 2 }).body).toBe(e.vtt_30x2);
      });
      it('text without timestamps and the paragraphs', () => {
        expect(toTxt(job.segments, false)).toBe(e.txt_no_timestamps);
        expect(paragraphs(job.segments).map((p) => p.map((s) => s.id))).toEqual(e.paragraphs);
      });
      it('file names', () => {
        for (const fmt of Object.keys(EXPORT_FORMATS)) {
          expect(exportFilename(job.title, fmt)).toBe(e.filenames[fmt]);
          expect(pyQuote(exportFilename(job.title, fmt))).toBe(e.quoted[fmt]);
        }
      });
    });
  }

  it('sends PDF to the print route', () => {
    expect(() => render({ title: 'T', segments: [] }, 'pdf')).toThrowError(/print/);
    expect(exportFilename('T', 'bogus')).toBe('T.txt');
  });
});
