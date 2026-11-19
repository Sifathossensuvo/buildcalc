import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Calculators = lazy(() => import('./pages/Calculators.jsx'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage.jsx'));
const GuidesIndex = lazy(() => import('./pages/GuidesIndex.jsx'));
const GuidePage = lazy(() => import('./pages/GuidePage.jsx'));
const StaticPages = lazy(() => import('./pages/StaticPages.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="container-x py-16" role="status" aria-live="polite">
      <div className="h-8 w-1/3 animate-pulse rounded-lg bg-slate-200 dark:bg-ink-soft" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-ink-soft" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-ink-soft" />)}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/:slug" element={<CalculatorPage />} />
            <Route path="/category/:slug" element={<Calculators />} />
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
            <Route path="/about" element={<StaticPages page="about" />} />
            <Route path="/contact" element={<StaticPages page="contact" />} />
            <Route path="/privacy-policy" element={<StaticPages page="privacy" />} />
            <Route path="/terms-of-service" element={<StaticPages page="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
