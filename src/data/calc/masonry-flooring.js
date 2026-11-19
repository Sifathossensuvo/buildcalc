import { FT2 } from '../../lib/units.js';
import { fmt, ceilN, row, cashRow, volRows, Lg, Sm, Ar, areaNum, areaUnit } from '../../lib/format.js';
import { num, waste } from './helpers.js';

export const MASONRY_FLOORING = [
  {
    slug: 'brick-calculator', name: 'Brick Calculator', cat: 'masonry-bricks', pop: 98, added: '2026-09-01',
    short: 'Work out how many bricks you need for a wall, with openings, mortar joints and wastage.',
    seoTitle: 'Brick Calculator – How Many Bricks Do I Need?',
    keywords: ['bricks', 'brickwork', 'wall', 'mortar', 'how many bricks', 'masonry'],
    fields: [
      num('wallL', 'Wall length', { dim: 'len', ex: ['5', '16'], hint: 'Total length of the wall measured along its face.' }),
      num('wallH', 'Wall height', { dim: 'len', ex: ['2.4', '8'], hint: 'Height from the damp-proof course or floor to the top of the wall.' }),
      num('brickL', 'Brick length', { dim: 'sm', ex: ['215', '8'], hint: 'Face length of one brick. A common modular brick is 215 mm (about 8 in).' }),
      num('brickH', 'Brick width (face height)', { dim: 'sm', ex: ['65', '2.25'], hint: 'The visible height of the brick face – sometimes listed as brick “width” or “height”.' }),
      num('brickD', 'Brick thickness (depth)', { dim: 'sm', ex: ['102.5', '3.625'], hint: 'Depth of the brick through the wall. 102.5 mm suits a single-skin wall.' }),
      num('joint', 'Mortar joint thickness', { dim: 'sm', ex: ['10', '0.375'], hint: 'Typically 10 mm (3/8 in) for both bed and head joints.' }),
      num('openings', 'Number of openings (doors/windows)', { int: true, zero: true, optional: true, ex: '1', hint: 'Doors and windows to deduct from the wall area.' }),
      num('openArea', 'Average area of one opening', { dim: 'area', ex: ['1.8', '20'], showIf: (r) => Number(r.openings) > 0, hint: 'Width × height of a typical opening. A standard door is about 1.8 m² (20 ft²).' }),
      waste('5'),
    ],
    compute(v, c) {
      const gross = v.wallL * v.wallH;
      const open = (v.openings || 0) * (v.openArea || 0);
      const net = gross - open;
      if (net <= 0) return { error: 'The openings are larger than the wall. Reduce the number or size of openings.' };
      const mod = (v.brickL + v.joint) * (v.brickH + v.joint);
      const base = net / mod;
      const adj = ceilN(base * (1 + v.waste / 100));
      const wallVol = net * v.brickD;
      const brickVol = base * v.brickL * v.brickH * v.brickD;
      const mortar = Math.max(0, wallVol - brickVol);
      return {
        results: [
          row('Bricks required (incl. wastage)', adj, 'bricks', 0, true),
          row('Bricks before wastage', ceilN(base), 'bricks', 0),
          row('Net wall area', areaNum(net, c), areaUnit(c), 2),
          row('Estimated mortar volume', mortar, 'm³', 3),
          row('Estimated mortar volume', mortar / 0.028316846592, 'ft³', 2),
          row('Courses of brick', ceilN(v.wallH / (v.brickH + v.joint)), 'courses', 0),
        ],
        breakdown: [
          ['Gross wall area', `${Lg(v.wallL, c)} × ${Lg(v.wallH, c)} = ${Ar(gross, c)}`],
          ['Openings deducted', `${v.openings || 0} × ${Ar(v.openArea || 0, c)} = ${Ar(open, c)}`],
          ['Net wall area', Ar(net, c)],
          ['Brick plus joint (face)', `(${Sm(v.brickL, c)} + ${Sm(v.joint, c)}) × (${Sm(v.brickH, c)} + ${Sm(v.joint, c)})`],
          ['Bricks per m²', `${fmt(1 / mod, 1)} bricks`],
          ['Wastage allowance', `${fmt(v.waste, 1)}% → ${fmt(adj - ceilN(base), 0)} extra bricks`],
        ],
        notes: ['Mortar volume = wall volume − volume of the bricks. Add 10–20% for mortar waste and wet-to-dry mixing.', 'Assumes a single-skin wall where wall thickness equals the brick depth.'],
      };
    },
    formula: ['Net wall area = (wall length × wall height) − (openings × area of one opening)', 'Bricks = net wall area ÷ ((brick length + joint) × (brick height + joint))', 'Bricks to order = bricks × (1 + wastage ÷ 100), rounded up', 'Mortar volume = net wall area × brick depth − bricks × (brick length × height × depth)'],
    about: 'This brick calculator estimates how many bricks a single-skin wall needs by dividing the net wall area by the face area of one brick plus its mortar joints. Doors and windows are deducted first, and a wastage allowance covers cuts and breakage. It also estimates mortar volume so you can order sand and cement at the same time.',
    faqs: [
      ['How many bricks are in one square metre of wall?', 'With a standard 215 × 65 mm brick and 10 mm joints, a single-skin wall needs about 59 bricks per square metre (roughly 5.5 per square foot).'],
      ['How much wastage should I allow for bricks?', '5% is common for simple walls. Use 10% for walls with many cuts, corners or curves, or when bricks may arrive chipped.'],
      ['Does this work for double-skin or cavity walls?', 'Run the calculation once for each skin, or use the Brick Wall Calculator, which works from the full wall thickness.'],
    ],
  },
  {
    slug: 'brick-wall-calculator', name: 'Brick Wall Calculator', cat: 'masonry-bricks', pop: 74, added: '2026-09-02',
    short: 'Calculate bricks and total wall volume from wall length, height and thickness.',
    seoTitle: 'Brick Wall Calculator – Bricks & Wall Volume',
    keywords: ['brick wall', 'wall volume', 'wall thickness', 'double skin', 'bricks per wall'],
    fields: [
      num('wallL', 'Wall length', { dim: 'len', ex: ['5', '16'] }),
      num('wallH', 'Wall height', { dim: 'len', ex: ['2.4', '8'] }),
      num('wallT', 'Wall thickness', { dim: 'dep', ex: ['22.5', '9'], hint: 'Full thickness of the wall. 22.5 cm (9 in) is a typical one-brick-thick wall.' }),
      num('brickL', 'Brick length', { dim: 'sm', ex: ['215', '8'] }),
      num('brickH', 'Brick height', { dim: 'sm', ex: ['65', '2.25'] }),
      num('brickD', 'Brick depth', { dim: 'sm', ex: ['102.5', '3.625'] }),
      num('joint', 'Mortar thickness', { dim: 'sm', ex: ['10', '0.375'] }),
      waste('5'),
    ],
    compute(v, c) {
      const vol = v.wallL * v.wallH * v.wallT;
      const unit = (v.brickL + v.joint) * (v.brickH + v.joint) * (v.brickD + v.joint);
      const base = vol / unit;
      const adj = ceilN(base * (1 + v.waste / 100));
      const notes = ['Quantity is based on volume, so wall thickness should be close to a whole number of brick depths plus joints.'];
      if (v.wallT < v.brickD) notes.push('The wall is thinner than one brick depth – check the thickness you entered.');
      return {
        results: [
          row('Bricks required (incl. wastage)', adj, 'bricks', 0, true),
          row('Bricks before wastage', ceilN(base), 'bricks', 0),
          ...volRows(vol, c, 'Wall volume', false),
          row('Wall face area', areaNum(v.wallL * v.wallH, c), areaUnit(c), 2),
        ],
        breakdown: [
          ['Wall volume', `${Lg(v.wallL, c)} × ${Lg(v.wallH, c)} × ${Lg(v.wallT, c)} = ${fmt(vol, 3)} m³`],
          ['Volume of one brick with joints', `${fmt(unit * 1e6, 0)} cm³`],
          ['Bricks', `${fmt(vol, 3)} m³ ÷ ${fmt(unit, 6)} m³ = ${fmt(base, 1)}`],
          ['With wastage', `${fmt(v.waste, 1)}% → ${adj} bricks`],
        ],
        notes,
      };
    },
    formula: ['Wall volume = length × height × thickness', 'Volume per brick = (brick length + joint) × (brick height + joint) × (brick depth + joint)', 'Bricks = wall volume ÷ volume per brick, then add wastage'],
    about: 'Use the brick wall calculator when you know the finished thickness of a wall, such as a one-brick or cavity-width wall. It works from volume instead of face area, so thicker walls are handled in a single step, and it also reports total wall volume for planning footings and loads.',
    faqs: [
      ['What is the difference between this and the Brick Calculator?', 'The Brick Calculator works from face area for a single skin and deducts openings. This tool works from total wall volume, which suits thicker solid walls.'],
      ['Which wall thickness should I enter?', 'Enter the finished thickness, for example 10.25 cm for a half-brick wall or 22.5 cm for a full-brick wall.'],
      ['Does it include mortar?', 'Yes. Each brick is treated as brick plus a mortar joint on every side, so the count already reflects joint thickness.'],
    ],
  },
  {
    slug: 'brick-cost-calculator', name: 'Brick Cost Calculator', cat: 'masonry-bricks', pop: 62, added: '2026-09-03', noUnits: true, cost: true,
    short: 'Estimate the total cost of bricks including wastage, delivery and cost per brick.',
    seoTitle: 'Brick Cost Calculator – Estimate Brick Budget',
    keywords: ['brick price', 'cost', 'budget', 'delivery', 'brick cost'],
    fields: [
      num('bricks', 'Required bricks', { int: true, max: 5000000, ex: '1500', hint: 'Use the result from the Brick Calculator, before wastage.' }),
      num('price', 'Price per brick', { unit: 'cur', ex: '12', hint: 'Unit price from your supplier. Pick your currency above.' }),
      num('delivery', 'Delivery cost', { unit: 'cur', zero: true, optional: true, ex: '1500', hint: 'Total delivery or transport charge. Leave blank if collecting.' }),
      waste('5'),
    ],
    compute(v, c) {
      const adj = ceilN(v.bricks * (1 + v.waste / 100));
      const brickCost = adj * v.price;
      const total = brickCost + v.delivery;
      return {
        results: [
          cashRow('Estimated total cost', total, c, true),
          row('Bricks to order (incl. wastage)', adj, 'bricks', 0),
          cashRow('Cost of bricks', brickCost, c),
          cashRow('Delivery', v.delivery, c),
          cashRow('Effective cost per brick', total / adj, c),
        ],
        breakdown: [
          ['Bricks with wastage', `${v.bricks} × (1 + ${fmt(v.waste, 1)}%) = ${adj}`],
          ['Brick cost', `${adj} × ${c.cur}${fmt(v.price, 2)} = ${c.cur}${fmt(brickCost, 2)}`],
          ['Delivery', `${c.cur}${fmt(v.delivery, 2)}`],
          ['Total', `${c.cur}${fmt(total, 2)}`],
        ],
        notes: ['Prices exclude mortar, labour, taxes and any pallet deposits unless you add them to delivery.'],
      };
    },
    formula: ['Bricks to order = required bricks × (1 + wastage ÷ 100), rounded up', 'Brick cost = bricks to order × price per brick', 'Total = brick cost + delivery'],
    about: 'The brick cost calculator turns a brick count into a budget. It adds wastage, multiplies by your unit price, adds delivery and shows the effective price per brick once delivery is spread across the order, which makes quotes from different suppliers easier to compare.',
    faqs: [
      ['Should I enter bricks before or after wastage?', 'Enter the net number of bricks. The calculator adds wastage itself so you can see both figures.'],
      ['Does the cost include mortar and labour?', 'No. Add mortar materials and labour in the Construction Cost Calculator.'],
      ['What is the effective cost per brick?', 'It is the total including delivery divided by the number of bricks you buy, which is a fairer way to compare suppliers.'],
    ],
  },
  {
    slug: 'tile-calculator', name: 'Tile Calculator', cat: 'flooring-tiles', pop: 96, added: '2026-09-04',
    short: 'Find the number of tiles for a room from room size, tile size and wastage.',
    seoTitle: 'Tile Calculator – How Many Tiles Do I Need?',
    keywords: ['tiles', 'floor tiles', 'wall tiles', 'how many tiles', 'tile quantity'],
    fields: [
      num('roomL', 'Room length', { dim: 'len', ex: ['4', '13'] }),
      num('roomW', 'Room width', { dim: 'len', ex: ['3', '10'] }),
      num('tileL', 'Tile length', { dim: 'dep', ex: ['60', '24'], hint: 'Tile length. 60 cm tiles are 600 mm; 24 in is a common US size.' }),
      num('tileW', 'Tile width', { dim: 'dep', ex: ['60', '24'] }),
      waste('10', 'Allow about 10% for straight layouts, 15% for diagonal and 20% or more for herringbone or small rooms.'),
    ],
    compute(v, c) {
      const area = v.roomL * v.roomW;
      const ta = v.tileL * v.tileW;
      const base = ceilN(area / ta);
      const total = ceilN((area * (1 + v.waste / 100)) / ta);
      const grid = ceilN(v.roomL / v.tileL) * ceilN(v.roomW / v.tileW);
      return {
        results: [
          row('Total tiles to buy', total, 'tiles', 0, true),
          row('Coverage area of tiles bought', areaNum(total * ta, c), areaUnit(c), 2),
          row('Extra tiles (wastage)', total - base, 'tiles', 0),
          row('Room area', areaNum(area, c), areaUnit(c), 2),
          row('Tiles without wastage', base, 'tiles', 0),
        ],
        breakdown: [
          ['Room area', `${Lg(v.roomL, c)} × ${Lg(v.roomW, c)} = ${Ar(area, c)}`],
          ['Area of one tile', Ar(ta, c)],
          ['Tiles without wastage', `${fmt(area / ta, 2)} → ${base}`],
          ['Tiles with wastage', `${fmt(v.waste, 1)}% → ${total}`],
          ['Full-grid layout check', `${ceilN(v.roomL / v.tileL)} × ${ceilN(v.roomW / v.tileW)} = ${grid} tiles if every edge tile is cut from a new tile`],
        ],
        notes: ['Grout joints are ignored. For wide joints, add the joint width to both tile dimensions.', 'The full-grid figure is the safe upper bound when offcuts cannot be reused.'],
      };
    },
    formula: ['Room area = length × width', 'Tiles = room area ÷ (tile length × tile width)', 'Tiles to buy = tiles × (1 + wastage ÷ 100), rounded up'],
    about: 'The tile calculator divides the room area by the area of a single tile and adds a wastage allowance, then rounds up to whole tiles. It also shows how many extra tiles you will have, and a full-grid check for layouts where every edge tile must be cut.',
    faqs: [
      ['How much extra tile should I buy?', 'About 10% for straight lay, 15% for diagonal patterns and up to 20% for herringbone, large-format tiles or very small rooms. Keep a few spares for future repairs.'],
      ['Should I include grout joints?', 'For narrow joints the effect is small. For wide joints, add the joint width to the tile length and width before you calculate.'],
      ['Does it work for walls?', 'Yes. Enter the wall length and height as the room length and width, and deduct windows by entering smaller sections.'],
    ],
  },
  {
    slug: 'tile-box-calculator', name: 'Tile Box Calculator', cat: 'flooring-tiles', pop: 70, added: '2026-09-05',
    short: 'Convert room area and coverage per box into the number of boxes to buy.',
    seoTitle: 'Tile Box Calculator – How Many Boxes of Tile?',
    keywords: ['boxes of tile', 'tile boxes', 'coverage per box', 'tile packs', 'carton'],
    fields: [
      num('area', 'Room area', { dim: 'area', ex: ['24', '260'], hint: 'Area to be tiled. Use the Tile Calculator if you only know the room dimensions.' }),
      num('cover', 'Coverage per box', { dim: 'area', ex: ['1.44', '15.5'], hint: 'Printed on the box or product page, for example 1.44 m² or 15.5 ft².' }),
      waste('10'),
    ],
    compute(v, c) {
      const need = v.area * (1 + v.waste / 100);
      const boxes = ceilN(need / v.cover);
      const bought = boxes * v.cover;
      return {
        results: [
          row('Boxes needed', boxes, 'boxes', 0, true),
          row('Total coverage purchased', areaNum(bought, c), areaUnit(c), 2),
          row('Remaining coverage (after wastage allowance)', areaNum(bought - need, c), areaUnit(c), 2),
          row('Remaining coverage (beyond room area)', areaNum(bought - v.area, c), areaUnit(c), 2),
          row('Area to cover incl. wastage', areaNum(need, c), areaUnit(c), 2),
        ],
        breakdown: [
          ['Area with wastage', `${Ar(v.area, c)} × (1 + ${fmt(v.waste, 1)}%) = ${Ar(need, c)}`],
          ['Boxes', `${Ar(need, c)} ÷ ${Ar(v.cover, c)} = ${fmt(need / v.cover, 2)} → ${boxes}`],
        ],
        notes: ['Tiles are sold in whole boxes, so the calculation always rounds up. Buy all boxes together to avoid shade differences between batches.'],
      };
    },
    formula: ['Area to cover = room area × (1 + wastage ÷ 100)', 'Boxes = area to cover ÷ coverage per box, rounded up', 'Remaining coverage = boxes × coverage per box − area to cover'],
    about: 'Tiles are sold by the box, not by the tile. This tool takes the area you want to cover and the coverage printed on the carton, adds wastage and rounds up to whole boxes. It shows how much coverage is left over so you can decide whether to keep spares.',
    faqs: [
      ['Where do I find coverage per box?', 'It is printed on the packaging and in the product specification, usually in m² or ft² per carton.'],
      ['Why does it round up?', 'You cannot buy part of a box, and running short means risking a different batch shade, so rounding up is safer.'],
      ['What if I do not know the room area?', 'Use the Tile Calculator or multiply the room length by width, then enter the area here.'],
    ],
  },
  {
    slug: 'flooring-calculator', name: 'Flooring Calculator', cat: 'flooring-tiles', pop: 84, added: '2026-09-06',
    short: 'Calculate planks or boards for laminate, vinyl and timber floors, including wastage.',
    seoTitle: 'Flooring Calculator – Planks, Laminate & Vinyl',
    keywords: ['laminate', 'vinyl plank', 'hardwood', 'floor boards', 'flooring', 'planks'],
    fields: [
      num('floorL', 'Floor length', { dim: 'len', ex: ['5', '16'] }),
      num('floorW', 'Floor width', { dim: 'len', ex: ['4', '13'] }),
      num('pieceL', 'Plank length', { dim: 'sm', ex: ['1200', '48'], hint: 'Length of one plank or board.' }),
      num('pieceW', 'Plank width', { dim: 'sm', ex: ['190', '7'], hint: 'Visible width of one plank.' }),
      waste('8', 'Straight lay: 5–8%. Diagonal or patterned layouts: 10–15%.'),
    ],
    compute(v, c) {
      const area = v.floorL * v.floorW;
      const pa = v.pieceL * v.pieceW;
      const need = area * (1 + v.waste / 100);
      const pieces = ceilN(need / pa);
      const mat = pieces * pa;
      return {
        results: [
          row('Planks required', pieces, 'planks', 0, true),
          row('Material area to buy', areaNum(mat, c), areaUnit(c), 2),
          row('Wastage / surplus material', areaNum(mat - area, c), areaUnit(c), 2),
          row('Surplus as share of floor area', ((mat - area) / area) * 100, '%', 1),
          row('Floor area', areaNum(area, c), areaUnit(c), 2),
        ],
        breakdown: [
          ['Floor area', `${Lg(v.floorL, c)} × ${Lg(v.floorW, c)} = ${Ar(area, c)}`],
          ['Area of one plank', `${Sm(v.pieceL, c)} × ${Sm(v.pieceW, c)} = ${fmt(pa * (c.sys === 'imperial' ? 1 / FT2 : 1), 4)} ${areaUnit(c)}`],
          ['Planks', `${Ar(need, c)} ÷ plank area = ${fmt(need / pa, 1)} → ${pieces}`],
        ],
        notes: ['Many laminate and vinyl products are sold in packs. Divide the plank count by planks per pack and round up.', 'Add underlay and trims separately.'],
      };
    },
    formula: ['Floor area = length × width', 'Planks = floor area × (1 + wastage ÷ 100) ÷ area of one plank, rounded up', 'Surplus = planks × plank area − floor area'],
    about: 'The flooring calculator estimates the number of planks or boards for laminate, vinyl, engineered or solid timber floors. It reports the surplus material that results from rounding up and wastage, which helps you judge whether the order is sensible before you buy.',
    faqs: [
      ['How much wastage should I add to flooring?', 'Plan on 5–8% for straight layouts in simple rooms and 10–15% for diagonal layouts, awkward rooms and patterned installs.'],
      ['Can I use this for sheet vinyl or carpet?', 'It is built for plank-style products. For roll goods, measure the roll width and length of each strip you need.'],
      ['Does it include the expansion gap?', 'No. Measure the floor area you will actually cover, inside the expansion gap.'],
    ],
  },
];
