const fromVite = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) || undefined;
const fromNode = typeof process !== 'undefined' && process.env ? process.env.SITE_URL : undefined;
const url = (fromNode || fromVite || 'https://www.your-domain.com').replace(/\/+$/, '');

export const SITE = {
  name: 'BuildCalc',
  url,
  tagline: 'Build Smarter. Calculate Better.',
  email: 'hello@your-domain.com',
  image: `${url}/og-image.png`,
  updated: 'November 2026',
};
