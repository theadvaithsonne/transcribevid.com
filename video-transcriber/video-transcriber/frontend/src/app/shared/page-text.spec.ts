import { readFaq, readSteps, readText, sameJson } from './page-text';

function dom(html: string): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = html;
  return root;
}

describe('readFaq', () => {
  it('reads a question and its answer paragraphs from a details.qa', () => {
    const root = dom(`
      <details class="qa"><summary>Is it free?<span class="pm"></span></summary><p>Yes.</p><p>No   login\n at all.</p></details>
      <details class="qa"><summary>How long?</summary><p>A while.</p></details>`);
    expect(readFaq(root)).toEqual([
      { question: 'Is it free?', answer: 'Yes. No login at all.' },
      { question: 'How long?', answer: 'A while.' },
    ]);
  });

  it('joins list items with a space (they sit side by side in the DOM without any)', () => {
    const root = dom('<details class="qa"><summary>Tips?</summary><ul><li><b>One</b> thing.</li><li>Two things.</li></ul></details>');
    expect(readFaq(root)[0].answer).toBe('One thing. Two things.');
    const ordered = dom('<details class="qa"><summary>Steps?</summary><ol><li>First</li><li>Second</li></ol></details>');
    expect(readFaq(ordered)[0].answer).toBe('First Second');
  });

  it('keeps a nested details (such as the list of all languages) out of the answer', () => {
    const root = dom(
      '<details class="qa"><summary>Languages?</summary><p>More than 50.</p><details class="langs-box"><summary>Show all</summary><ul><li>English</li></ul></details></details>',
    );
    expect(readFaq(root)).toEqual([{ question: 'Languages?', answer: 'More than 50.' }]);
  });

  it('only reads details.qa, in the order of the page', () => {
    const root = dom('<details><summary>Not a question</summary><p>x</p></details><div><details class="qa"><summary>Q</summary><p>A</p></details></div>');
    expect(readFaq(root)).toEqual([{ question: 'Q', answer: 'A' }]);
  });

  it('gives an empty list for a page without questions, and an empty answer for a question without one', () => {
    expect(readFaq(dom('<p>nothing</p>'))).toEqual([]);
    expect(readFaq(dom('<details class="qa"><summary>Q</summary></details>'))).toEqual([{ question: 'Q', answer: '' }]);
  });
});

describe('readSteps', () => {
  const html = `<ol class="steps">
      <li><h3>Add your file</h3><p>Drop it  here.</p></li>
      <li><h3>Pick quality</h3><p>Choose.</p></li>
    </ol>
    <ol class="other"><li><h3>x</h3><p>y</p></li></ol>`;

  it('reads the name (h3) and the text (first p) of each step, whitespace tidied', () => {
    expect(readSteps(dom(html))).toEqual([
      { name: 'Add your file', text: 'Drop it here.' },
      { name: 'Pick quality', text: 'Choose.' },
    ]);
  });

  it('takes another selector when asked', () => {
    expect(readSteps(dom(html), 'ol.other > li')).toEqual([{ name: 'x', text: 'y' }]);
  });

  it('gives empty strings for a step that has no heading or text, and an empty list for no steps', () => {
    expect(readSteps(dom('<ol class="steps"><li></li></ol>'))).toEqual([{ name: '', text: '' }]);
    expect(readSteps(dom('<p>none</p>'))).toEqual([]);
  });
});

describe('readText', () => {
  it('is the text of the first match with its whitespace collapsed', () => {
    const root = dom('<p class="lead">  Turns   speech\n into text. </p><p class="lead">second</p>');
    expect(readText(root, '.lead')).toBe('Turns speech into text.');
  });

  it('is empty when nothing matches', () => {
    expect(readText(dom('<p>x</p>'), '.nope')).toBe('');
  });
});

describe('sameJson', () => {
  it('is true for the same content, whatever the object', () => {
    expect(sameJson([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(sameJson({ name: 'x', steps: [] }, { name: 'x', steps: [] })).toBe(true);
  });

  it('is false for any difference', () => {
    expect(sameJson([{ a: 1 }], [{ a: 2 }])).toBe(false);
    expect(sameJson([], [{ a: 1 }])).toBe(false);
  });
});
