/**
 * Google AdSense identifiers, in one place. The publisher id is public (it is in the page source of every AdSense site):
 * it is also in public/ads.txt and in the <meta name="google-adsense-account"> tag of index.html, which is how Google
 * verifies that the site is ours. The slot ids come from AdSense > Ads > By ad unit once the site is approved. Until
 * every one of them is filled in, nothing on the site loads Google's script or shows an ad: the reserved ad rail is an
 * empty column, and dev, tests and CI never contact Google.
 */
export interface AdSenseConfig {
  /** "ca-pub-" followed by 16 digits */
  client: string;
  /** the 10-digit ad unit ids, one per placement */
  slots: {
    /** desktop rail, 160x600 (viewports 1100-1679 px wide) */
    rail160: string;
    /** desktop rail, 300x600 (viewports 1680 px and wider) */
    rail300: string;
    /** the in-flow unit on tablet and phone, 300x250 */
    inline300: string;
  };
}

export const ADSENSE: AdSenseConfig = {
  client: 'ca-pub-5152758693265080',
  slots: { rail160: '', rail300: '', inline300: '' },
};

/** True only when the publisher id and every slot id are set: the one state in which the ad code may run at all. */
export function adsConfigured(c: AdSenseConfig = ADSENSE): boolean {
  return /^ca-pub-\d{16}$/.test(c.client) && Object.values(c.slots).every((s) => /^\d{10}$/.test(s));
}
