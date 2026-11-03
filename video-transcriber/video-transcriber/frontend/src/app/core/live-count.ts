import { Injectable, signal } from '@angular/core';

/**
 * How many pages of the website are open right now, for the page header ("3 online now").
 *   undefined  the header shows nothing: the prerender, the local / self-hosted edition (no counter), or the Worker could not
 *              be read three times in a row (never a made-up number)
 *   null       loading: the header shows the pill with "…" until the first answer arrives
 *   a number   the number, including 0
 * It is filled by core/presence.ts, which is loaded right after the page is up, so this tiny holder is all that is in the first
 * download. The number comes from visitors' browsers and is never presented as verified.
 */
@Injectable({ providedIn: 'root' })
export class LiveCount {
  readonly active = signal<number | null | undefined>(undefined);
}
