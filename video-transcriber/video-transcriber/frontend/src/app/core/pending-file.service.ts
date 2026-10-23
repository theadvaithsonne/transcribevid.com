import { Injectable, signal, untracked } from '@angular/core';

/**
 * A file the visitor chose on another page (the drop box on a keyword page such as "MP3 to text"), waiting for the
 * uploader to pick it up. The page that chooses it calls `set(file)` and navigates to "/"; the upload page calls
 * `take()` when it starts, which returns the file once and forgets it, so a later visit starts empty.
 * Held in memory only: nothing is stored and nothing is sent anywhere by this service.
 */
@Injectable({ providedIn: 'root' })
export class PendingFileService {
  private readonly _file = signal<File | null>(null);
  /** the waiting file, or null (read-only view; use `take()` to consume it) */
  readonly file = this._file.asReadonly();

  set(file: File | null): void {
    this._file.set(file);
  }

  /** Returns the waiting file (or null) and clears it. Safe to call from an effect: it does not subscribe to the signal. */
  take(): File | null {
    return untracked(() => {
      const file = this._file();
      this._file.set(null);
      return file;
    });
  }
}
