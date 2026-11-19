import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchCalculators } from '../lib/search.js';
import { POPULAR, calcPath } from '../data/calculators.js';
import { CATEGORIES } from '../data/categories.js';

export default function SearchBox({ onPick, autoFocus = false, listAlways = false, large = false, placeholder = 'Search calculators – e.g. bricks, concrete, paint' }) {
  const nav = useNavigate();
  const id = useId();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const query = q.trim();
  const results = useMemo(() => (query ? searchCalculators(query).slice(0, 7) : POPULAR.slice(0, 6)), [query]);
  const show = listAlways || open;

  const pick = (c) => {
    setQ('');
    setOpen(false);
    setIdx(0);
    if (onPick) onPick(c);
    else nav(calcPath(c.slug));
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setIdx((i) => (results.length ? (i + 1) % results.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => (results.length ? (i - 1 + results.length) % results.length : 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[idx]) pick(results[idx]);
    } else if (e.key === 'Escape') {
      if (q) { setQ(''); setIdx(0); } else setOpen(false);
    }
  };

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <div className="relative">
        <Search className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${large ? 'h-5 w-5' : 'h-4 w-4'}`} aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-expanded={show}
          aria-controls={`${id}-list`}
          aria-activedescendant={show && results[idx] ? `${id}-opt-${idx}` : undefined}
          aria-autocomplete="list"
          aria-label="Search calculators"
          autoComplete="off"
          autoFocus={autoFocus}
          value={q}
          placeholder={placeholder}
          onChange={(e) => { setQ(e.target.value); setIdx(0); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`input pl-11 pr-11 shadow-soft ${large ? 'py-4 text-base' : ''}`}
        />
        {q && (
          <button type="button" aria-label="Clear search" onClick={() => { setQ(''); setIdx(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-ink-soft">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {show && (
        <div className={`${listAlways ? 'mt-3' : 'absolute left-0 right-0 top-full z-40 mt-2 shadow-lift'} card overflow-hidden`}>
          {results.length ? (
            <>
              <p className="px-4 pb-1 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{query ? `${results.length} result${results.length > 1 ? 's' : ''}` : 'Popular calculators'}</p>
              <ul id={`${id}-list`} role="listbox" aria-label="Calculator suggestions" className="max-h-80 overflow-y-auto p-2">
                {results.map((c, i) => (
                  <li key={c.slug} id={`${id}-opt-${i}`} role="option" aria-selected={i === idx}>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(c)} onMouseEnter={() => setIdx(i)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ${i === idx ? 'bg-brand-50 dark:bg-ink-soft' : ''}`}>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{c.name}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{c.catName}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div id={`${id}-list`} role="listbox" aria-label="No results" className="p-5 text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">No calculators match “{query}”</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a simpler word such as “brick”, “tile” or “paint”, or browse a category.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {CATEGORIES.slice(0, 4).map((c) => (
                  <button key={c.slug} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setOpen(false); setQ(''); nav(`/category/${c.slug}`); }} className="chip text-xs">{c.name}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
