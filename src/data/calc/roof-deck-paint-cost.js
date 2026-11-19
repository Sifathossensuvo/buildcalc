import { FT2, GAL } from '../../lib/units.js';
import { fmt, ceilN, row, cashRow, Lg, Sm, Ar, areaNum, areaUnit } from '../../lib/format.js';
import { num, sel, waste, find } from './helpers.js';

const ROOF_MATERIALS = [
  { value: 'bundle', label: 'Asphalt shingle bundle – 33.3 ft² (3.10 m²), 3 bundles per square', m2: (100 / 3) * FT2 },
  { value: 'square', label: 'Roofing square – 100 ft² (9.29 m²)', m2: 100 * FT2 },
  { value: 'panel', label: 'Metal panel 3 ft × 12 ft – 36 ft² (3.34 m²)', m2: 36 * FT2 },
  { value: 'custom', label: 'Custom coverage per unit (enter below)' },
];

export const ROOF_DECK_PAINT_COST = [
  {
    slug: 'roof-pitch-calculator', name: 'Roof Pitch Calculator', cat: 'roofing', pop: 89, added: '2026-09-15', noUnits: true,
    short: 'Convert rise and run into roof pitch, angle in degrees and slope percentage.',
    seoTitle: 'Roof Pitch Calculator – Pitch, Angle & Slope %',
    keywords: ['roof pitch', 'roof angle', 'slope', 'rise and run', 'degrees', '6/12 pitch'],
    fields: [
      num('rise', 'Rise', { zero: true, ex: '6', hint: 'Vertical height gained. Use the same unit (inches, cm, feet…) for rise and run.' }),
      num('run', 'Run', { ex: '12', hint: 'Horizontal distance. Roof pitch is usually quoted per 12 units of run.' }),
    ],
    compute(v) {
      const ratio = v.rise / v.run;
      const deg = (Math.atan(ratio) * 180) / Math.PI;
      return {
        results: [
          row('Roof pitch (rise per 12 run)', ratio * 12, ': 12', 2, true),
          row('Roof angle', deg, '°', 2),
          row('Slope percentage', ratio * 100, '%', 2),
          row('Rafter length factor', Math.sqrt(1 + ratio * ratio), '× run', 4),
          row('Ratio (1 in n)', v.rise === 0 ? NaN : v.run / v.rise, 'run per 1 rise', 2),
        ],
        breakdown: [
          ['Slope', `${fmt(v.rise, 3)} ÷ ${fmt(v.run, 3)} = ${fmt(ratio, 4)}`],
          ['Pitch', `${fmt(ratio, 4)} × 12 = ${fmt(ratio * 12, 2)} : 12`],
          ['Angle', `arctan(${fmt(ratio, 4)}) = ${fmt(deg, 2)}°`],
          ['Rafter length factor', `√(1 + ${fmt(ratio, 4)}²) = ${fmt(Math.sqrt(1 + ratio * ratio), 4)}`],
        ],
        notes: ['Multiply the horizontal run by the rafter length factor to get the sloped rafter length.', 'A flat roof (rise 0) has no ratio value.'],
      };
    },
    formula: ['Pitch (x : 12) = rise ÷ run × 12', 'Angle = arctan(rise ÷ run)', 'Slope % = rise ÷ run × 100'],
    about: 'Roof pitch describes how steep a roof is. This calculator turns any rise and run into the three formats builders use: pitch per 12 units, angle in degrees and slope percentage. It also shows the factor that converts horizontal run to sloped rafter length.',
    faqs: [
      ['What is a 6/12 roof pitch in degrees?', 'A 6:12 pitch rises 6 units for every 12 units of run, which is an angle of about 26.57° or a 50% slope.'],
      ['Which units should I use?', 'Any, as long as rise and run use the same unit. The ratio is unit-independent.'],
      ['What pitch is considered low-slope?', 'Roofs below about 4:12 are often treated as low-slope, which can limit material choices. Check manufacturer limits.'],
    ],
  },
  {
    slug: 'roofing-calculator', name: 'Roofing Calculator', cat: 'roofing', pop: 82, added: '2026-09-16',
    short: 'Estimate roof surface area and roofing material using pitch, overhang and editable coverage.',
    seoTitle: 'Roofing Calculator – Roof Area & Shingle Estimate',
    keywords: ['roof area', 'shingles', 'roofing squares', 'metal roofing', 'overhang', 'gable roof'],
    fields: [
      num('roofL', 'Roof length (along the ridge)', { dim: 'len', ex: ['12', '40'], hint: 'Length of the building along the ridge, excluding overhang.' }),
      num('roofW', 'Roof width (eave to eave)', { dim: 'len', ex: ['8', '26'], hint: 'Building width across the roof, excluding overhang.' }),
      num('pitch', 'Roof pitch', { unit: ': 12', max: 60, zero: true, ex: '6', hint: 'Rise per 12 units of run. Use the Roof Pitch Calculator if you only know the angle.' }),
      num('over', 'Overhang', { dim: 'len', zero: true, optional: true, ex: ['0.3', '1'], hint: 'How far the roof extends beyond the wall on each side.' }),
      sel('mat', 'Roofing material and coverage', ROOF_MATERIALS, { ex: 'bundle', hint: 'Coverage per unit is an editable assumption.' }),
      num('custCov', 'Coverage per unit', { dim: 'area', ex: ['3.1', '33.3'], showIf: (r) => r.mat === 'custom' }),
      waste('10', 'Hips, valleys and cuts typically need 10–15% extra.'),
    ],
    compute(v, c) {
      const theta = Math.atan(v.pitch / 12);
      const slope = (v.roofW / 2 + v.over) / Math.cos(theta);
      const area = 2 * slope * (v.roofL + 2 * v.over);
      const cov = v.mat === 'custom' ? v.custCov : find(ROOF_MATERIALS, v.mat).m2;
      const units = ceilN((area * (1 + v.waste / 100)) / cov);
      return {
        results: [
          row('Estimated roof surface area', areaNum(area, c), areaUnit(c), 1, true),
          row('Roofing squares (100 ft²)', area / FT2 / 100, 'squares', 2),
          row('Material units to order', units, 'units', 0),
          row('Angle', (theta * 180) / Math.PI, '°', 1),
          row('Slope length per side', c.sys === 'imperial' ? slope / 0.3048 : slope, c.sys === 'imperial' ? 'ft' : 'm', 2),
        ],
        breakdown: [
          ['Slope length', `(${Lg(v.roofW, c)} ÷ 2 + ${Lg(v.over, c)}) ÷ cos(${fmt((theta * 180) / Math.PI, 1)}°) = ${Lg(slope, c)}`],
          ['Roof area', `2 × ${Lg(slope, c)} × (${Lg(v.roofL, c)} + 2 × ${Lg(v.over, c)}) = ${Ar(area, c)}`],
          ['Material', `${Ar(area * (1 + v.waste / 100), c)} ÷ ${Ar(cov, c)} per unit = ${fmt((area * (1 + v.waste / 100)) / cov, 2)} → ${units}`],
        ],
        notes: ['Assumes a simple gable roof with two equal slopes. Hip roofs, dormers and complex shapes need extra allowance or separate measurement.', 'Coverage assumptions are typical; use the product data sheet for exact figures.'],
      };
    },
    formula: ['Slope length = (width ÷ 2 + overhang) ÷ cos(angle), where angle = arctan(pitch ÷ 12)', 'Roof area = 2 × slope length × (length + 2 × overhang)', 'Units = area × (1 + wastage) ÷ coverage per unit, rounded up'],
    about: 'The roofing calculator estimates the surface of a gable roof from its footprint, pitch and overhang, then converts it into roofing squares and a number of material units. Coverage per unit is an editable assumption so it can follow your product.',
    faqs: [
      ['Why is roof area bigger than floor area?', 'Because the roof is sloped. A steeper pitch has more surface than the floor beneath it, plus any overhang adds more.'],
      ['What is a roofing square?', 'A roofing square is 100 square feet of roof surface, commonly used to price shingles and labour.'],
      ['Does it work for hip roofs?', 'It is built for simple gable roofs. For hip roofs, measure each plane separately or add extra wastage.'],
    ],
  },
  {
    slug: 'deck-calculator', name: 'Deck Calculator', cat: 'decking-fencing', pop: 85, added: '2026-09-17',
    short: 'Estimate decking boards and area from deck size, board width and gap.',
    seoTitle: 'Deck Calculator – How Many Deck Boards Do I Need?',
    keywords: ['deck', 'decking', 'deck boards', 'board spacing', 'composite', 'timber deck'],
    fields: [
      num('len', 'Deck length', { dim: 'len', ex: ['4.8', '16'], hint: 'Boards run parallel to this side.' }),
      num('wid', 'Deck width', { dim: 'len', ex: ['3.6', '12'] }),
      num('bw', 'Board width', { dim: 'sm', ex: ['140', '5.5'], hint: 'Face width of one board.' }),
      num('gap', 'Board spacing (gap)', { dim: 'sm', zero: true, ex: ['5', '0.1875'], hint: 'Gap between boards. 3–6 mm (1/8–1/4 in) is typical, but follow the manufacturer’s advice.' }),
      num('bl', 'Board length', { dim: 'len', ex: ['2.4', '8'], hint: 'Stock length of one board.' }),
      waste('10', '5–10% for straight layouts, 15% for diagonal layouts.'),
    ],
    compute(v, c) {
      const rows = ceilN((v.wid + v.gap) / (v.bw + v.gap));
      const per = ceilN(v.len / v.bl);
      const boards = ceilN(rows * per * (1 + v.waste / 100));
      return {
        results: [
          row('Boards required (incl. wastage)', boards, 'boards', 0, true),
          row('Rows of boards', rows, 'rows', 0),
          row('Boards per row', per, 'boards', 0),
          row('Decking area', areaNum(v.len * v.wid, c), areaUnit(c), 2),
          row('Boards before wastage', rows * per, 'boards', 0),
        ],
        breakdown: [
          ['Rows across the width', `(${Lg(v.wid, c)} + ${Sm(v.gap, c)}) ÷ (${Sm(v.bw, c)} + ${Sm(v.gap, c)}) = ${fmt((v.wid + v.gap) / (v.bw + v.gap), 2)} → ${rows}`],
          ['Boards per row', `${Lg(v.len, c)} ÷ ${Lg(v.bl, c)} = ${fmt(v.len / v.bl, 2)} → ${per}`],
          ['Total', `${rows} × ${per} × (1 + ${fmt(v.waste, 1)}%) = ${boards}`],
        ],
        notes: ['Counts whole boards per row and does not assume offcuts are reused. Joists, fixings and fascia boards are not included.'],
      };
    },
    formula: ['Rows = (deck width + gap) ÷ (board width + gap), rounded up', 'Boards per row = deck length ÷ board length, rounded up', 'Total boards = rows × boards per row × (1 + wastage ÷ 100)'],
    about: 'The deck calculator counts the rows of boards needed to cross your deck, including the gaps between them, and then the boards required per row from the stock length you buy. It adds wastage and reports the finished decking area.',
    faqs: [
      ['How wide should the gap between deck boards be?', 'Many timber and composite boards use 3–6 mm (1/8–1/4 in). Follow the manufacturer’s guidance because it depends on the material.'],
      ['Does it include joists and screws?', 'No. This tool counts surface boards only.'],
      ['Which board length should I use?', 'Choose the stock length that wastes the least. For a 4.8 m deck, two 2.4 m boards per row waste nothing.'],
    ],
  },
  {
    slug: 'fence-calculator', name: 'Fence Calculator', cat: 'decking-fencing', pop: 87, added: '2026-09-18',
    short: 'Estimate posts and sections for a fence from run length, post spacing and height.',
    seoTitle: 'Fence Calculator – How Many Fence Posts & Panels?',
    keywords: ['fence', 'fence posts', 'fence panels', 'post spacing', 'fence sections'],
    fields: [
      num('len', 'Fence length', { dim: 'len', ex: ['30', '100'], hint: 'Total length of the fence line.' }),
      num('sp', 'Post spacing', { dim: 'len', ex: ['2.4', '8'], hint: 'Centre-to-centre spacing. Many panels are 1.8–2.4 m (6–8 ft) wide.' }),
      num('h', 'Fence height', { dim: 'len', ex: ['1.8', '6'], hint: 'Height of the fence above the ground.' }),
      sel('layout', 'Layout', [{ value: 'open', label: 'Straight or open run (posts at both ends)' }, { value: 'closed', label: 'Closed loop (enclosed area)' }], { ex: 'open' }),
    ],
    compute(v, c) {
      const sections = ceilN(v.len / v.sp);
      const posts = v.layout === 'closed' ? sections : sections + 1;
      const actual = v.len / sections;
      return {
        results: [
          row('Fence posts', posts, 'posts', 0, true),
          row('Fence sections / panels', sections, 'sections', 0),
          row('Actual post spacing', c.sys === 'imperial' ? actual / 0.3048 : actual, c.sys === 'imperial' ? 'ft' : 'm', 2),
          row('Fence face area', areaNum(v.len * v.h, c), areaUnit(c), 1),
          row('Suggested post length', c.sys === 'imperial' ? (v.h * 1.5) / 0.3048 : v.h * 1.5, c.sys === 'imperial' ? 'ft' : 'm', 2),
        ],
        breakdown: [
          ['Sections', `${Lg(v.len, c)} ÷ ${Lg(v.sp, c)} = ${fmt(v.len / v.sp, 2)} → ${sections}`],
          ['Posts', v.layout === 'closed' ? `Closed loop: posts = sections = ${posts}` : `Open run: sections + 1 = ${posts}`],
          ['Actual spacing', `${Lg(v.len, c)} ÷ ${sections} = ${Lg(actual, c)}`],
          ['Post length', `${Lg(v.h, c)} × 1.5 = ${Lg(v.h * 1.5, c)} (about one third buried)`],
        ],
        notes: ['Gates, corners and end posts may need heavier posts or extra posts. Add them separately.', 'Embedment depth depends on soil, frost depth and local rules.'],
      };
    },
    formula: ['Sections = fence length ÷ post spacing, rounded up', 'Posts = sections + 1 (open run) or sections (closed loop)', 'Post length ≈ fence height × 1.5 when one third is buried'],
    about: 'The fence calculator turns a fence line into posts and sections. Rounding up the section count keeps panels from exceeding your maximum spacing, and the actual spacing is displayed so you can check it against panel widths.',
    faqs: [
      ['How many posts do I need for a fence?', 'For an open run, one more post than there are sections. For a closed loop, the same number of posts as sections.'],
      ['How far apart should fence posts be?', 'It depends on panel width and fence type; 1.8–2.4 m (6–8 ft) is common for panels.'],
      ['How deep should posts be set?', 'A common rule of thumb is about one third of the post length in the ground, but local frost depth and soil can require more.'],
    ],
  },
  {
    slug: 'paint-calculator', name: 'Paint Calculator', cat: 'painting-home-improvement', pop: 95, added: '2026-09-19',
    short: 'Estimate paint quantity from wall area, openings, number of coats and coverage.',
    seoTitle: 'Paint Calculator – How Much Paint Do I Need?',
    keywords: ['paint', 'litres of paint', 'gallons', 'coats', 'wall area', 'room painting'],
    fields: [
      num('wallL', 'Wall length', { dim: 'len', ex: ['5', '16'], hint: 'Length of one wall. Walls are assumed to be the same size.' }),
      num('wallH', 'Wall height', { dim: 'len', ex: ['2.7', '9'] }),
      num('walls', 'Number of walls', { int: true, max: 100, ex: '4' }),
      num('open', 'Doors/windows to exclude (total area)', { dim: 'area', zero: true, optional: true, ex: ['3.6', '40'], hint: 'Combined area of doors and windows you will not paint.' }),
      num('coats', 'Number of coats', { int: true, max: 10, ex: '2', hint: 'Two coats is standard; dark-to-light changes may need three.' }),
      num('cov', 'Paint coverage', { dim: 'cov', ex: ['10', '400'], hint: 'Coverage per litre (or per gallon) from the paint tin. About 10 m²/L or 400 ft²/gal is common.' }),
      waste('5', 'Extra for touch-ups, rough surfaces and spills.'),
    ],
    compute(v, c) {
      const area = v.wallL * v.wallH * v.walls - v.open;
      if (area <= 0) return { error: 'Excluded doors and windows are larger than the wall area. Reduce the excluded area.' };
      const litres = ((area * v.coats) / v.cov) * (1 + v.waste / 100);
      const gal = litres / GAL;
      return {
        results: [
          c.sys === 'imperial' ? row('Paint needed', gal, 'gallons', 2, true) : row('Paint needed', litres, 'litres', 2, true),
          c.sys === 'imperial' ? row('Paint needed', litres, 'litres', 2) : row('Paint needed', gal, 'US gallons', 2),
          row('Paintable area (one coat)', areaNum(area, c), areaUnit(c), 1),
          row('Total area incl. coats', areaNum(area * v.coats, c), areaUnit(c), 1),
        ],
        breakdown: [
          ['Gross wall area', `${Lg(v.wallL, c)} × ${Lg(v.wallH, c)} × ${v.walls} = ${Ar(v.wallL * v.wallH * v.walls, c)}`],
          ['Paintable area', `${Ar(v.wallL * v.wallH * v.walls, c)} − ${Ar(v.open, c)} = ${Ar(area, c)}`],
          ['Paint', `${fmt(areaNum(area, c), 1)} × ${v.coats} coats ÷ ${fmt(c.sys === 'imperial' ? v.cov / (FT2 / GAL) : v.cov, 1)} ${c.sys === 'imperial' ? 'ft²/gal' : 'm²/L'} × (1 + ${fmt(v.waste, 1)}%)`],
        ],
        notes: ['Coverage depends on surface texture, colour change and application method. Use the tin’s stated coverage.', 'Add primer, ceilings and trim separately.'],
      };
    },
    formula: ['Paintable area = wall length × height × walls − openings', 'Paint = paintable area × coats ÷ coverage per litre (or gallon)', 'Paint to buy = paint × (1 + wastage ÷ 100)'],
    about: 'The paint calculator multiplies your paintable wall area by the number of coats and divides by the coverage on the tin. Doors and windows are excluded, and an optional allowance covers touch-ups so you do not run out part-way through a room.',
    faqs: [
      ['How much area does a litre of paint cover?', 'Roughly 8–12 m² per litre per coat for smooth interior walls. Rough or porous surfaces use more.'],
      ['How many coats of paint do I need?', 'Two coats is the norm. Dramatic colour changes or poor coverage may need an extra coat or primer.'],
      ['Should I include the ceiling?', 'No. Calculate ceilings separately by entering the ceiling area as one wall.'],
    ],
  },
  {
    slug: 'construction-cost-calculator', name: 'Construction Cost Calculator', cat: 'painting-home-improvement', pop: 78, added: '2026-09-20', noUnits: true, cost: true,
    short: 'Estimate a project budget from materials, labour, extra expenses and a contingency percentage.',
    seoTitle: 'Construction Cost Calculator – Project Budget Estimate',
    keywords: ['construction cost', 'project budget', 'contingency', 'labour cost', 'renovation budget', 'estimate'],
    fields: [
      num('mat', 'Material costs', { unit: 'cur', ex: '25000', max: 1e9, hint: 'Total cost of all materials.' }),
      num('lab', 'Labour costs', { unit: 'cur', ex: '15000', max: 1e9, hint: 'Wages or contractor charges.' }),
      num('add', 'Additional expenses', { unit: 'cur', zero: true, optional: true, ex: '5000', max: 1e9, hint: 'Permits, equipment hire, waste removal, transport and similar costs.' }),
      num('cont', 'Contingency', { unit: '%', zero: true, optional: true, max: 100, ex: '10', hint: 'Buffer for surprises. 10% is common for planned projects; 15–20% for renovations.' }),
    ],
    compute(v, c) {
      const sub = v.mat + v.lab + v.add;
      const cont = (sub * v.cont) / 100;
      const total = sub + cont;
      const pct = (x) => (total ? (x / total) * 100 : 0);
      return {
        results: [
          cashRow('Estimated total project cost', total, c, true),
          cashRow('Subtotal before contingency', sub, c),
          cashRow(`Contingency (${fmt(v.cont, 1)}%)`, cont, c),
          row('Materials share of total', pct(v.mat), '%', 1),
          row('Labour share of total', pct(v.lab), '%', 1),
        ],
        breakdown: [
          ['Materials', `${c.cur}${fmt(v.mat, 2)} (${fmt(pct(v.mat), 1)}%)`],
          ['Labour', `${c.cur}${fmt(v.lab, 2)} (${fmt(pct(v.lab), 1)}%)`],
          ['Additional expenses', `${c.cur}${fmt(v.add, 2)} (${fmt(pct(v.add), 1)}%)`],
          ['Contingency', `${c.cur}${fmt(sub, 2)} × ${fmt(v.cont, 1)}% = ${c.cur}${fmt(cont, 2)} (${fmt(pct(cont), 1)}%)`],
          ['Total', `${c.cur}${fmt(total, 2)}`],
        ],
        notes: ['This is a budgeting aid built from the figures you enter. Obtain written quotes before committing to a project.'],
      };
    },
    formula: ['Subtotal = materials + labour + additional expenses', 'Contingency = subtotal × contingency ÷ 100', 'Total = subtotal + contingency'],
    about: 'The construction cost calculator rolls materials, labour and extras into a single project budget and adds a contingency buffer. The breakdown shows what share of the total each part represents, which helps you see where to negotiate or trim.',
    faqs: [
      ['How much contingency should I include?', 'Many planners use 5–10% for straightforward new builds and 15–20% for renovations where hidden issues are likely.'],
      ['What counts as additional expenses?', 'Permits, equipment hire, skip hire, transport, insurance and anything not already in materials or labour.'],
      ['Can I use my own currency?', 'Yes. Choose a currency symbol above the inputs. The calculator does not convert between currencies.'],
    ],
  },
];
