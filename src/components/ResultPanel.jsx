import { AlertTriangle, Calculator, Check, Copy, Lightbulb, Share2 } from 'lucide-react';

export default function ResultPanel({ outcome, onCopy, onShare, onExample, flash }) {
  if (!outcome) {
    return (
      <div className="card flex flex-col items-center px-6 py-12 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-ink-soft dark:text-brand-400"><Calculator className="h-7 w-7" aria-hidden="true" /></span>
        <h2 className="text-lg font-semibold">Your result will appear here</h2>
        <p className="mt-1 max-w-xs text-sm text-slate-600 dark:text-slate-400">Fill in the fields and select Calculate, or load sample values to see how it works.</p>
        <button type="button" onClick={onExample} className="btn btn-ghost mt-5"><Lightbulb className="h-4 w-4" aria-hidden="true" /> Try an example</button>
      </div>
    );
  }
  if (outcome.errors && Object.keys(outcome.errors).length) {
    return (
      <div className="card border-red-300 bg-red-50 p-6 dark:border-red-500/40 dark:bg-red-500/10" role="alert">
        <h2 className="flex items-center gap-2 text-base font-semibold text-red-700 dark:text-red-300"><AlertTriangle className="h-5 w-5" aria-hidden="true" /> Check your inputs</h2>
        <p className="mt-1 text-sm text-red-700/90 dark:text-red-300/90">Some fields need attention. The problems are marked in red on the form.</p>
      </div>
    );
  }
  if (outcome.error) {
    return (
      <div className="card border-amber-300 bg-amber-50 p-6 dark:border-amber-500/40 dark:bg-amber-500/10" role="alert">
        <h2 className="flex items-center gap-2 text-base font-semibold text-amber-800 dark:text-amber-300"><AlertTriangle className="h-5 w-5" aria-hidden="true" /> Cannot calculate yet</h2>
        <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-300/90">{outcome.error}</p>
      </div>
    );
  }
  const { results, breakdown, notes } = outcome.out;
  const main = results.find((r) => r.primary) || results[0];
  const rest = results.filter((r) => r !== main);
  return (
    <div className="space-y-4" aria-live="polite">
      <div className="card overflow-hidden">
        <div className="bg-brand-50 p-6 dark:bg-ink-soft">
          <p className="text-sm font-medium text-brand-700 dark:text-brand-400">{main.label}</p>
          <p className="mt-1 break-words text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {main.value} {main.unit && <span className="text-lg font-semibold text-slate-600 dark:text-slate-300">{main.unit}</span>}
          </p>
        </div>
        {rest.length > 0 && (
          <dl className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-ink-line">
            {rest.map((r, i) => (
              <div key={`${r.label}-${r.unit}-${i}`} className="bg-white p-4 dark:bg-ink-surface">
                <dt className="text-xs text-slate-500 dark:text-slate-400">{r.label}</dt>
                <dd className="mt-0.5 break-words text-base font-semibold text-slate-900 dark:text-white">{r.value} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{r.unit}</span></dd>
              </div>
            ))}
          </dl>
        )}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 p-4 dark:border-ink-line">
          <button type="button" onClick={onCopy} className="btn btn-ghost">{flash === 'Result copied' ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />} Copy result</button>
          <button type="button" onClick={onShare} className="btn btn-ghost"><Share2 className="h-4 w-4" aria-hidden="true" /> Share</button>
          <span role="status" className="self-center text-sm font-medium text-emerald-700 dark:text-emerald-400">{flash}</span>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-base font-semibold">Detailed breakdown</h2>
        <dl className="mt-3 divide-y divide-slate-200 text-sm dark:divide-ink-line">
          {breakdown.map(([k, v]) => (
            <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr]">
              <dt className="font-medium text-slate-700 dark:text-slate-300">{k}</dt>
              <dd className="break-words text-slate-600 dark:text-slate-400">{v}</dd>
            </div>
          ))}
        </dl>
        {notes?.length > 0 && (
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        )}
      </div>
      <p className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Planning estimate only. It is not engineering, structural or professional advice. Check quantities with your supplier and follow local building rules.
      </p>
    </div>
  );
}
