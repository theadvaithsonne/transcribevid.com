import { Injectable, signal } from '@angular/core';

/**
 * How many pages of the website are open right now, for the page header ("3 online now"). null = unknown (not read yet, or
 * the Worker could not answer): the header shows nothing. It is filled by core/presence.ts, which is loaded a few seconds
 * after the page is up, so this tiny holder is all that is in the first download. The number comes from visitors' browsers
 * and is never presented as verified.
 */
@Injectable({ providedIn: 'root' })
export class LiveCount {
  readonly active = signal<number | null>(null);
}
