import { Injectable } from '@angular/core';

/** The question the page asks once before the ffmpeg.wasm converter may be downloaded (engine/audio ffmpeg.ts). */
export const CONVERTER_PROMPT = 'This file needs a 9 MB converter that runs in your browser. Load it?';

const KEY = 'tv-converter';

/**
 * The visitor's answer to CONVERTER_PROMPT. "Yes" is remembered in this browser (localStorage), so the page asks once;
 * "no" only for this page visit, so a later file can still be converted. Without a "yes" the engine never fetches the
 * converter and such files end with the "convert it to MP3, M4A or WAV first" message.
 */
@Injectable({ providedIn: 'root' })
export class ConverterConsent {
  /** this visit's answer (also covers a "yes" that storage refused to keep) */
  private visit: boolean | null = null;

  /** true = agreed, false = declined in this visit, null = not asked yet */
  answer(): boolean | null {
    if (this.visit !== null) return this.visit;
    try {
      return globalThis.localStorage?.getItem(KEY) === 'yes' ? true : null;
    } catch {
      return null;
    }
  }

  allowed(): boolean {
    return this.answer() === true;
  }

  record(yes: boolean): void {
    this.visit = yes;
    if (!yes) return;
    try {
      globalThis.localStorage?.setItem(KEY, 'yes');
    } catch {
      // private mode: the answer holds for this visit only
    }
  }

  /** Asks with `confirm` (window.confirm on the page) unless the visitor already answered; returns the answer. */
  ask(confirm: (text: string) => boolean): boolean {
    const have = this.answer();
    if (have !== null) return have;
    const yes = !!confirm(CONVERTER_PROMPT);
    this.record(yes);
    return yes;
  }

  /** "Delete my data now" forgets the answer too. */
  forget(): void {
    this.visit = null;
    try {
      globalThis.localStorage?.removeItem(KEY);
    } catch {
      // nothing stored
    }
  }
}
