// Runs after `vite build`: writes a unique, crawlable HTML file for every route
// (title, description, canonical, Open Graph, JSON-LD + readable content), plus sitemap.xml and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

let siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
if (!siteUrl) {
  for (const f of ['.env.production.local', '.env.production', '.env.local', '.env']) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, 'utf8').match(/^VITE_SITE_URL\s*=\s*(.+)$/m);
    if (m) { siteUrl = m[1].trim().replace(/^["']|["']$/g, ''); break; }
  }
}
if (siteUrl) process.env.SITE_URL = siteUrl;

const { allRoutes, esc } = await import('../src/lib/seo.js');
const { SITE } = await import('../src/config/site.js');

if (SITE.url.includes('your-domain.com')) {
  console.warn('\n⚠  VITE_SITE_URL is not set. Canonical URLs and the sitemap use a placeholder domain.\n   Copy .env.example to .env, set your real domain, then run the build again.\n');
}

let template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const headRe = /<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/;
const bodyMarker = '<!--seo-body-->';
if (!headRe.test(template)) {
  // Fallback if the bundler stripped the marker comments.
  template = template.replace(/<title[^>]*>[\s\S]*?<\/title>/i, '').replace(/<meta[^>]*name="description"[^>]*>/i, '').replace('</head>', '<!--seo-head-start--><!--seo-head-end--></head>');
}
if (!template.includes(bodyMarker)) template = template.replace('<div id="root"></div>', `<div id="root">${bodyMarker}</div>`);
if (!headRe.test(template) || !template.includes(bodyMarker)) throw new Error('Could not locate SEO insertion points in dist/index.html');

const head = (m) => {
  const t = [
    `<title data-rh="true">${esc(m.title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(m.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${esc(m.canonical)}" />`,
    `<meta data-rh="true" name="robots" content="${m.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`,
    `<meta data-rh="true" property="og:type" content="${m.type}" />`,
    `<meta data-rh="true" property="og:site_name" content="${SITE.name}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(m.title)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(m.description)}" />`,
    `<meta data-rh="true" property="og:url" content="${esc(m.canonical)}" />`,
    `<meta data-rh="true" property="og:image" content="${esc(m.image)}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(m.title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(m.description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${esc(m.image)}" />`,
    ...m.jsonLd.map((j) => `<script data-rh="true" type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ];
  return `<!--seo-head-start-->\n    ${t.join('\n    ')}\n    <!--seo-head-end-->`;
};
const body = (m) => `<div style="max-width:960px;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.6"><header><a href="/">BuildCalc</a></header><main><h1>${esc(m.h1)}</h1>${m.html || ''}</main></div>`;

const routes = allRoutes();
let count = 0;
for (const m of routes) {
  const html = template.replace(headRe, head(m)).replace(bodyMarker, body(m));
  const file = m.path === '/' ? path.join(dist, 'index.html') : path.join(dist, m.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  count++;
}

// Unknown URLs: serve the app shell but tell search engines not to index it.
const nf = routes.length ? template.replace(headRe, head({ title: 'Page not found | BuildCalc', description: 'This page could not be found.', canonical: `${SITE.url}/`, image: SITE.image, type: 'website', noindex: true, jsonLd: [] })).replace(bodyMarker, '') : template;
fs.writeFileSync(path.join(dist, '404.html'), nf);

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .filter((m) => !m.noindex)
  .map((m) => `  <url><loc>${esc(m.canonical)}</loc><lastmod>${today}</lastmod><priority>${m.priority.toFixed(1)}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log(`SEO postbuild: ${count} pages pre-rendered, sitemap.xml (${routes.length} URLs) and robots.txt written for ${SITE.url}`);
