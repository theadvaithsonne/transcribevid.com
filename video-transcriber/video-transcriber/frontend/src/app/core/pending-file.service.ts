import { Injectable, signal, untracked } from '@angular/core';
import type { ToolPreset } from '../features/tool-pages/tool-pages.list';

/**
 * A file the visitor chose on another page (the drop box on a keyword page such as "MP3 to text"), waiting for the
 * uploader to pick it up. The page that chooses it calls `set(file)` and navigates to "/"; the upload page calls
 * `take()` when it starts, which returns the file once and forgets it, so a later visit starts empty.
 * A language page ("Hindi audio to text") also hands over a preset: the language / option the uploader starts with.
 * Held in memory only: nothing is stored and nothing is sent anywhere by this service.
 */
@Injectable({ providedIn: 'root' })
export class PendingFileService {
  private readonly _file = signal<File | null>(null);
  private preset: ToolPreset | null = null;
  /** the waiting file, or null (read-only view; use `take()` to consume it) */
  readonly file = this._file.asReadonly();

  set(file: File | null, preset?: ToolPreset | null): void {
    this._file.set(file);
    this.preset = file ? (preset ?? null) : null;
  }

  /** Returns the waiting file (or null) and clears it. Safe to call from an effect: it does not subscribe to the signal. */
  take(): File | null {
    return this.takeWithPreset()?.file ?? null;
  }

  /** Like `take()`, with the preset that came with the file (null when the page set none). Clears both. */
  takeWithPreset(): { file: File; preset: ToolPreset | null } | null {
    return untracked(() => {
      const file = this._file();
      const preset = this.preset;
      this._file.set(null);
      this.preset = null;
      return file ? { file, preset } : null;
    });
  }
}
