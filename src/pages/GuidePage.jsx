import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import CalculatorCard from '../components/CalculatorCard.jsx';
import NotFound from './NotFound.jsx';
import { GUIDE_BY_SLUG } from '../data/guides.js';
import { BY_SLUG } from '../data/calculators.js';
import { guideMeta } from '../lib/seo.js';

export default function GuidePage() {
  const { slug } = useParams();
  const g = GUIDE_BY_SLUG[slug];
  if (!g) return <NotFound />;
  return (
    <Page className="container-x max-w-3xl py-8">
      <Seo meta={guideMeta(g)} />
      <Breadcrumbs items={[['Home', '/'], ['Guides', '/guides'], [g.title]]} />
      <article>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{g.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-400">{g.description}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{g.read} read · Published {new Date(g.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {g.sections.map(([h, p]) => (
          <section key={h} className="mt-8"><h2 className="text-xl font-semibold">{h}</h2><p className="mt-2 leading-relaxed">{p}</p></section>
        ))}
      </article>
      <section className="mt-12" aria-labelledby="try">
        <h2 id="try" className="text-xl font-semibold">Try the calculators</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">{g.calcs.map((s) => BY_SLUG[s]).filter(Boolean).map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Results are planning estimates. <Link to="/terms-of-service" className="underline">Read the disclaimer</Link>.</p>
      </section>
    </Page>
  );
}
