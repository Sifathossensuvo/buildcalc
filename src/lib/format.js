import { FT, FT2, FT3, YD3, LB, STON, IN } from './units.js';

export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

export function fmt(v, dp = 2) {
  if (!isNum(v)) return '—';
  const r = Math.round(v * 10 ** dp) / 10 ** dp;
  if (!isNum(r)) return '—';
  return (r === 0 ? 0 : r).toLocaleString('en-US', { maximumFractionDigits: dp });
}

// ceil that ignores floating point noise (e.g. 2.0000000000000004 -> 2)
export const ceilN = (v) => Math.ceil(Number(v.toFixed(6)));

export const row = (label, n, unit = '', dp = 2, primary = false) => ({ label, value: fmt(n, dp), unit, primary });
export const cashRow = (label, n, c, primary = false) => ({ label, value: `${c.cur}${fmt(n, 2)}`, unit: '', primary });

export function volRows(m3, c, p = 'Volume', primary = true) {
  const rows = [
    row(`${p} (cubic metres)`, m3, 'm³', 3),
    row(`${p} (cubic feet)`, m3 / FT3, 'ft³', 2),
    row(`${p} (cubic yards)`, m3 / YD3, 'yd³', 3),
  ];
  if (c.sys === 'imperial') rows.reverse();
  rows[0].primary = primary;
  return rows;
}

export function massRows(kg, c, p = 'Estimated weight', primary = true) {
  const t = row(`${p} (tonnes)`, kg / 1000, 't', 3);
  const k = row(`${p} (kilograms)`, kg, 'kg', 0);
  const s = row(`${p} (US short tons)`, kg / STON, 'tons', 3);
  const l = row(`${p} (pounds)`, kg / LB, 'lb', 0);
  const rows = c.sys === 'imperial' ? [s, l, t, k] : [t, k, s, l];
  rows[0].primary = primary;
  return rows;
}

export const Lg = (m, c) => (c.sys === 'imperial' ? `${fmt(m / FT, 3)} ft` : `${fmt(m, 3)} m`);
export const Sm = (m, c) => (c.sys === 'imperial' ? `${fmt(m / IN, 3)} in` : `${fmt(m * 1000, 1)} mm`);
export const Ar = (m2, c) => (c.sys === 'imperial' ? `${fmt(m2 / FT2, 2)} ft²` : `${fmt(m2, 3)} m²`);
export const areaNum = (m2, c) => (c.sys === 'imperial' ? m2 / FT2 : m2);
export const areaUnit = (c) => (c.sys === 'imperial' ? 'ft²' : 'm²');
export const Vo = (m3) => `${fmt(m3, 3)} m³`;
