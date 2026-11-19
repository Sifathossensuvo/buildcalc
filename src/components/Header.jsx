import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Calculator, ChevronDown, Menu, Search, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import SearchModal from './SearchModal.jsx';
import { CATEGORIES } from '../data/categories.js';
import { catIcon } from './icons.js';

const navLink = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="BuildCalc home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"><Calculator className="h-5 w-5" aria-hidden="true" /></span>
      <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">BuildCalc</span>
    </Link>
  );
}

export default function Header() {
  const loc = useLocation();
  const [menu, setMenu] = useState(false);
  const [cats, setCats] = useState(false);
  const [search, setSearch] = useState(false);
  const catRef = useRef(null);

  useEffect(() => { setMenu(false); setCats(false); setSearch(false); }, [loc.pathname]);
  useEffect(() => {
    const onDown = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCats(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') setCats(false);
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearch(true); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-ink-line dark:bg-ink-bg/90">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <NavLink to="/" end className={navLink}>Home</NavLink>
          <NavLink to="/calculators" end className={navLink}>Calculators</NavLink>
          <div className="relative" ref={catRef}>
            <button type="button" aria-expanded={cats} aria-haspopup="true" onClick={() => setCats((v) => !v)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Categories <ChevronDown className={`h-4 w-4 transition-transform ${cats ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {cats && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="card absolute left-0 top-full mt-2 w-72 p-2 shadow-lift">
                  {CATEGORIES.map((c) => {
                    const Icon = catIcon(c.icon);
                    return (
                      <Link key={c.slug} to={`/category/${c.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-ink-soft dark:hover:text-brand-400">
                        <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden="true" /> {c.name}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/guides" className={navLink}>Guides</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSearch(true)} aria-label="Search calculators (Ctrl+K)" className="btn btn-ghost !px-3">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-slate-200 px-1.5 text-[11px] font-medium text-slate-500 dark:border-ink-line sm:inline">Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button type="button" className="btn btn-ghost !px-2.5 lg:hidden" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            {menu ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-200 bg-white dark:border-ink-line dark:bg-ink-bg lg:hidden" aria-label="Mobile">
            <div className="container-x max-h-[75vh] space-y-1 overflow-y-auto py-3">
              {[['/', 'Home'], ['/calculators', 'All calculators'], ['/guides', 'Guides'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="block rounded-xl px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-ink-soft">{label}</Link>
              ))}
              <p className="px-3 pt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Categories</p>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="block rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-ink-soft">{c.name}</Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      {search && <SearchModal onClose={() => setSearch(false)} />}
    </header>
  );
}
