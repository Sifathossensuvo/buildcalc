export const num = (id, label, o = {}) => ({ id, label, type: 'number', ...o });
export const sel = (id, label, options, o = {}) => ({ id, label, type: 'select', options, ...o });
export const waste = (ex = '10', hint) =>
  num('waste', 'Wastage allowance', {
    unit: '%', max: 100, zero: true, optional: true, ex,
    hint: hint || 'Extra material for cuts, breakage and mistakes. Leave blank for none.',
  });
export const find = (list, v) => list.find((o) => o.value === v);

// Typical bulk densities (kg/m³). Real values vary by stone type and moisture.
export const DENSITY = [
  { value: 'gravel', label: 'Gravel (general) – about 1,680 kg/m³ (105 lb/ft³)', kg: 1680 },
  { value: 'crushed', label: 'Crushed stone – about 1,600 kg/m³ (100 lb/ft³)', kg: 1600 },
  { value: 'pea', label: 'Pea gravel – about 1,700 kg/m³ (106 lb/ft³)', kg: 1700 },
  { value: 'river', label: 'River rock – about 1,540 kg/m³ (96 lb/ft³)', kg: 1540 },
  { value: 'custom', label: 'Custom density (enter below)' },
];
export const densityFields = (num, sel) => [
  sel('mat', 'Material type', DENSITY, {
    ex: 'gravel',
    hint: 'Typical bulk densities are used. Actual density varies with stone type and moisture, so choose Custom to enter your supplier’s figure.',
  }),
  num('custDens', 'Custom density', { dim: 'dens', ex: ['1600', '100'], showIf: (r) => r.mat === 'custom', hint: 'Bulk density from your supplier’s data sheet.' }),
];
export const densityKg = (v) => (v.mat === 'custom' ? v.custDens : find(DENSITY, v.mat).kg);
