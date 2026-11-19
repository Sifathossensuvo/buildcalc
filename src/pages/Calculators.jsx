import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Heart, Search, X } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import CalculatorCard from '../components/CalculatorCard.jsx';
import NotFound from './NotFound.jsx';
import { usePrefs } from '../context/Prefs.jsx';
import { CALCULATORS, NEWEST, POPULAR } from '../data/calculators.js';
import { CATEGORIES, CAT_BY_SLUG } from '../data/categories.js';
import { GUIDES } from '../data/guides.js';
import { searchCalculators } from '../lib/search.js';
import { categoryMeta, directoryMeta } from '../lib/seo.js';

export default function Calculators() {
  const { slug } = useParams();
  const cat = slug ? CAT_BY_SLUG[slug] : null;
  if (slug && !cat) return <NotFound />;
  return <Directory key={slug || 'all'} cat={cat} />;
}

function Directory({ cat }) {
  const { favorites } = usePrefs();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [sort, setSort] = useState('popular');
  const [favOnly, setFavOnly] = useState(false);
  const meta = useMemo(() => (cat ? categoryMeta(cat) : directoryMeta()), [cat]);

  const list = useMemo(() => {
    let base = cat ? CALCULATORS.filter((c) => c.cat === cat.slug) : CALCULATORS;
    if (favOnly) base = base.filter((c) => favorites.includes(c.slug));
    if (q.trim()) {
      const found = searchCalculators(q, base);
      if (sort === 'popular') return found;
      base = found;
    }
    const arr = [...base];
    if (sort === 'az') arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'newest') arr.sort((a, b) => (a.added < b.added ? 1 : -1));
    else arr.sort((a, b) => b.pop - a.pop);
    return arr;
  }, [cat, favOnly, favorites, q, sort]);

  const featured = !q.trim() && !favOnly && !cat;
  const setQ = (v) => setParams(v ? { q: v } : {}, { replace: true });
  const guides = cat ? GUIDES.filter((g) => g.calcs.some((s) => CALCULATORS.find((c) => c.slug === s && c.cat === cat.slug))) : [];

  return (
    <Page>
      <Seo meta={meta} />
      <div className="container-x pb-6 pt-8">
        <Breadcrumbs items={cat ? [['Home', '/'], ['Calculators', '/calculators'], [cat.name]] : [['Home', '/'], ['Calculators']]} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{cat ? cat.name : 'All calculators'}</h1>
        <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">{cat ? cat.blurb : 'Search every construction and home improvement calculator, filter by category and sort by popularity or name.'}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input type="search" aria-label="Filter calculators" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, keyword or category" className="input pl-11 pr-11 shadow-soft" />
            {q && <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-ink-soft"><X className="h-4 w-4" aria-hidden="true" /></button>}
          </div>
          <label className="flex items-center gap-2 text-sm font-medium">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto">
              <option value="popular">Popularity</option>
              <option value="az">Alphabetical (A–Z)</option>
              <option value="newest">Newest first</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Category filters">
          <Link to="/calculators" className={`chip ${!cat ? 'chip-active' : ''}`}>All</Link>
          {CATEGORIES.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} aria-current={cat?.slug === c.slug ? 'page' : undefined} className={`chip ${cat?.slug === c.slug ? 'chip-active' : ''}`}>{c.name}</Link>)}
          <button type="button" aria-pressed={favOnly} onClick={() => setFavOnly((v) => !v)} className={`chip ${favOnly ? 'chip-active' : ''}`}><Heart className="h-4 w-4" aria-hidden="true" /> Favorites ({favorites.length})</button>
        </div>
      </div>

      <div className="container-x space-y-12 pb-4">
        {featured && (
          <>
            <section aria-labelledby="pop">
              <h2 id="pop" className="h-section mb-4">Popular tools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{POPULAR.slice(0, 6).map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
            </section>
            <section aria-labelledby="new">
              <h2 id="new" className="h-section mb-4">Recently added</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{NEWEST.slice(0, 4).map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
            </section>
          </>
        )}
        <section aria-labelledby="all">
          <h2 id="all" className="h-section mb-4">{featured ? 'All calculators' : 'Calculators'} <span className="text-base font-normal text-slate-500 dark:text-slate-400">({list.length})</span></h2>
          {list.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
          ) : (
            <div className="card px-6 py-14 text-center">
              <h3 className="text-lg font-semibold">{favOnly && !q ? 'No favorites yet' : 'No calculators found'}</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">{favOnly && !q ? 'Select the heart on any calculator to save it here for quick access.' : 'Try a different word, remove a filter, or browse by category.'}</p>
              <div className="mt-4 flex justify-center gap-2">
                {q && <button type="button" className="btn btn-primary" onClick={() => setQ('')}>Clear search</button>}
                {favOnly && <button type="button" className="btn btn-ghost" onClick={() => setFavOnly(false)}>Show all</button>}
              </div>
            </div>
          )}
        </section>
        {cat && guides.length > 0 && (
          <section aria-labelledby="g">
            <h2 id="g" className="h-section mb-4">Guides for {cat.name.toLowerCase()}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{guides.map((g) => <li key={g.slug}><Link to={`/guides/${g.slug}`} className="card block p-4 font-medium hover:text-brand-600 dark:hover:text-brand-400">{g.title}</Link></li>)}</ul>
          </section>
        )}
      </div>
    </Page>
  );
}
