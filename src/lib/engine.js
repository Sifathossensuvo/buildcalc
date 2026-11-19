import { DIMS } from './units.js';

export const unitLabel = (f, sys, cur) => (f.unit === 'cur' ? (cur || '$').trim() : f.unit !== undefined ? f.unit : f.dim ? DIMS[f.dim].label[sys] : '');

const round = (n, dp) => Math.round(n * 10 ** dp) / 10 ** dp;

// Example value shown as placeholder / used by "Try example". ex may be a value or [metric, imperial].
export function exampleFor(f, sys) {
  let e = f.ex;
  if (Array.isArray(e)) e = e[sys === 'metric' ? 0 : 1];
  else if (f.dim && e !== undefined) e = round((Number(e) * DIMS[f.dim].f.metric) / DIMS[f.dim].f[sys], 4);
  if (e === undefined) return f.type === 'select' ? f.options[0].value : '';
  return String(e);
}

export const isVisible = (f, raw) => !f.showIf || f.showIf(raw);

export function validate(calc, raw, sys) {
  const errors = {};
  const v = {};
  for (const f of calc.fields) {
    if (!isVisible(f, raw)) continue;
    const r = String(raw[f.id] ?? '').trim();
    if (f.type === 'select') {
      if (!f.options.some((o) => o.value === r)) errors[f.id] = 'Please choose an option.';
      else v[f.id] = r;
      continue;
    }
    if (r === '') {
      if (f.optional) v[f.id] = f.def0 ?? 0;
      else errors[f.id] = 'This field is required.';
      continue;
    }
    if (r.startsWith('-')) { errors[f.id] = 'Value cannot be negative.'; continue; }
    const clean = r.replace(/,/g, '');
    if (!/^(\d+(\.\d*)?|\.\d+)$/.test(clean)) { errors[f.id] = 'Enter a valid number (digits only).'; continue; }
    const n = Number(clean);
    if (!Number.isFinite(n)) { errors[f.id] = 'Enter a valid number.'; continue; }
    if (n === 0 && !f.zero) { errors[f.id] = 'Value must be greater than 0.'; continue; }
    if (f.int && !Number.isInteger(n)) { errors[f.id] = 'Enter a whole number.'; continue; }
    const max = f.max ?? 1e7;
    if (n > max) { errors[f.id] = `Value is too large (maximum ${max.toLocaleString('en-US')}).`; continue; }
    v[f.id] = f.dim ? n * DIMS[f.dim].f[sys] : n;
  }
  return { errors, v };
}

export function run(calc, raw, sys, cur = '$') {
  const { errors, v } = validate(calc, raw, sys);
  if (Object.keys(errors).length) return { errors };
  let out;
  try {
    out = calc.compute(v, { sys, cur });
  } catch {
    return { errors: {}, error: 'These values could not be calculated. Please check your inputs.' };
  }
  if (out.error) return { errors: {}, error: out.error };
  if (out.results.some((r) => r.value === '—')) return { errors: {}, error: 'The result is outside a sensible range. Please check your inputs.' };
  return { errors: {}, out };
}

export function resultText(calc, raw, sys, cur, out, url) {
  const lines = [`${calc.name} – BuildCalc`, ''];
  lines.push('Inputs:');
  for (const f of calc.fields) {
    if (!isVisible(f, raw)) continue;
    const val = f.type === 'select' ? f.options.find((o) => o.value === raw[f.id])?.label : String(raw[f.id] || '').trim() || '(blank)';
    const u = f.type === 'select' ? '' : ` ${unitLabel(f, sys, cur)}`.trimEnd();
    lines.push(`- ${f.label}: ${val}${u}`);
  }
  lines.push('', 'Results:');
  for (const r of out.results) lines.push(`- ${r.label}: ${r.value}${r.unit ? ' ' + r.unit : ''}`);
  lines.push('', 'Planning estimate only – not engineering advice.', url);
  return lines.join('\n');
}
