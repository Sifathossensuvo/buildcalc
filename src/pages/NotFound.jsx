import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import { notFoundMeta } from '../lib/seo.js';

export default function NotFound() {
  return (
    <Page className="container-x py-24 text-center">
      <Seo meta={notFoundMeta()} />
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold">We could not find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">The link may be old or mistyped. Browse all calculators or return to the homepage.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/calculators" className="btn btn-primary">Browse calculators</Link>
        <Link to="/" className="btn btn-ghost">Go home</Link>
      </div>
    </Page>
  );
}
