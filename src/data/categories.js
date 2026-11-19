export const CATEGORIES = [
  {
    slug: 'masonry-bricks', name: 'Masonry & Bricks', icon: 'Layers',
    short: 'Estimate bricks, mortar and brickwork costs for walls.',
    title: 'Masonry & Brick Calculators – Bricks, Walls & Cost',
    description: 'Free brick calculators: work out how many bricks a wall needs, mortar volume, wall volume and total brick cost with wastage and delivery.',
    blurb: 'Brickwork quantities depend on brick size, mortar joint thickness, wall openings and how much you allow for breakage. These calculators turn wall dimensions into brick counts, mortar volume and a cost estimate so you can order with confidence.',
  },
  {
    slug: 'flooring-tiles', name: 'Flooring & Tiles', icon: 'LayoutGrid',
    short: 'Tiles, tile boxes and flooring planks for any room.',
    title: 'Flooring & Tile Calculators – Tiles, Boxes & Planks',
    description: 'Free tile and flooring calculators: find out how many tiles, tile boxes or floor planks you need, including a wastage allowance for cuts.',
    blurb: 'Buying floor covering is mostly about area, piece size and the extra you need for cuts. Use these tools to convert room dimensions into tiles, boxes or planks, with the leftover quantity shown so you can plan spares.',
  },
  {
    slug: 'concrete-cement', name: 'Concrete & Cement', icon: 'Box',
    short: 'Concrete volume, slab bags and cement mix quantities.',
    title: 'Concrete & Cement Calculators – Volume, Slabs & Mix',
    description: 'Free concrete calculators: concrete volume in m³, ft³ and yd³, slab bag counts and cement, sand and aggregate quantities for common mix ratios.',
    blurb: 'Concrete is sold by volume, but slabs are measured in length, width and thickness. These calculators convert dimensions to cubic metres, cubic yards and bags, and break a mix ratio into cement, sand and aggregate.',
  },
  {
    slug: 'gravel-landscaping', name: 'Gravel & Landscaping', icon: 'Mountain',
    short: 'Gravel volume and weight for paths, beds and driveways.',
    title: 'Gravel & Landscaping Calculators – Volume & Weight',
    description: 'Free gravel calculators: volume and weight for gravel, pea gravel and multi-layer driveways using editable material densities.',
    blurb: 'Suppliers quote gravel by the tonne or by the cubic yard, so you need both volume and weight. These tools use editable bulk densities so you can match your supplier’s figures.',
  },
  {
    slug: 'soil-gardening', name: 'Soil & Gardening', icon: 'Sprout',
    short: 'Topsoil and garden soil volumes, plus bag counts.',
    title: 'Soil & Gardening Calculators – Topsoil & Garden Soil',
    description: 'Free soil calculators: topsoil volume in cubic yards, feet and metres, and how many bags of garden soil you need for beds and borders.',
    blurb: 'Whether you are filling raised beds or levelling a lawn, soil is ordered by volume or by the bag. Enter bed size and depth to get the quantity in the unit your supplier uses.',
  },
  {
    slug: 'roofing', name: 'Roofing', icon: 'Home',
    short: 'Roof pitch, slope and surface area with material counts.',
    title: 'Roofing Calculators – Roof Pitch & Roof Area',
    description: 'Free roofing calculators: convert rise and run to roof pitch, angle and slope percentage, and estimate roof surface area and roofing material.',
    blurb: 'Roof area is larger than the floor area beneath it because of pitch and overhang. These calculators show pitch in several formats and estimate the surface you need to cover.',
  },
  {
    slug: 'decking-fencing', name: 'Decking & Fencing', icon: 'Ruler',
    short: 'Deck boards, fence posts and fence sections.',
    title: 'Decking & Fencing Calculators – Boards, Posts & Panels',
    description: 'Free deck and fence calculators: estimate decking boards from board width and gap, and fence posts and sections from run length and spacing.',
    blurb: 'Decks and fences are repeating patterns, which makes them ideal to calculate. Enter spacing and sizes to get board, post and section counts before you visit the timber yard.',
  },
  {
    slug: 'painting-home-improvement', name: 'Painting & Home Improvement', icon: 'PaintBucket',
    short: 'Paint quantity and overall construction budgets.',
    title: 'Painting & Home Improvement Calculators – Paint & Project Cost',
    description: 'Free calculators for paint quantity by coats and coverage, plus a construction cost estimator with labour, extras and contingency.',
    blurb: 'Paint and budgeting both come down to good assumptions. These tools show your coverage assumptions openly and let you change them, so the estimate matches your project.',
  },
];
export const CAT_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));
