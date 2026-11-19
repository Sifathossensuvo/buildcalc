import { Link } from 'react-router-dom';
import { Logo } from './Header.jsx';
import { CATEGORIES } from '../data/categories.js';
import { POPULAR, calcPath } from '../data/calculators.js';

const col = 'space-y-2.5 text-sm';
const lnk = 'text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-ink-line dark:bg-ink-surface">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Free, transparent calculators for construction materials, project quantities and home improvement costs. Formulas are shown, assumptions are editable.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Categories</h2>
          <ul className={col}>{CATEGORIES.map((c) => <li key={c.slug}><Link className={lnk} to={`/category/${c.slug}`}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Popular calculators</h2>
          <ul className={col}>{POPULAR.slice(0, 7).map((c) => <li key={c.slug}><Link className={lnk} to={calcPath(c.slug)}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Useful links</h2>
          <ul className={col}>
            <li><Link className={lnk} to="/calculators">All calculators</Link></li>
            <li><Link className={lnk} to="/guides">Guides</Link></li>
            <li><Link className={lnk} to="/about">About</Link></li>
            <li><Link className={lnk} to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Legal</h2>
          <ul className={col}>
            <li><Link className={lnk} to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className={lnk} to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-ink-line dark:text-slate-400">
        <div className="container-x">© {new Date().getFullYear()} BuildCalc. Results are planning estimates and not engineering, structural or professional advice.</div>
      </div>
    </footer>
  );
}
