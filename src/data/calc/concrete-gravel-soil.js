import { FT3, YD3 } from '../../lib/units.js';
import { fmt, ceilN, row, volRows, massRows, Lg, Ar } from '../../lib/format.js';
import { num, sel, waste, find, DENSITY, densityFields, densityKg } from './helpers.js';

const BAGS = [
  { value: '80', label: '80 lb (36 kg) bag – about 0.60 ft³ yield', ft3: 0.6 },
  { value: '60', label: '60 lb (27 kg) bag – about 0.45 ft³ yield', ft3: 0.45 },
  { value: '40', label: '40 lb (18 kg) bag – about 0.30 ft³ yield', ft3: 0.3 },
  { value: 'custom', label: 'Custom yield (enter below)' },
];
const RATIOS = [
  { value: '1:1:2', label: '1 : 1 : 2 (rich – M25 style)' },
  { value: '1:1.5:3', label: '1 : 1.5 : 3 (M20 – general structural)' },
  { value: '1:2:4', label: '1 : 2 : 4 (M15 – general slabs and floors)' },
  { value: '1:3:6', label: '1 : 3 : 6 (lean – blinding, mass fill)' },
  { value: 'custom', label: 'Custom ratio (enter below)' },
];
const CEMENT_BAGS = [
  { value: '50', label: '50 kg bag', kg: 50 },
  { value: '40', label: '40 kg bag', kg: 40 },
  { value: '25', label: '25 kg bag', kg: 25 },
  { value: '42.64', label: '94 lb bag (US, 42.6 kg)', kg: 42.64 },
];
const SOIL_BAGS = [
  { value: 'l20', label: '20 L bag', m3: 0.02 },
  { value: 'l40', label: '40 L bag', m3: 0.04 },
  { value: 'l50', label: '50 L bag', m3: 0.05 },
  { value: 'ft1', label: '1 ft³ bag (28.3 L)', m3: FT3 },
  { value: 'ft15', label: '1.5 ft³ bag (42.5 L)', m3: 1.5 * FT3 },
  { value: 'ft2', label: '2 ft³ bag (56.6 L)', m3: 2 * FT3 },
  { value: 'ft3', label: '3 ft³ bag (85 L)', m3: 3 * FT3 },
];

const L = (id, label, ex, extra = {}) => num(id, label, { dim: 'len', ex, ...extra });
const depthField = (ex = ['10', '4'], hint) => num('depth', 'Depth / thickness', { dim: 'dep', ex, hint: hint || 'Enter in centimetres (metric) or inches (imperial).' });

export const CONCRETE_GRAVEL_SOIL = [
  {
    slug: 'concrete-calculator', name: 'Concrete Calculator', cat: 'concrete-cement', pop: 97, added: '2026-09-07',
    short: 'Concrete volume in cubic metres, cubic feet and cubic yards from length, width and depth.',
    seoTitle: 'Concrete Calculator – Cubic Yards, Feet & Metres',
    keywords: ['concrete', 'cubic yards', 'cubic meters', 'volume', 'slab', 'footing', 'how much concrete'],
    fields: [L('len', 'Length', ['5', '16']), L('wid', 'Width', ['4', '13']), depthField(), waste('0', 'Optional extra volume. Many suppliers advise ordering 5–10% extra.')],
    compute(v, c) {
      const base = v.len * v.wid * v.depth;
      const vol = base * (1 + v.waste / 100);
      return {
        results: volRows(vol, c, 'Concrete volume'),
        breakdown: [
          ['Base volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} = ${fmt(base, 3)} m³`],
          ['Extra allowance', `${fmt(v.waste, 1)}% → ${fmt(vol - base, 3)} m³`],
          ['Total volume', `${fmt(vol, 3)} m³ = ${fmt(vol / FT3, 2)} ft³ = ${fmt(vol / YD3, 3)} yd³`],
        ],
        notes: ['Ready-mix is usually ordered in cubic metres or cubic yards. Ask your supplier for minimum loads.', 'Planning estimate only – structural elements need an engineer’s design.'],
      };
    },
    formula: ['Volume = length × width × depth (all in the same unit)', '1 yd³ = 27 ft³ = 0.7646 m³', 'Volume to order = volume × (1 + extra allowance ÷ 100)'],
    about: 'The concrete calculator converts the length, width and depth of a slab, footing or pad into volume and shows it in cubic metres, cubic feet and cubic yards at once, so you can compare against any supplier’s order unit. An optional allowance covers uneven sub-bases and spillage.',
    faqs: [
      ['How do I convert cubic feet to cubic yards?', 'Divide cubic feet by 27. For example, 135 ft³ is 5 yd³.'],
      ['How much extra concrete should I order?', 'Ordering 5–10% extra is common because sub-grades are rarely perfectly flat and some concrete is lost in forms and delivery.'],
      ['Can I use it for footings and columns?', 'Yes for rectangular shapes. For columns, calculate each section separately and add the volumes.'],
    ],
  },
  {
    slug: 'concrete-slab-calculator', name: 'Concrete Slab Calculator', cat: 'concrete-cement', pop: 88, added: '2026-09-08',
    short: 'Slab volume and the number of premixed concrete bags, based on the bag yield you select.',
    seoTitle: 'Concrete Slab Calculator – Volume & Bags Needed',
    keywords: ['slab', 'patio', 'bags of concrete', 'pad', 'shed base', 'premix'],
    fields: [
      L('len', 'Slab length', ['5', '16']), L('wid', 'Slab width', ['4', '13']),
      num('depth', 'Slab thickness', { dim: 'dep', ex: ['10', '4'], hint: 'Typical patio or shed slabs are 10 cm (4 in) thick.' }),
      sel('bag', 'Bag size and yield', BAGS, { ex: '80', hint: 'Yield per bag is printed on the bag. Check the label because brands differ.' }),
      num('custYield', 'Custom yield per bag', { dim: 'vol', ex: ['0.017', '0.6'], showIf: (r) => r.bag === 'custom', hint: 'Volume of concrete one bag makes, from the bag label.' }),
      waste('5'),
    ],
    compute(v, c) {
      const vol = v.len * v.wid * v.depth;
      const volW = vol * (1 + v.waste / 100);
      const yieldM3 = v.bag === 'custom' ? v.custYield : find(BAGS, v.bag).ft3 * FT3;
      const bags = ceilN(volW / yieldM3);
      return {
        results: [
          row('Bags required', bags, 'bags', 0, true),
          ...volRows(volW, c, 'Volume incl. extra', false),
          row('Yield per bag used', yieldM3 / FT3, 'ft³', 3),
        ],
        breakdown: [
          ['Slab volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} = ${fmt(vol, 3)} m³`],
          ['With allowance', `${fmt(v.waste, 1)}% → ${fmt(volW, 3)} m³ (${fmt(volW / FT3, 2)} ft³)`],
          ['Bags', `${fmt(volW / FT3, 2)} ft³ ÷ ${fmt(yieldM3 / FT3, 3)} ft³ per bag = ${fmt(volW / yieldM3, 1)} → ${bags}`],
        ],
        notes: ['The bag yield is the value you selected, not a universal constant. Always check your product’s label.', 'For slabs larger than about 2 m³ (2.5 yd³), ready-mix is usually more practical than bags.'],
      };
    },
    formula: ['Slab volume = length × width × thickness', 'Bags = volume × (1 + allowance ÷ 100) ÷ yield per bag, rounded up'],
    about: 'This slab calculator finds the concrete volume for a patio, shed base or garage pad and converts it to a number of premixed bags using the yield you select. Because bag yield differs between brands, the yield is shown and editable instead of hidden.',
    faqs: [
      ['How many 80 lb bags make a 4 inch slab?', 'One 80 lb bag yields about 0.6 ft³, which covers roughly 1.8 ft² at 4 in thick. Enter your slab size to get an exact count.'],
      ['Should I use bags or ready-mix?', 'Bags suit small jobs. Mixing many bags by hand is hard work, so most people switch to ready-mix beyond a couple of cubic metres.'],
      ['Does slab thickness matter?', 'Yes. Doubling the thickness doubles the volume. Typical residential slabs are 100 mm (4 in) but loads, soil and local codes decide the real thickness.'],
    ],
  },
  {
    slug: 'cement-calculator', name: 'Cement Calculator', cat: 'concrete-cement', pop: 90, added: '2026-09-09',
    short: 'Estimate cement, sand and aggregate quantities from concrete volume and a mix ratio.',
    seoTitle: 'Cement Calculator – Cement, Sand & Aggregate',
    keywords: ['cement', 'sand', 'aggregate', 'mix ratio', 'M20', 'cement bags', 'concrete mix'],
    fields: [
      num('vol', 'Concrete volume', { dim: 'vol', ex: ['2', '70'], hint: 'Finished (wet) volume of concrete. Use the Concrete Calculator to find it.' }),
      sel('ratio', 'Mix ratio (cement : sand : aggregate)', RATIOS, { ex: '1:2:4', hint: 'Choose the nominal mix specified for your job.' }),
      num('sandP', 'Sand parts', { ex: '2', max: 100, showIf: (r) => r.ratio === 'custom' }),
      num('aggP', 'Aggregate parts', { ex: '4', max: 100, showIf: (r) => r.ratio === 'custom' }),
      sel('bag', 'Cement bag weight', CEMENT_BAGS, { ex: '50' }),
      num('dry', 'Dry volume factor', { optional: true, def0: 1.54, max: 3, ex: '1.54', hint: 'Dry materials occupy more volume than the wet concrete they make. 1.54 is a common assumption.' }),
      num('dens', 'Cement bulk density', { dim: 'dens', optional: true, def0: 1440, ex: ['1440', '90'], hint: 'About 1,440 kg/m³ (90 lb/ft³) for loose Portland cement.' }),
    ],
    compute(v, c) {
      const [ce, sa, ag] = v.ratio === 'custom' ? [1, v.sandP, v.aggP] : v.ratio.split(':').map(Number);
      const sum = ce + sa + ag;
      const dry = v.vol * v.dry;
      const cementVol = (dry * ce) / sum;
      const sandVol = (dry * sa) / sum;
      const aggVol = (dry * ag) / sum;
      const kg = cementVol * v.dens;
      const bagKg = find(CEMENT_BAGS, v.bag).kg;
      const bags = ceilN(kg / bagKg);
      return {
        results: [
          row(`Cement bags (${bagKg} kg)`, bags, 'bags', 0, true),
          row('Cement weight', kg, 'kg', 0),
          row('Sand volume', sandVol, 'm³', 3),
          row('Sand volume', sandVol / FT3, 'ft³', 2),
          row('Aggregate volume', aggVol, 'm³', 3),
          row('Aggregate volume', aggVol / FT3, 'ft³', 2),
        ],
        breakdown: [
          ['Mix parts', `${ce} : ${sa} : ${ag} (total ${fmt(sum, 2)} parts)`],
          ['Dry volume', `${fmt(v.vol, 3)} m³ × ${fmt(v.dry, 2)} = ${fmt(dry, 3)} m³`],
          ['Cement volume', `${fmt(dry, 3)} × ${ce} ÷ ${fmt(sum, 2)} = ${fmt(cementVol, 3)} m³`],
          ['Cement weight', `${fmt(cementVol, 3)} m³ × ${fmt(v.dens, 0)} kg/m³ = ${fmt(kg, 0)} kg`],
          ['Bags', `${fmt(kg, 0)} ÷ ${bagKg} kg = ${fmt(kg / bagKg, 2)} → ${bags}`],
        ],
        notes: ['Nominal volume-batch mixes are for planning. Structural work should follow a design mix specified by an engineer.', 'Moist sand bulks up, so measured sand volume may need adjusting on site.'],
      };
    },
    formula: ['Dry volume = wet concrete volume × dry volume factor', 'Material volume = dry volume × (part ÷ total parts)', 'Cement weight = cement volume × bulk density; bags = weight ÷ bag weight, rounded up'],
    about: 'The cement calculator splits a wet concrete volume into cement, sand and aggregate using your chosen mix ratio. The dry volume factor and cement density are shown and editable, so you can match your local practice instead of relying on a hidden constant.',
    faqs: [
      ['Why multiply by 1.54?', 'Dry ingredients contain air and voids that disappear when water is added, so the dry volume needed is roughly 1.5 times the finished concrete volume.'],
      ['Which mix ratio should I choose?', 'Use the ratio on your plans. As a general guide, 1:2:4 suits ordinary slabs and floors, while richer mixes suit structural elements.'],
      ['Can I use this with bags of different sizes?', 'Yes. Pick the bag weight you buy and the calculator converts cement weight to whole bags.'],
    ],
  },
  {
    slug: 'gravel-calculator', name: 'Gravel Calculator', cat: 'gravel-landscaping', pop: 93, added: '2026-09-10',
    short: 'Gravel volume and estimated weight from area, depth and material density.',
    seoTitle: 'Gravel Calculator – Volume & Tons of Gravel',
    keywords: ['gravel', 'crushed stone', 'tons of gravel', 'path', 'landscaping stone', 'weight'],
    fields: [L('len', 'Area length', ['10', '33']), L('wid', 'Area width', ['4', '13']), depthField(['5', '2'], 'Typical path and garden bed depth is 5 cm (2 in).'), ...densityFields(num, sel), waste('0', 'Optional allowance for settling and uneven ground.')],
    compute(v, c) {
      const vol = v.len * v.wid * v.depth * (1 + v.waste / 100);
      const d = densityKg(v);
      return {
        results: [...massRows(vol * d, c, 'Estimated weight'), ...volRows(vol, c, 'Volume', false)],
        breakdown: [
          ['Volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} × (1 + ${fmt(v.waste, 1)}%) = ${fmt(vol, 3)} m³`],
          ['Density used', `${fmt(d, 0)} kg/m³`],
          ['Weight', `${fmt(vol, 3)} m³ × ${fmt(d, 0)} = ${fmt(vol * d, 0)} kg`],
        ],
        notes: ['Densities are typical bulk values. Ask your supplier for the figure they sell by.', '“Tons” means US short tons (2,000 lb) and “tonnes” means metric tonnes (1,000 kg).'],
      };
    },
    formula: ['Volume = length × width × depth', 'Weight = volume × bulk density', 'Short tons = kilograms ÷ 907.18; tonnes = kilograms ÷ 1,000'],
    about: 'The gravel calculator estimates both the volume and the weight of gravel for paths, beds, drainage and bases. Pick a typical material density or enter your supplier’s figure, then compare the result in tonnes, short tons, kilograms and pounds.',
    faqs: [
      ['How many tons of gravel are in a cubic yard?', 'Around 1.4 US tons per cubic yard for typical gravel, but it varies with stone type and moisture. The calculator uses your selected density.'],
      ['How deep should a gravel path be?', 'Garden paths usually use 5–7.5 cm (2–3 in). Driveways need more, laid in compacted layers.'],
      ['Do I need to add extra for compaction?', 'Gravel for bases compacts by roughly 10–20%. Use the Gravel Driveway Calculator, which has a compaction field.'],
    ],
  },
  {
    slug: 'pea-gravel-calculator', name: 'Pea Gravel Calculator', cat: 'gravel-landscaping', pop: 66, added: '2026-09-11',
    short: 'Required pea gravel volume and weight for patios, paths and play areas.',
    seoTitle: 'Pea Gravel Calculator – Volume & Weight',
    keywords: ['pea gravel', 'pea stone', 'patio', 'playground', 'dog run', 'pea shingle'],
    fields: [
      num('area', 'Coverage area', { dim: 'area', ex: ['20', '215'], hint: 'Total surface to cover. Multiply length by width for rectangles.' }),
      depthField(['5', '2'], 'Pea gravel is usually laid 5 cm (2 in) deep.'),
      num('dens', 'Pea gravel density', { dim: 'dens', optional: true, def0: 1700, ex: ['1700', '106'], hint: 'Defaults to 1,700 kg/m³ (106 lb/ft³) when blank. Replace it with your supplier’s figure if you have one.' }),
      waste('0'),
    ],
    compute(v, c) {
      const vol = v.area * v.depth * (1 + v.waste / 100);
      return {
        results: [...volRows(vol, c, 'Pea gravel volume'), ...massRows(vol * v.dens, c, 'Estimated weight', false)],
        breakdown: [
          ['Volume', `${Ar(v.area, c)} × ${Lg(v.depth, c)} × (1 + ${fmt(v.waste, 1)}%) = ${fmt(vol, 3)} m³`],
          ['Weight', `${fmt(vol, 3)} m³ × ${fmt(v.dens, 0)} kg/m³ = ${fmt(vol * v.dens, 0)} kg`],
        ],
        notes: ['Pea gravel is a rounded 3–10 mm stone. It shifts underfoot, so edging is recommended.', 'Planning estimate; suppliers may measure by loose or compacted volume.'],
      };
    },
    formula: ['Volume = area × depth', 'Weight = volume × density'],
    about: 'Pea gravel is a small, rounded stone that is popular for patios, dog runs and play areas. This calculator turns your surface area and depth into volume and weight using an editable density, so the figure lines up with how your supplier sells it.',
    faqs: [
      ['How deep should pea gravel be?', 'Use about 5 cm (2 in) for walkways and patios, and slightly deeper for play areas.'],
      ['Is pea gravel sold by weight or volume?', 'Both are common. This tool shows both so you can match the quote you receive.'],
      ['Should I lay a base first?', 'Compacted crushed stone or sub-base plus a weed barrier gives a more stable pea gravel surface.'],
    ],
  },
  {
    slug: 'gravel-driveway-calculator', name: 'Gravel Driveway Calculator', cat: 'gravel-landscaping', pop: 80, added: '2026-09-12',
    short: 'Material volume and weight for a gravel driveway built in one or more layers.',
    seoTitle: 'Gravel Driveway Calculator – Layers, Volume & Tons',
    keywords: ['driveway', 'gravel driveway', 'base layers', 'compaction', 'crushed stone driveway'],
    fields: [
      L('len', 'Driveway length', ['12', '40']), L('wid', 'Driveway width', ['3', '10']),
      num('depth', 'Depth per layer', { dim: 'dep', ex: ['10', '4'], hint: 'Compacted thickness of each layer. 10 cm (4 in) is common.' }),
      num('layers', 'Number of layers', { int: true, max: 10, ex: '2', hint: 'Driveways often use a coarse base and a finer top layer.' }),
      ...densityFields(num, sel),
      num('comp', 'Compaction allowance', { unit: '%', zero: true, optional: true, max: 50, ex: '15', hint: 'Extra loose material so layers still measure correctly after compaction. 10–20% is typical.' }),
    ],
    compute(v, c) {
      const layer = v.len * v.wid * v.depth;
      const vol = layer * v.layers * (1 + v.comp / 100);
      const d = densityKg(v);
      return {
        results: [...massRows(vol * d, c, 'Total material weight'), ...volRows(vol, c, 'Total volume', false), row('Volume per layer (compacted)', layer, 'm³', 3), row('Driveway area', v.len * v.wid * (c.sys === 'imperial' ? 1 / 0.09290304 : 1), c.sys === 'imperial' ? 'ft²' : 'm²', 1)],
        breakdown: [
          ['Layer volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} = ${fmt(layer, 3)} m³`],
          ['All layers', `${fmt(layer, 3)} × ${v.layers} layers = ${fmt(layer * v.layers, 3)} m³`],
          ['Compaction allowance', `${fmt(v.comp, 1)}% → ${fmt(vol, 3)} m³ loose`],
          ['Weight', `${fmt(vol, 3)} m³ × ${fmt(d, 0)} kg/m³ = ${fmt(vol * d, 0)} kg`],
        ],
        notes: ['Each layer may use a different stone size and density. Run the calculation once per material for an exact order.', 'Ground conditions and drainage affect the required depth; follow local guidance for load-bearing drives.'],
      };
    },
    formula: ['Layer volume = length × width × depth per layer', 'Total volume = layer volume × number of layers × (1 + compaction ÷ 100)', 'Weight = total volume × density'],
    about: 'A gravel driveway is usually built in compacted layers rather than one thick pour. This calculator multiplies layer depth by the number of layers, adds a compaction allowance and converts the loose volume to weight, giving you a realistic order quantity.',
    faqs: [
      ['How thick should a gravel driveway be?', 'Many drives use 15–30 cm (6–12 in) in total, split into a base and a top layer, depending on soil and traffic. Check local guidance.'],
      ['What is the compaction allowance?', 'Loose gravel compresses once rolled. The allowance orders extra so the finished layers hit their target depth.'],
      ['Can I use different stone for each layer?', 'Yes, but run the calculator separately for each material and density.'],
    ],
  },
  {
    slug: 'topsoil-calculator', name: 'Topsoil Calculator', cat: 'soil-gardening', pop: 91, added: '2026-09-13',
    short: 'Topsoil volume in cubic yards, cubic feet and cubic metres for lawns and garden beds.',
    seoTitle: 'Topsoil Calculator – Cubic Yards & Metres Needed',
    keywords: ['topsoil', 'dirt', 'cubic yards', 'lawn', 'raised bed', 'soil depth'],
    fields: [L('len', 'Garden length', ['5', '16']), L('wid', 'Garden width', ['3', '10']), depthField(['15', '6'], 'Desired soil depth. Lawns usually need 10–15 cm (4–6 in).'), waste('0', 'Optional extra for settling.')],
    compute(v, c) {
      const vol = v.len * v.wid * v.depth * (1 + v.waste / 100);
      return {
        results: volRows(vol, c, 'Topsoil'),
        breakdown: [
          ['Volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} = ${fmt(v.len * v.wid * v.depth, 3)} m³`],
          ['With allowance', `${fmt(v.waste, 1)}% → ${fmt(vol, 3)} m³`],
          ['Conversions', `${fmt(vol / FT3, 2)} ft³ = ${fmt(vol / YD3, 3)} yd³`],
        ],
        notes: ['Bulk topsoil is typically sold by the cubic yard or cubic metre. Moisture and compaction change the volume you receive.'],
      };
    },
    formula: ['Volume = length × width × depth', 'Cubic yards = cubic feet ÷ 27', 'Cubic metres × 1.30795 = cubic yards'],
    about: 'The topsoil calculator gives the volume of soil needed to cover a garden, lawn or raised bed to a chosen depth, with results in cubic yards, cubic feet and cubic metres so it matches any supplier’s unit.',
    faqs: [
      ['How deep should topsoil be for a lawn?', 'A 10–15 cm (4–6 in) layer is common for new lawns; patching low spots may need less.'],
      ['How many square feet does a cubic yard cover?', 'At 3 in deep, one cubic yard covers about 108 ft². At 6 in it covers about 54 ft².'],
      ['Should I order extra?', 'A small allowance helps because soil settles after watering.'],
    ],
  },
  {
    slug: 'garden-soil-calculator', name: 'Garden Soil Calculator', cat: 'soil-gardening', pop: 72, added: '2026-09-14',
    short: 'Total soil volume and the number of bags needed for beds, borders and planters.',
    seoTitle: 'Garden Soil Calculator – How Many Bags of Soil?',
    keywords: ['garden soil', 'bags of soil', 'raised bed', 'potting', 'planter', 'compost'],
    fields: [L('len', 'Bed length', ['4', '13']), L('wid', 'Bed width', ['2', '6.5']), depthField(['30', '12'], 'Depth to fill. Raised beds are commonly 20–30 cm (8–12 in) deep.'), sel('bag', 'Bag size', SOIL_BAGS, { ex: ['l40', 'ft1'], hint: 'Volume printed on the bag.' }), waste('5')],
    compute(v, c) {
      const vol = v.len * v.wid * v.depth;
      const volW = vol * (1 + v.waste / 100);
      const bag = find(SOIL_BAGS, v.bag);
      const bags = ceilN(volW / bag.m3);
      return {
        results: [row('Bags needed', bags, 'bags', 0, true), ...volRows(volW, c, 'Total soil', false), row('Bag size used', bag.m3 * 1000, 'litres', 1)],
        breakdown: [
          ['Bed volume', `${Lg(v.len, c)} × ${Lg(v.wid, c)} × ${Lg(v.depth, c)} = ${fmt(vol, 3)} m³`],
          ['With allowance', `${fmt(v.waste, 1)}% → ${fmt(volW, 3)} m³`],
          ['Bags', `${fmt(volW * 1000, 1)} L ÷ ${fmt(bag.m3 * 1000, 1)} L = ${fmt(volW / bag.m3, 2)} → ${bags}`],
        ],
        notes: ['If you are mixing soil with compost, calculate each component as a percentage of the total volume.'],
      };
    },
    formula: ['Soil volume = length × width × depth', 'Bags = volume × (1 + allowance ÷ 100) ÷ bag volume, rounded up'],
    about: 'The garden soil calculator is designed for raised beds, borders and planters where soil is bought in bags. Enter bed size, depth and bag size, and it returns the total volume and a whole-bag order quantity.',
    faqs: [
      ['How much soil do I need for a raised bed?', 'Multiply length, width and depth. A 4 × 2 m bed filled to 30 cm needs 2.4 m³, or 60 bags of 40 L.'],
      ['Do bags state litres or cubic feet?', 'Both are used. The bag size selector includes common metric and imperial sizes.'],
      ['Should I add compost?', 'A blend of soil and compost is common. Calculate the total volume here, then split it by your blend percentages.'],
    ],
  },
];
