import { printHtml } from './print-view';

describe('printHtml (the print view behind "Save as PDF")', () => {
  const created = new Date(2026, 9, 27, 12).getTime() / 1000;
  const job = {
    title: 'हिंदी <call>',
    language: 'hi',
    duration: 65,
    created_at: created,
    stats: { word_count: 3 },
    segments: [
      { start: 0, end: 1, text: 'नमस्ते' },
      { start: 1.2, end: 2, text: 'दोस्तों' },
      { start: 9, end: 10, text: 'a & b' },
    ],
  };

  it('shows the same title, facts and paragraphs as the Word file and the direct PDF', () => {
    const html = printHtml(job);
    expect(html).toContain('<title>हिंदी &lt;call&gt;</title>');
    expect(html).toContain('<h1 dir="auto">हिंदी &lt;call&gt;</h1>');
    expect(html).toContain('<p class="meta">Hindi · 01:05 · 3 words · 27 Oct 2026</p>');
    expect(html).toContain('<p dir="auto"><span class="t">[00:00]</span>नमस्ते दोस्तों</p>');
    expect(html).toContain('<p dir="auto"><span class="t">[00:09]</span>a &amp; b</p>');
    expect(html).toContain('@top-center { content: "हिंदी \\3c call>";');
  });

  it('a title cannot end the style sheet', () => {
    const html = printHtml({ ...job, title: 'x</style><img src=x onerror=alert(1)>' });
    expect(html.match(/<\/style>/g)?.length).toBe(1);
  });

  it('says so when there is no speech', () => {
    expect(printHtml({ ...job, segments: [] })).toContain('<p>No speech was transcribed.</p>');
  });
});
