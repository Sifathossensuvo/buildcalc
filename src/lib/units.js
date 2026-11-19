export const FT = 0.3048;
export const IN = 0.0254;
export const FT2 = 0.09290304;
export const FT3 = 0.028316846592;
export const YD3 = 0.764554857984;
export const LB = 0.45359237;
export const STON = 907.18474;
export const GAL = 3.785411784;
export const LB_FT3 = 16.01846337396;

// dim -> label + factor that converts the displayed unit to SI (metres, m², m³ ...)
export const DIMS = {
  len: { label: { metric: 'm', imperial: 'ft' }, f: { metric: 1, imperial: FT } },
  dep: { label: { metric: 'cm', imperial: 'in' }, f: { metric: 0.01, imperial: IN } },
  sm: { label: { metric: 'mm', imperial: 'in' }, f: { metric: 0.001, imperial: IN } },
  area: { label: { metric: 'm²', imperial: 'ft²' }, f: { metric: 1, imperial: FT2 } },
  vol: { label: { metric: 'm³', imperial: 'ft³' }, f: { metric: 1, imperial: FT3 } },
  cov: { label: { metric: 'm²/L', imperial: 'ft²/gal' }, f: { metric: 1, imperial: FT2 / GAL } },
  dens: { label: { metric: 'kg/m³', imperial: 'lb/ft³' }, f: { metric: 1, imperial: LB_FT3 } },
};

export const CURRENCIES = [
  { code: 'USD', sym: '$' },
  { code: 'BDT', sym: '৳' },
  { code: 'INR', sym: '₹' },
  { code: 'GBP', sym: '£' },
  { code: 'EUR', sym: '€' },
  { code: 'AUD', sym: 'A$' },
  { code: 'CAD', sym: 'C$' },
  { code: 'AED', sym: 'AED ' },
];
