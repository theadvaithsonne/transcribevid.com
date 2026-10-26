import { Brand } from './models';

/**
 * Who runs transcribevid.com: shown on the privacy policy, the terms, the About and the Contact page, and used as the
 * in-browser edition's contact address (footer, structured data). Change it here and nowhere else.
 */
export const OPERATOR = {
  name: 'Advaith Bibhishan Sonne',
  role: 'an independent software developer',
  address: 'Chinnapanahalli Main Road, Bengaluru, Karnataka 560037, India',
  city: 'Bengaluru, India',
  email: 'theadvaithsonne@gmail.com',
  /** completes "These terms are governed by …" */
  law: 'the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them',
} as const;

/** The public website's name and address. The in-browser edition has no server to announce a contact address, so it carries the operator's. */
export const SITE_BRAND: Brand = {
  name: 'TranscribeVid',
  domain: 'transcribevid.com',
  url: 'https://transcribevid.com',
  contact_email: OPERATOR.email,
};
