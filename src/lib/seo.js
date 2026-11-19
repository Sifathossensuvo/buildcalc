import { SITE } from '../config/site.js';
import { CALCULATORS, relatedTo, calcPath } from '../data/calculators.js';
import { CATEGORIES, CAT_BY_SLUG } from '../data/categories.js';
import { GUIDES } from '../data/guides.js';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => `${SITE.url}${p === '/' ? '' : p}` || SITE.url;
const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) || SITE.url })),
});
const org = { '@type': 'Organization', name: SITE.name, url: SITE.url, logo: `${SITE.url}/favicon.svg` };
const mk = (path, o) => ({ path, canonical: path === '/' ? `${SITE.url}/` : abs(path), image: SITE.image, type: 'website', jsonLd: [], priority: 0.5, ...o });
const trim = (s, n = 158) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

export const STATIC_PAGES = {
  about: { path: '/about', title: 'About BuildCalc – Free Construction Calculators', h1: 'About BuildCalc', description: 'BuildCalc offers free, transparent construction and home improvement calculators with visible formulas, editable assumptions and no sign-up.' },
  contact: { path: '/contact', title: 'Contact BuildCalc', h1: 'Contact us', description: 'Questions, corrections or calculator suggestions? Contact the BuildCalc team.' },
  privacy: { path: '/privacy-policy', title: 'Privacy Policy | BuildCalc', h1: 'Privacy Policy', description: 'How BuildCalc handles your data: no accounts, no tracking of your inputs, and preferences stored only in your browser.' },
  terms: { path: '/terms-of-service', title: 'Terms of Service | BuildCalc', h1: 'Terms of Service', description: 'The terms for using BuildCalc, including the planning-estimate disclaimer for all calculators.' },
};

const navHtml = () =>
  `<nav aria-label="Calculators"><h2>All calculators</h2><ul>${CALCULATORS.map((c) => `<li><a href="${calcPath(c.slug)}">${esc(c.name)}</a></li>`).join('')}</ul><h2>Categories</h2><ul>${CATEGORIES.map((c) => `<li><a href="/category/${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul><h2>Guides</h2><ul>${GUIDES.map((g) => `<li><a href="/guides/${g.slug}">${esc(g.title)}</a></li>`).join('')}</ul></nav>`;

export function homeMeta() {
  const description = 'Free construction and home improvement calculators for bricks, tiles, concrete, gravel, soil, roofing, decking, fencing and paint, with formulas, units and worked examples.';
  return mk('/', {
    title: 'BuildCalc – Free Construction & Home Improvement Calculators',
    description, h1: 'Build Smarter. Calculate Better.', priority: 1,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url, potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/calculators?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      { '@context': 'https://schema.org', ...org },
    ],
    html: `<p>${esc(description)}</p>${navHtml()}`,
  });
}
export const directoryMeta = () =>
  mk('/calculators', {
    title: 'All Construction & Home Improvement Calculators | BuildCalc',
    description: 'Browse all BuildCalc calculators: bricks, tiles, concrete, cement, gravel, soil, roofing, decking, fencing, paint and project cost. Free and instant.',
    h1: 'All calculators', priority: 0.9,
    jsonLd: [crumbs([['Home', '/'], ['Calculators', '/calculators']])],
    html: navHtml(),
  });
export const categoryMeta = (cat) =>
  mk(`/category/${cat.slug}`, {
    title: `${cat.title} | BuildCalc`, description: cat.description, h1: cat.name, priority: 0.8,
    jsonLd: [crumbs([['Home', '/'], ['Calculators', '/calculators'], [cat.name, `/category/${cat.slug}`]])],
    html: `<p>${esc(cat.blurb)}</p><ul>${CALCULATORS.filter((c) => c.cat === cat.slug).map((c) => `<li><a href="${calcPath(c.slug)}">${esc(c.name)}</a> – ${esc(c.short)}</li>`).join('')}</ul>${navHtml()}`,
  });
export function calcMeta(calc) {
  const path = calcPath(calc.slug);
  const cat = CAT_BY_SLUG[calc.cat];
  const related = relatedTo(calc);
  return mk(path, {
    title: `${calc.seoTitle} | BuildCalc`, description: trim(calc.description), h1: calc.name, priority: 0.9, type: 'website',
    jsonLd: [
      crumbs([['Home', '/'], ['Calculators', '/calculators'], [cat.name, `/category/${cat.slug}`], [calc.name, path]]),
      { '@context': 'https://schema.org', '@type': 'WebApplication', name: calc.name, url: abs(path), description: calc.short, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: org },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: calc.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
    html: `<p>${esc(calc.short)}</p><h2>About the ${esc(calc.name)}</h2><p>${esc(calc.about)}</p><h2>Inputs</h2><ul>${calc.fields.map((f) => `<li>${esc(f.label)}</li>`).join('')}</ul><h2>Formula</h2><ul>${calc.formula.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><h2>Frequently asked questions</h2>${calc.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}<h2>Related calculators</h2><ul>${related.map((r) => `<li><a href="${calcPath(r.slug)}">${esc(r.name)}</a></li>`).join('')}</ul>${navHtml()}`,
  });
}
export const guidesMeta = () =>
  mk('/guides', {
    title: 'Construction Calculation Guides | BuildCalc', description: 'Practical guides on estimating bricks, concrete, tiles, gravel, roof pitch and paint, each linked to a free calculator.',
    h1: 'Guides', priority: 0.7, jsonLd: [crumbs([['Home', '/'], ['Guides', '/guides']])],
    html: `<ul>${GUIDES.map((g) => `<li><a href="/guides/${g.slug}">${esc(g.title)}</a> – ${esc(g.description)}</li>`).join('')}</ul>${navHtml()}`,
  });
export const guideMeta = (g) =>
  mk(`/guides/${g.slug}`, {
    title: `${g.title} | BuildCalc`, description: trim(g.description), h1: g.title, type: 'article', priority: 0.7,
    jsonLd: [
      crumbs([['Home', '/'], ['Guides', '/guides'], [g.title, `/guides/${g.slug}`]]),
      { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, datePublished: g.date, dateModified: g.date, author: org, publisher: org, mainEntityOfPage: abs(`/guides/${g.slug}`), image: SITE.image },
    ],
    html: `<p>${esc(g.description)}</p>${g.sections.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}${navHtml()}`,
  });
export const staticMeta = (key) => {
  const s = STATIC_PAGES[key];
  return mk(s.path, { title: s.title, description: s.description, h1: s.h1, priority: key === 'about' ? 0.6 : 0.3, html: navHtml(), jsonLd: [crumbs([['Home', '/'], [s.h1, s.path]])] });
};
export const notFoundMeta = () => mk('/404', { title: 'Page not found | BuildCalc', description: 'This page could not be found.', h1: 'Page not found', noindex: true });

export function allRoutes() {
  return [
    homeMeta(), directoryMeta(), guidesMeta(),
    ...CATEGORIES.map(categoryMeta), ...CALCULATORS.map(calcMeta), ...GUIDES.map(guideMeta),
    ...Object.keys(STATIC_PAGES).map(staticMeta),
  ];
}
