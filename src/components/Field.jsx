import { useId } from 'react';
import { Info } from 'lucide-react';

export function Tip({ text }) {
  const id = useId();
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-describedby={id} aria-label="More information" className="rounded-full text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>
      <span id={id} role="tooltip" className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-2 w-60 rounded-lg bg-slate-900 p-2.5 text-xs font-normal leading-relaxed text-white opacity-0 shadow-lift transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {text}
      </span>
    </span>
  );
}

export default function Field({ field, value, onChange, error, unit, example }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={field.type === 'select' ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="label">
        {field.label}
        {field.optional && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(optional)</span>}
        {field.hint && <Tip text={field.hint} />}
      </label>
      {field.type === 'select' ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={`input ${error ? 'input-error' : ''}`}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <div className="relative">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={example ? `e.g. ${example}` : ''}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            className={`input ${unit ? 'pr-16' : ''} ${error ? 'input-error' : ''}`}
          />
          {unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>
      )}
      {error && <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
