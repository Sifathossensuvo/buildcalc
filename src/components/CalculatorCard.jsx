import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { usePrefs } from '../context/Prefs.jsx';
import { CAT_BY_SLUG } from '../data/categories.js';
import { catIcon } from './icons.js';
import { calcPath } from '../data/calculators.js';

export default function CalculatorCard({ calc }) {
  const { favorites, toggleFav } = usePrefs();
  const fav = favorites.includes(calc.slug);
  const Icon = catIcon(CAT_BY_SLUG[calc.cat].icon);
  return (
    <div className="card group relative transition-shadow hover:shadow-lift">
      <Link to={calcPath(calc.slug)} className="block h-full rounded-2xl p-5 pr-14">
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-ink-soft dark:text-brand-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">{calc.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{calc.short}</p>
        <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-ink-soft dark:text-slate-300">{calc.catName}</span>
      </Link>
      <button
        type="button"
        onClick={() => toggleFav(calc.slug)}
        aria-pressed={fav}
        aria-label={fav ? `Remove ${calc.name} from favorites` : `Add ${calc.name} to favorites`}
        className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-ink-soft"
      >
        <Heart className={`h-5 w-5 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
}
