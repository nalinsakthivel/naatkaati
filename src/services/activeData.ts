import { commemorationsFileSchema } from '@/schemas/commemorations';
import { holidaysFileSchema, type Holiday } from '@/schemas/holidays';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import { thirukkuralFileSchema } from '@/schemas/thirukkural';
import { bundledVersion, getBundledData, type BundledData } from './bundledData';
import { datasetStorage, listStoredDatasetNames } from './sync/datasetStorage';
import { parseDataset } from './sync/datasets';

let cache: BundledData | null = null;

function downloaded(name: string): unknown | null {
  const stored = datasetStorage.read(name);
  if (!stored || stored.version <= bundledVersion(name)) return null;
  return parseDataset(name, stored.text);
}

export function getActiveData(): BundledData {
  if (cache) return cache;
  const bundled = getBundledData();

  const months = tamilMonthsFileSchema.safeParse(downloaded('tamil-months'));
  const commemorations = commemorationsFileSchema.safeParse(downloaded('commemorations'));
  const kurals = thirukkuralFileSchema.safeParse(downloaded('thirukkural'));

  const holidaysByYear = new Map<number, Holiday[]>();
  for (const holiday of bundled.holidays) {
    const year = Number(holiday.date.slice(0, 4));
    holidaysByYear.set(year, [...(holidaysByYear.get(year) ?? []), holiday]);
  }
  for (const name of listStoredDatasetNames().filter((n) => n.startsWith('holidays-'))) {
    const file = holidaysFileSchema.safeParse(downloaded(name));
    if (file.success) holidaysByYear.set(file.data.year, file.data.holidays);
  }

  cache = {
    months: months.success ? months.data.months : bundled.months,
    holidays: [...holidaysByYear.values()].flat(),
    kurals: kurals.success ? kurals.data.kurals : bundled.kurals,
    adhikarams: kurals.success ? kurals.data.adhikarams : bundled.adhikarams,
    commemorations: commemorations.success
      ? commemorations.data.commemorations
      : bundled.commemorations,
  };
  return cache;
}

/** Call after a sync writes new data so the next read reloads it. */
export function resetActiveData(): void {
  cache = null;
}
