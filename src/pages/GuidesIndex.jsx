import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { GUIDES } from '../data/guides.js';
import { guidesMeta } from '../lib/seo.js';

export default function GuidesIndex() {
  return (
    <Page className="container-x py-8">
      <Seo meta={guidesMeta()} />
      <Breadcrumbs items={[['Home', '/'], ['Guides']]} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Construction calculation guides</h1>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Plain-language explanations of how quantities are worked out, each linked to the calculator that does the maths.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="card group p-6 transition-shadow hover:shadow-lift">
            <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">{g.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{g.description}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{g.read} read</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}
