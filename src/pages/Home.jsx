import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Gift, ListChecks, Ruler, Smartphone, Zap } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import SearchBox from '../components/SearchBox.jsx';
import CalculatorCard from '../components/CalculatorCard.jsx';
import { catIcon } from '../components/icons.js';
import { usePrefs } from '../context/Prefs.jsx';
import { BY_SLUG, CALCULATORS, POPULAR, calcPath } from '../data/calculators.js';
import { CATEGORIES } from '../data/categories.js';
import { GUIDES } from '../data/guides.js';
import { exampleFor, run } from '../lib/engine.js';
import { homeMeta } from '../lib/seo.js';

function HeroPreview() {
  const calc = BY_SLUG['brick-calculator'];
  const raw = useMemo(() => Object.fromEntries(calc.fields.map((f) => [f.id, exampleFor(f, 'metric')])), [calc]);
  const out = useMemo(() => run(calc, raw, 'metric', '$').out, [calc, raw]);
  const shown = ['wallL', 'wallH', 'brickL', 'joint', 'waste'].map((id) => calc.fields.find((f) => f.id === id));
  const main = out.results.find((r) => r.primary);
  return (
    <div aria-hidden="true" className="card relative mx-auto w-full max-w-md p-5 shadow-lift">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">Brick Calculator</p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {shown.map((f) => (
          <div key={f.id} className="rounded-lg border border-slate-200 px-3 py-2 dark:border-ink-line">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.label}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{raw[f.id]} <span className="font-normal text-slate-500">{f.unit || (f.dim === 'len' ? 'm' : f.dim === 'sm' ? 'mm' : '')}</span></p>
          </div>
        ))}
        <div className="flex items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white">Calculate</div>
      </div>
      <div className="mt-4 rounded-xl bg-brand-50 p-4 dark:bg-ink-soft">
        <p className="text-xs font-medium text-brand-700 dark:text-brand-400">{main.label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{main.value} <span className="text-base font-semibold text-slate-500">{main.unit}</span></p>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Live preview using real values from the calculator.</p>
    </div>
  );
}

const WHY = [
  [Zap, 'Fast calculations', 'Results appear instantly and update as you edit a value.'],
  [ListChecks, 'Easy-to-understand results', 'Every result comes with a step-by-step breakdown and the formula behind it.'],
  [Ruler, 'Multiple measurement units', 'Switch between metric and imperial and see results in m³, ft³ and yd³.'],
  [Gift, 'Free to use', 'No accounts, no paywalls and no limits on how many times you calculate.'],
  [Smartphone, 'Mobile-friendly interface', 'Large inputs and a stacked layout make it comfortable on site.'],
];

export default function Home() {
  const { recents } = usePrefs();
  const recent = recents.map((s) => BY_SLUG[s]).filter(Boolean).slice(0, 4);
  return (
    <Page>
      <Seo meta={homeMeta()} />
      <section className="border-b border-slate-200 bg-white dark:border-ink-line dark:bg-ink-bg">
        <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Build Smarter. Calculate Better.</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">Calculate construction materials, project quantities and home improvement costs in seconds, with the formulas and assumptions shown so you can trust the numbers.</p>
            <div className="mt-7 max-w-xl"><SearchBox large /></div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-slate-500 dark:text-slate-400">Popular:</span>
              {POPULAR.slice(0, 5).map((c) => <Link key={c.slug} to={calcPath(c.slug)} className="chip">{c.name.replace(' Calculator', '')}</Link>)}
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="container-x pt-16" aria-labelledby="popular">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="popular" className="h-section">Popular calculators</h2>
          <Link to="/calculators" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400 sm:flex">View all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{POPULAR.slice(0, 8).map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
      </section>

      <section className="container-x pt-16" aria-labelledby="cats">
        <h2 id="cats" className="h-section mb-6">Browse by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = catIcon(c.icon);
            const n = CALCULATORS.filter((x) => x.cat === c.slug).length;
            return (
              <Link key={c.slug} to={`/category/${c.slug}`} className="card group p-5 transition-shadow hover:shadow-lift">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-ink-soft dark:text-brand-400"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.short}</p>
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{n} calculator{n > 1 ? 's' : ''}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-x pt-16" aria-labelledby="why">
        <h2 id="why" className="h-section mb-6">Why BuildCalc?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WHY.map(([Icon, t, d]) => (
            <div key={t} className="rounded-2xl border border-slate-200 p-5 dark:border-ink-line">
              <Icon className="h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pt-16" aria-labelledby="recent">
        <h2 id="recent" className="h-section mb-6">Recently used</h2>
        {recent.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recent.map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
        ) : (
          <div className="card flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-ink-soft dark:text-brand-400"><Clock className="h-5 w-5" aria-hidden="true" /></span>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculators you open will show up here so you can pick up where you left off. They are saved only in this browser.</p>
          </div>
        )}
      </section>

      <section className="container-x pt-16" aria-labelledby="guides">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="guides" className="h-section">Helpful guides</h2>
          <Link to="/guides" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400 sm:flex">All guides <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="card group p-5 transition-shadow hover:shadow-lift">
              <BookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h3 className="mt-3 font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">{g.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{g.description}</p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{g.read} read</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x pt-16">
        <div className="rounded-3xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold !text-white sm:text-3xl">Ready to plan your next project?</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">Explore every calculator, from bricks and tiles to concrete, roofing and paint.</p>
          <Link to="/calculators" className="btn mt-6 bg-white text-brand-700 hover:bg-brand-50">Explore all calculators <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </Page>
  );
}
