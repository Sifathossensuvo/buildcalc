import { MASONRY_FLOORING } from './calc/masonry-flooring.js';
import { CONCRETE_GRAVEL_SOIL } from './calc/concrete-gravel-soil.js';
import { ROOF_DECK_PAINT_COST } from './calc/roof-deck-paint-cost.js';
import { CAT_BY_SLUG } from './categories.js';

const BASE = [...MASONRY_FLOORING, ...CONCRETE_GRAVEL_SOIL, ...ROOF_DECK_PAINT_COST];

// Which conversion groups are useful on each category's pages.
const CAT_CONV = {
  'masonry-bricks': ['length', 'area'],
  'flooring-tiles': ['length', 'area'],
  'concrete-cement': ['length', 'volume', 'weight'],
  'gravel-landscaping': ['length', 'volume', 'weight'],
  'soil-gardening': ['length', 'volume'],
  roofing: ['length', 'area', 'angle'],
  'decking-fencing': ['length', 'area'],
  'painting-home-improvement': ['area', 'liquid'],
};

export const CALCULATORS = BASE.map((c) => ({
  ...c,
  catName: CAT_BY_SLUG[c.cat].name,
  description: `${c.short} Includes formulas, a worked example and FAQs. Free, no sign-up.`.slice(0, 158),
  conv: c.cost ? [] : CAT_CONV[c.cat],
}));

export const BY_SLUG = Object.fromEntries(CALCULATORS.map((c) => [c.slug, c]));
export const POPULAR = [...CALCULATORS].sort((a, b) => b.pop - a.pop);
export const NEWEST = [...CALCULATORS].sort((a, b) => (a.added < b.added ? 1 : -1));

export function relatedTo(calc, n = 4) {
  const same = POPULAR.filter((c) => c.cat === calc.cat && c.slug !== calc.slug);
  const rest = POPULAR.filter((c) => c.cat !== calc.cat && c.slug !== calc.slug);
  return [...same, ...rest].slice(0, n);
}

export const calcPath = (slug) => `/calculators/${slug}`;
