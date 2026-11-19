export const GUIDES = [
  {
    slug: 'how-to-calculate-bricks-for-a-wall', title: 'How to Calculate Bricks for a Wall', read: '4 min', date: '2026-10-05',
    description: 'A step-by-step method for working out how many bricks a wall needs, including mortar joints, openings and wastage.',
    calcs: ['brick-calculator', 'brick-wall-calculator', 'brick-cost-calculator'],
    sections: [
      ['Start with the net wall area', 'Multiply wall length by wall height, then subtract doors and windows. This is the area that actually needs brickwork.'],
      ['Use the brick plus joint size', 'Bricks are laid with mortar on the bed and head joints, so each brick effectively occupies its own size plus the joint. With a 215 × 65 mm brick and 10 mm joints that is 225 × 75 mm, or about 59 bricks per square metre for a single-skin wall.'],
      ['Add wastage', 'Order 5% extra for straightforward walls and up to 10% for walls with many cuts, corners or curves. Broken and chipped bricks are common on site.'],
      ['Do not forget mortar', 'Mortar volume equals wall volume minus brick volume. Order sand and cement at the same time, and allow extra for waste.'],
    ],
  },
  {
    slug: 'how-much-concrete-do-i-need', title: 'How Much Concrete Do I Need?', read: '4 min', date: '2026-10-08',
    description: 'Learn how to convert slab dimensions into cubic metres, cubic yards and bags, and how much extra to order.',
    calcs: ['concrete-calculator', 'concrete-slab-calculator', 'cement-calculator'],
    sections: [
      ['Concrete is ordered by volume', 'Volume is length × width × thickness in the same unit. A 5 m × 4 m slab that is 10 cm thick is 5 × 4 × 0.1 = 2 m³.'],
      ['Convert to your supplier’s unit', 'One cubic yard is 27 cubic feet or about 0.7646 m³. So 2 m³ is roughly 2.6 yd³. Divide cubic feet by 27 to reach cubic yards.'],
      ['Allow for waste', 'Ground is rarely perfectly level and some concrete is lost to forms and spillage. Ordering 5–10% extra is common practice.'],
      ['Bags or ready-mix?', 'Premixed bags suit small slabs. Bag yields differ by brand, so use the yield printed on your bag. Larger pours are usually easier with ready-mix.'],
    ],
  },
  {
    slug: 'tile-wastage-how-much-extra-to-order', title: 'Tile Wastage: How Much Extra Should You Order?', read: '3 min', date: '2026-10-12',
    description: 'Understand why tiling needs a wastage allowance and how much extra to buy for different layouts.',
    calcs: ['tile-calculator', 'tile-box-calculator', 'flooring-calculator'],
    sections: [
      ['Why wastage exists', 'Tiles are cut at walls, around pipes and in corners. Some break, and cut offcuts often cannot be reused.'],
      ['Typical allowances', 'About 10% for straight layouts, 15% for diagonal layouts and 20% or more for herringbone patterns or very small rooms.'],
      ['Buy from one batch', 'Tiles from different production batches can differ slightly in shade and size. Buy all boxes together and keep a few spares for future repairs.'],
      ['Work in whole boxes', 'Tiles are sold in boxes, so round up to whole boxes after adding wastage. The Tile Box Calculator shows how much coverage is left over.'],
    ],
  },
  {
    slug: 'how-to-calculate-gravel-tonnage', title: 'How to Calculate Gravel by Volume and Weight', read: '4 min', date: '2026-10-16',
    description: 'Find out how to turn an area and depth into cubic yards, then into tonnes or tons using material density.',
    calcs: ['gravel-calculator', 'pea-gravel-calculator', 'gravel-driveway-calculator'],
    sections: [
      ['Find the volume first', 'Multiply length, width and depth. For example, 10 m × 4 m × 0.05 m is 2 m³.'],
      ['Convert to weight with density', 'Weight = volume × bulk density. Gravel is often about 1,600–1,700 kg/m³, so 2 m³ weighs roughly 3.2–3.4 tonnes. Your supplier can confirm their figure.'],
      ['Mind the unit', 'A metric tonne is 1,000 kg. A US short ton is 2,000 lb, about 907 kg. Check which one your supplier quotes.'],
      ['Allow for compaction', 'Driveways and bases compact once rolled. Adding 10–20% prevents coming up short.'],
    ],
  },
  {
    slug: 'understanding-roof-pitch', title: 'Understanding Roof Pitch, Angle and Slope', read: '3 min', date: '2026-10-20',
    description: 'What a roof pitch like 6:12 means, how it relates to angle in degrees and slope percentage, and why it affects roof area.',
    calcs: ['roof-pitch-calculator', 'roofing-calculator'],
    sections: [
      ['What pitch means', 'Pitch is rise over run. A 6:12 pitch rises 6 units for every 12 units of horizontal distance.'],
      ['Pitch, angle and percentage', 'A 6:12 roof has a 26.57° angle and a 50% slope. A 4:12 roof is 18.43° and 33.3%. A 12:12 roof is 45° and 100%.'],
      ['Why pitch changes roof area', 'A steeper roof has more surface than the floor beneath it. Roof area equals plan area divided by the cosine of the roof angle, plus any overhang.'],
      ['Check material limits', 'Many roofing products specify a minimum pitch. Always check the manufacturer’s instructions.'],
    ],
  },
  {
    slug: 'how-to-estimate-paint-for-a-room', title: 'How to Estimate Paint for a Room', read: '3 min', date: '2026-10-24',
    description: 'A simple method to estimate how much paint a room needs, including openings, coats and coverage.',
    calcs: ['paint-calculator', 'construction-cost-calculator'],
    sections: [
      ['Measure the walls', 'Multiply wall length by height for each wall and add them up. Subtract doors and windows you will not paint.'],
      ['Check the coverage', 'Coverage is printed on the tin. Around 10 m² per litre (about 400 ft² per gallon) is common for smooth walls. Rough or porous walls need more.'],
      ['Multiply by the coats', 'Two coats are standard. Divide total coated area by coverage per litre to get the quantity.'],
      ['Add a little extra', 'A 5% allowance covers touch-ups and spills, and saves a trip back to the shop.'],
    ],
  },
];
export const GUIDE_BY_SLUG = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
