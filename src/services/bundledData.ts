import { commemorationsFileSchema, type Commemoration } from '@/schemas/commemorations';
import { holidaysFileSchema, type Holiday } from '@/schemas/holidays';
import { tamilMonthsFileSchema, type TamilMonthRecord } from '@/schemas/tamilMonths';
import { thirukkuralFileSchema, type Adhikaram, type Kural } from '@/schemas/thirukkural';
import commemorationsRaw from '../../data/commemorations.json';
import holidays2026Raw from '../../data/holidays/2026.json';
import tamilMonthsRaw from '../../data/tamil-months.json';
import thirukkuralRaw from '../../data/thirukkural.json';

export interface BundledData {
  months: TamilMonthRecord[];
  holidays: Holiday[];
  kurals: Kural[];
  adhikarams: Adhikaram[];
  commemorations: Commemoration[];
}

let cache: BundledData | null = null;

/** Validates the bundled JSON with zod on first use, then reuses the result. Works fully offline. */
export function getBundledData(): BundledData {
  if (cache) return cache;
  const thirukkural = thirukkuralFileSchema.parse(thirukkuralRaw);
  cache = {
    months: tamilMonthsFileSchema.parse(tamilMonthsRaw).months,
    holidays: holidaysFileSchema.parse(holidays2026Raw).holidays,
    kurals: thirukkural.kurals,
    adhikarams: thirukkural.adhikarams,
    commemorations: commemorationsFileSchema.parse(commemorationsRaw).commemorations,
  };
  return cache;
}
