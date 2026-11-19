import { CALCULATORS } from '../data/calculators.js';

export function searchCalculators(q, list = CALCULATORS) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return list
    .map((c) => {
      const name = c.name.toLowerCase();
      const kw = c.keywords.join(' ').toLowerCase();
      const cat = c.catName.toLowerCase();
      const short = c.short.toLowerCase();
      let score = 0;
      for (const t of terms) {
        let m = 0;
        if (name.startsWith(t)) m = 10;
        else if (name.includes(t)) m = 7;
        else if (kw.includes(t)) m = 5;
        else if (cat.includes(t)) m = 4;
        else if (short.includes(t)) m = 2;
        if (!m) return null;
        score += m;
      }
      return { c, score: score + c.pop / 100 };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);
}
