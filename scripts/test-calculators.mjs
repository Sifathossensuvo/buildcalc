// Run with: npm test   (plain Node, no browser needed)
import { CALCULATORS, BY_SLUG } from '../src/data/calculators.js';
import { run, exampleFor } from '../src/lib/engine.js';

let pass = 0, fail = 0;
const get = (out, label, unit) => out.results.find((r) => r.label === label && (!unit || r.unit === unit));
const num = (s) => Number(String(s).replace(/[^0-9.\-]/g, ''));
function check(name, got, want, tol = 0.01) {
  const ok = Math.abs(got - want) <= tol;
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  got=${got}  want=${want}`);
}
const calc = (slug, raw, sys = 'metric', cur = '$') => run(BY_SLUG[slug], raw, sys, cur);
const val = (r, label, unit) => num(get(r.out, label, unit).value);

let r;
r = calc('brick-calculator', { wallL: '5', wallH: '2.4', brickL: '215', brickH: '65', brickD: '102.5', joint: '10', openings: '1', openArea: '1.8', waste: '5' });
check('brick: bricks incl. wastage (635)', val(r, 'Bricks required (incl. wastage)'), 635, 0);
check('brick: bricks before wastage (605)', val(r, 'Bricks before wastage'), 605, 0);
check('brick: mortar m³', val(r, 'Estimated mortar volume', 'm³'), 0.18, 0.002);
r = calc('brick-wall-calculator', { wallL: '5', wallH: '2.4', wallT: '10.25', brickL: '215', brickH: '65', brickD: '102.5', joint: '10', waste: '' });
check('brick wall: bricks (648)', val(r, 'Bricks required (incl. wastage)'), 648, 0);
check('brick wall: volume m³', val(r, 'Wall volume (cubic metres)'), 1.23, 0.001);
r = calc('brick-cost-calculator', { bricks: '1000', price: '12', delivery: '1500', waste: '5' });
check('brick cost: total 14100', val(r, 'Estimated total cost'), 14100, 0.01);
r = calc('tile-calculator', { roomL: '4', roomW: '3', tileL: '60', tileW: '60', waste: '10' });
check('tile: total 37', val(r, 'Total tiles to buy'), 37, 0);
check('tile: extra 3', val(r, 'Extra tiles (wastage)'), 3, 0);
r = calc('tile-box-calculator', { area: '12', cover: '1.44', waste: '10' });
check('tile box: 10 boxes', val(r, 'Boxes needed'), 10, 0);
check('tile box: remaining 1.2 m²', val(r, 'Remaining coverage (after wastage allowance)'), 1.2, 0.001);
r = calc('flooring-calculator', { floorL: '5', floorW: '4', pieceL: '1200', pieceW: '190', waste: '8' });
check('flooring: 95 planks', val(r, 'Planks required'), 95, 0);
r = calc('concrete-calculator', { len: '5', wid: '4', depth: '10', waste: '' });
check('concrete: m³', val(r, 'Concrete volume (cubic metres)'), 2, 0.0001);
check('concrete: ft³', val(r, 'Concrete volume (cubic feet)'), 70.63, 0.01);
check('concrete: yd³', val(r, 'Concrete volume (cubic yards)'), 2.616, 0.001);
r = calc('concrete-calculator', { len: '20', wid: '10', depth: '6', waste: '' }, 'imperial');
check('concrete imperial 20x10ft x 6in = 100 ft³', val(r, 'Concrete volume (cubic feet)'), 100, 0.01);
check('concrete imperial yd³ 3.704', val(r, 'Concrete volume (cubic yards)'), 3.704, 0.001);
r = calc('concrete-slab-calculator', { len: '5', wid: '4', depth: '10', bag: '80', waste: '5' });
check('slab: 124 bags of 80 lb', val(r, 'Bags required'), 124, 0);
r = calc('cement-calculator', { vol: '2', ratio: '1:2:4', bag: '50', dry: '', dens: '' });
check('cement: 13 bags', val(r, 'Cement bags (50 kg)'), 13, 0);
check('cement: weight 633.6 kg', val(r, 'Cement weight'), 634, 1);
check('cement: sand 0.88 m³', val(r, 'Sand volume', 'm³'), 0.88, 0.001);
check('cement: aggregate 1.76 m³', val(r, 'Aggregate volume', 'm³'), 1.76, 0.001);
r = calc('gravel-calculator', { len: '10', wid: '4', depth: '5', mat: 'gravel', waste: '' });
check('gravel: 3.36 tonnes', val(r, 'Estimated weight (tonnes)'), 3.36, 0.001);
r = calc('pea-gravel-calculator', { area: '20', depth: '5', dens: '', waste: '' });
check('pea gravel: 1.7 tonnes', val(r, 'Estimated weight (tonnes)'), 1.7, 0.001);
r = calc('gravel-driveway-calculator', { len: '12', wid: '3', depth: '10', layers: '2', mat: 'gravel', comp: '15' });
check('driveway: 13.91 tonnes', val(r, 'Total material weight (tonnes)'), 13.91, 0.01);
r = calc('topsoil-calculator', { len: '5', wid: '3', depth: '15', waste: '' });
check('topsoil: 2.25 m³', val(r, 'Topsoil (cubic metres)'), 2.25, 0.0001);
check('topsoil: 2.943 yd³', val(r, 'Topsoil (cubic yards)'), 2.943, 0.001);
r = calc('garden-soil-calculator', { len: '4', wid: '2', depth: '30', bag: 'l40', waste: '' });
check('garden soil: 60 bags of 40 L', val(r, 'Bags needed'), 60, 0);
r = calc('roof-pitch-calculator', { rise: '6', run: '12' });
check('pitch: 6 per 12', val(r, 'Roof pitch (rise per 12 run)'), 6, 0.001);
check('pitch: 26.57°', val(r, 'Roof angle'), 26.57, 0.01);
check('pitch: 50%', val(r, 'Slope percentage'), 50, 0.001);
r = calc('roofing-calculator', { roofL: '12', roofW: '8', pitch: '6', over: '0.3', mat: 'bundle', waste: '10' });
check('roofing: area 121.15 m²', val(r, 'Estimated roof surface area'), 121.2, 0.1);
check('roofing: 44 bundles', val(r, 'Material units to order'), 44, 0);
r = calc('deck-calculator', { len: '4.8', wid: '3.6', bw: '140', gap: '5', bl: '2.4', waste: '10' });
check('deck: rows 25', val(r, 'Rows of boards'), 25, 0);
check('deck: 55 boards', val(r, 'Boards required (incl. wastage)'), 55, 0);
r = calc('fence-calculator', { len: '30', sp: '2.4', h: '1.8', layout: 'open' });
check('fence: 14 posts', val(r, 'Fence posts'), 14, 0);
check('fence: 13 sections', val(r, 'Fence sections / panels'), 13, 0);
r = calc('paint-calculator', { wallL: '5', wallH: '2.7', walls: '4', open: '3.6', coats: '2', cov: '10', waste: '' });
check('paint: 10.08 L', val(r, 'Paint needed', 'litres'), 10.08, 0.001);
r = calc('construction-cost-calculator', { mat: '25000', lab: '15000', add: '5000', cont: '10' });
check('cost: total 49500', val(r, 'Estimated total project cost'), 49500, 0.01);

// validation
const bad = (name, raw) => { const x = calc('concrete-calculator', raw); const ok = !!x.errors && Object.keys(x.errors).length > 0; ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  validation: ${name}`); };
bad('zero value', { len: '0', wid: '4', depth: '10' });
bad('negative value', { len: '-5', wid: '4', depth: '10' });
bad('blank value', { len: '', wid: '4', depth: '10' });
bad('text value', { len: 'abc', wid: '4', depth: '10' });
bad('huge value', { len: '1e12', wid: '4', depth: '10' });
r = calc('brick-calculator', { wallL: '2', wallH: '2', brickL: '215', brickH: '65', brickD: '102.5', joint: '10', openings: '5', openArea: '5', waste: '' });
{ const ok = !!r.error; ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  openings larger than wall -> error`); }

// every calculator must run with its own example values in both unit systems and never show NaN/Infinity
for (const c of CALCULATORS) for (const sys of ['metric', 'imperial']) {
  const raw = Object.fromEntries(c.fields.map((f) => [f.id, exampleFor(f, sys)]));
  const x = run(c, raw, sys, '$');
  const text = x.out ? JSON.stringify(x.out) : '';
  const ok = !!x.out && !/NaN|Infinity|undefined/.test(text);
  ok ? pass++ : fail++;
  if (!ok) console.log('FAIL  example', c.slug, sys, JSON.stringify(x));
}
console.log(`\n${CALCULATORS.length} calculators loaded. ${pass} checks passed, ${fail} failed.`);
process.exit(fail ? 1 : 0);
