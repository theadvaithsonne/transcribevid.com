import { FaqItem, HowToStepInput } from '../core/structured-data.service';

/**
 * Reads the FAQ and how-to text that a page really shows, so the structured data (JSON-LD) cannot drift from the visible
 * words: the answers on the FAQ page change with the server's limits and with where the files go, and the markup follows.
 * Works on the server (prerender) and in the browser: only querySelector / textContent / children are used.
 */

const text = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

/**
 * `<details class="qa"><summary>Question</summary> ...answer paragraphs and lists... </details>` -> question / answer.
 * A nested `<details>` (such as the list of all languages) is a detail of the answer, not part of it, so it is left out.
 */
export function readFaq(root: ParentNode): FaqItem[] {
  const items: FaqItem[] = [];
  for (const qa of Array.from(root.querySelectorAll('details.qa'))) {
    let question = '';
    const answer: string[] = [];
    for (const child of Array.from(qa.children)) {
      const tag = child.tagName.toLowerCase();
      if (tag === 'summary') question = text(child);
      // list items sit side by side without any space in the DOM: join them with one
      else if (tag === 'ul' || tag === 'ol') answer.push(Array.from(child.children).map(text).join(' '));
      else if (tag !== 'details') answer.push(text(child));
    }
    items.push({ question, answer: answer.filter(Boolean).join(' ') });
  }
  return items;
}

/** `<ol class="steps"><li><h3>Name</h3><p>What to do</p></li>...` -> steps. */
export function readSteps(root: ParentNode, selector = 'ol.steps > li'): HowToStepInput[] {
  return Array.from(root.querySelectorAll(selector)).map((li) => ({
    name: text(li.querySelector('h3')),
    text: text(li.querySelector('p')),
  }));
}

/** Text of the first element that matches, whitespace collapsed ('' when there is none). */
export function readText(root: ParentNode, selector: string): string {
  return text(root.querySelector(selector));
}

/** For a signal's `equal`: the same questions and answers, so reading the page again does not rewrite the markup. */
export const sameJson = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);
