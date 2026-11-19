import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Lightbulb, RotateCcw, Calculator as CalcIcon, Share2 } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import Page from '../components/Page.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Field from '../components/Field.jsx';
import FAQ from '../components/FAQ.jsx';
import ResultPanel from '../components/ResultPanel.jsx';
import CalculatorCard from '../components/CalculatorCard.jsx';
import NotFound from './NotFound.jsx';
import { usePrefs } from '../context/Prefs.jsx';
import { BY_SLUG, relatedTo, calcPath } from '../data/calculators.js';
import { CAT_BY_SLUG } from '../data/categories.js';
import { CONVERSIONS } from '../data/conversions.js';
import { GUIDES } from '../data/guides.js';
import { CURRENCIES, DIMS } from '../lib/units.js';
import { exampleFor, isVisible, resultText, run, unitLabel } from '../lib/engine.js';
import { copyText } from '../lib/clipboard.js';
import { calcMeta } from '../lib/seo.js';

export default function CalculatorPage() {
  const { slug } = useParams();
  const calc = BY_SLUG[slug];
  if (!calc) return <NotFound />;
  return <CalcView key={slug} calc={calc} />;
}

function UnitSwitch({ sys, onChange }) {
  return (
    <div role="radiogroup" aria-label="Measurement units" className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-ink-line dark:bg-ink-bg">
      {[['metric', 'Metric (m, cm, mm)'], ['imperial', 'Imperial (ft, in)']].map(([k, label]) => (
        <button key={k} type="button" role="radio" aria-checked={sys === k} onClick={() => onChange(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${sys === k ? 'bg-white text-brand-700 shadow-sm dark:bg-brand-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</button>
      ))}
    </div>
  );
}

function CalcView({ calc }) {
  const { units, setUnits, currency, setCurrency, currencySym, favorites, toggleFav, pushRecent } = usePrefs();
  const sys = calc.noUnits ? 'metric' : units;
  const cat = CAT_BY_SLUG[calc.cat];
  const fav = favorites.includes(calc.slug);
  const [raw, setRaw] = useState(() => Object.fromEntries(calc.fields.map((f) => [f.id, f.type === 'select' ? exampleFor(f, sys) : ''])));
  const [submitted, setSubmitted] = useState(false);
  const [flash, setFlash] = useState('');
  const timer = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => { pushRecent(calc.slug); }, [calc.slug, pushRecent]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const outcome = useMemo(() => (submitted ? run(calc, raw, sys, currencySym) : null), [submitted, raw, sys, currencySym, calc]);
  const meta = useMemo(() => calcMeta(calc), [calc]);
  const related = useMemo(() => relatedTo(calc), [calc]);
  const guide = GUIDES.find((g) => g.calcs.includes(calc.slug));
  const visible = calc.fields.filter((f) => isVisible(f, raw));

  const say = (m) => { setFlash(m); clearTimeout(timer.current); timer.current = setTimeout(() => setFlash(''), 2200); };
  const setField = (id, v) => setRaw((r) => ({ ...r, [id]: v }));
  const blank = () => Object.fromEntries(calc.fields.map((f) => [f.id, f.type === 'select' ? exampleFor(f, sys) : '']));
  const loadExample = () => { setRaw(Object.fromEntries(calc.fields.map((f) => [f.id, exampleFor(f, sys)]))); setSubmitted(true); };
  const reset = () => { setRaw(blank()); setSubmitted(false); setFlash(''); };
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (window.innerWidth < 1024) setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const switchUnits = (next) => {
    if (next === sys) return;
    setRaw((r) => {
      const n = { ...r };
      for (const f of calc.fields) {
        if (f.type !== 'number' || !f.dim || String(r[f.id]).trim() === '') continue;
        const x = Number(String(r[f.id]).replace(/,/g, ''));
        if (Number.isFinite(x)) n[f.id] = String(Math.round(((x * DIMS[f.dim].f[sys]) / DIMS[f.dim].f[next]) * 10000) / 10000);
      }
      return n;
    });
    setUnits(next);
  };
  const url = `${window.location.origin}${calcPath(calc.slug)}`;
  const onCopy = async () => {
    if (!outcome?.out) return;
    say((await copyText(resultText(calc, raw, sys, currencySym, outcome.out, url))) ? 'Result copied' : 'Copy failed – select the text manually');
  };
  const onShare = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: calc.seoTitle, text: calc.short, url }); return; }
      say((await copyText(url)) ? 'Link copied' : 'Copy failed');
    } catch { /* share dialog dismissed */ }
  };

  const example = useMemo(() => {
    const exRaw = Object.fromEntries(calc.fields.map((f) => [f.id, exampleFor(f, 'metric')]));
    return { raw: exRaw, out: run(calc, exRaw, 'metric', currencySym).out };
  }, [calc, currencySym]);

  return (
    <Page>
      <Seo meta={meta} />
      <div className="container-x pb-4 pt-8">
        <Breadcrumbs items={[['Home', '/'], ['Calculators', '/calculators'], [cat.name, `/category/${cat.slug}`], [calc.name]]} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{calc.name}</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">{calc.short}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => toggleFav(calc.slug)} aria-pressed={fav} className="btn btn-ghost">
              <Heart className={`h-4 w-4 ${fav ? 'fill-rose-500 text-rose-500' : ''}`} aria-hidden="true" /> {fav ? 'Saved' : 'Save'}
            </button>
            <button type="button" onClick={onShare} className="btn btn-ghost"><Share2 className="h-4 w-4" aria-hidden="true" /> Share</button>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <form onSubmit={onSubmit} noValidate className="card p-5 sm:p-6" aria-label={`${calc.name} inputs`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Enter your measurements</h2>
              {!calc.noUnits && <UnitSwitch sys={sys} onChange={switchUnits} />}
              {calc.cost && (
                <label className="flex items-center gap-2 text-sm font-medium">
                  Currency
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input !w-auto !py-1.5">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.sym.trim()})</option>)}
                  </select>
                </label>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((f) => (
                <Field key={f.id} field={f} value={raw[f.id] ?? ''} onChange={(v) => setField(f.id, v)} error={outcome?.errors?.[f.id]} unit={f.type === 'number' ? unitLabel(f, sys, currencySym) : ''} example={f.type === 'number' ? exampleFor(f, sys) : ''} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primary flex-1 sm:flex-none"><CalcIcon className="h-4 w-4" aria-hidden="true" /> Calculate</button>
              <button type="button" onClick={reset} className="btn btn-ghost"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset</button>
              <button type="button" onClick={loadExample} className="btn btn-ghost"><Lightbulb className="h-4 w-4" aria-hidden="true" /> Try example</button>
            </div>
            {submitted && !outcome?.error && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Results update as you edit the fields.</p>}
          </form>
          <div ref={resultRef} className="scroll-mt-24 lg:sticky lg:top-24">
            <ResultPanel outcome={outcome} onCopy={onCopy} onShare={onShare} onExample={loadExample} flash={flash} />
          </div>
        </div>
      </div>

      <div className="container-x max-w-4xl space-y-12 py-12">
        <section aria-labelledby="about"><h2 id="about" className="h-section">About the {calc.name}</h2><p className="mt-3 leading-relaxed">{calc.about}</p></section>

        <section aria-labelledby="how">
          <h2 id="how" className="h-section">How to use this calculator</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
            {calc.fields.filter((f) => f.hint).map((f) => <li key={f.id}><strong className="font-semibold text-slate-900 dark:text-white">{f.label}:</strong> {f.hint}</li>)}
            <li>Select <strong className="font-semibold text-slate-900 dark:text-white">Calculate</strong>. The result and a step-by-step breakdown appear immediately and update when you change a value.</li>
            <li>Use <strong className="font-semibold text-slate-900 dark:text-white">Copy result</strong> to paste the figures into a quote or note, or <strong className="font-semibold text-slate-900 dark:text-white">Share</strong> to send the calculator link.</li>
          </ol>
        </section>

        <section aria-labelledby="formula">
          <h2 id="formula" className="h-section">Formula explanation</h2>
          <ul className="card mt-3 divide-y divide-slate-200 dark:divide-ink-line">
            {calc.formula.map((f) => <li key={f} className="px-5 py-3 font-mono text-sm text-slate-800 dark:text-slate-200">{f}</li>)}
          </ul>
        </section>

        {example.out && (
          <section aria-labelledby="example">
            <h2 id="example" className="h-section">Example calculation</h2>
            <div className="card mt-3 p-5">
              <p className="text-sm font-semibold">Inputs (metric)</p>
              <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {calc.fields.filter((f) => isVisible(f, example.raw)).map((f) => {
                  const o = f.type === 'select' ? f.options.find((x) => x.value === example.raw[f.id])?.label : `${example.raw[f.id]} ${unitLabel(f, 'metric', currencySym)}`.trim();
                  return <li key={f.id}><span className="text-slate-500 dark:text-slate-400">{f.label}:</span> {o}</li>;
                })}
              </ul>
              <p className="mt-4 text-sm font-semibold">Result</p>
              <ul className="mt-2 space-y-1 text-sm">
                {example.out.results.slice(0, 4).map((r, i) => <li key={`${r.label}-${i}`}>{r.label}: <strong className="text-slate-900 dark:text-white">{r.value} {r.unit}</strong></li>)}
              </ul>
              <button type="button" onClick={() => { loadExample(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn btn-ghost mt-4">Load this example into the calculator</button>
            </div>
          </section>
        )}

        {calc.conv.length > 0 && (
          <section aria-labelledby="conv">
            <h2 id="conv" className="h-section">Measurement conversion reference</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {calc.conv.map((k) => (
                <div key={k} className="card overflow-x-auto p-4">
                  <h3 className="mb-2 text-sm font-semibold">{CONVERSIONS[k].title}</h3>
                  <table className="w-full text-sm"><tbody>
                    {CONVERSIONS[k].rows.map(([a, b]) => <tr key={a} className="border-t border-slate-100 dark:border-ink-line"><th scope="row" className="py-1.5 pr-3 text-left font-medium text-slate-800 dark:text-slate-200">{a}</th><td className="py-1.5 text-slate-600 dark:text-slate-400">{b}</td></tr>)}
                  </tbody></table>
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="faq"><h2 id="faq" className="h-section mb-4">Frequently asked questions</h2><FAQ items={calc.faqs} /></section>

        {guide && (
          <aside className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div><p className="text-sm font-semibold text-brand-700 dark:text-brand-400">Related guide</p><p className="font-medium">{guide.title}</p></div>
            <Link to={`/guides/${guide.slug}`} className="btn btn-ghost">Read the guide</Link>
          </aside>
        )}

        <section aria-labelledby="related">
          <h2 id="related" className="h-section mb-4">Related calculators</h2>
          <div className="grid gap-4 sm:grid-cols-2">{related.map((c) => <CalculatorCard key={c.slug} calc={c} />)}</div>
        </section>
      </div>
    </Page>
  );
}
