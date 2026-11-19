import { Layers, LayoutGrid, Box, Mountain, Sprout, Home, Ruler, PaintBucket, Calculator } from 'lucide-react';

export const CAT_ICONS = { Layers, LayoutGrid, Box, Mountain, Sprout, Home, Ruler, PaintBucket };
export const catIcon = (name) => CAT_ICONS[name] || Calculator;
