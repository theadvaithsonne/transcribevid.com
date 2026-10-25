import { ADSENSE, adsConfigured } from './ads.config';

describe('ads.config', () => {
  it('names the publisher account that ads.txt and the meta tag in index.html declare', () => {
    expect(ADSENSE.client).toMatch(/^ca-pub-\d{16}$/);
  });

  it('keeps ads inert until every ad unit id is filled in', () => {
    expect(adsConfigured()).toBe(false); // no slot ids yet: nothing may load Google's script
    const empty = { ...ADSENSE, slots: { rail160: '', rail300: '', inline300: '' } };
    expect(adsConfigured(empty)).toBe(false);
    const partial = { ...ADSENSE, slots: { rail160: '1234567890', rail300: '', inline300: '1234567890' } };
    expect(adsConfigured(partial)).toBe(false);
    const full = { ...ADSENSE, slots: { rail160: '1234567890', rail300: '2345678901', inline300: '3456789012' } };
    expect(adsConfigured(full)).toBe(true);
    expect(adsConfigured({ ...full, client: 'ca-pub-123' })).toBe(false);
  });
});
