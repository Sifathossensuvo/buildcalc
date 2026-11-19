import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        {items.map(([label, to], i) => (
          <li key={label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            {to && i < items.length - 1 ? (
              <Link to={to} className="rounded hover:text-brand-600 dark:hover:text-brand-400">{label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
