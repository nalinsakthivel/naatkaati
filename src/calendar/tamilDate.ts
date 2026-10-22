import { differenceInHours, isValid, parseISO } from 'date-fns';
import type { TamilMonthRecord } from '@/schemas/tamilMonths';

export interface TamilDate {
  /** 1 = Chithirai ... 12 = Panguni */
  month: number;
  day: number;
  nameTa: string;
  nameEn: string;
  thiruvalluvarYear: number;
  source: TamilMonthRecord['source'];
}

/** Last civil date covered by the table, including the partial final month. */
const LAST_COVERED_DATE = '2100-12-31';
// Inputs already name Chennai civil dates. UTC arithmetic avoids device DST and historical offsets.
const HOURS_PER_DAY = 24;

/** Index of the last month starting on or before `isoDate`, or -1. ISO dates compare lexicographically. */
function findMonthIndex(months: readonly TamilMonthRecord[], isoDate: string): number {
  let low = 0;
  let high = months.length - 1;
  let found = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (months[mid].start <= isoDate) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found;
}

/**
 * Tamil date for a civil date (yyyy-MM-dd, Chennai/IST reference).
 * Returns null for invalid civil dates or dates outside the table range.
 * `months` must be sorted by `start`, as shipped in data/tamil-months.json.
 */
export function getTamilDate(
  months: readonly TamilMonthRecord[],
  isoDate: string,
): TamilDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || isoDate > LAST_COVERED_DATE) return null;
  const date = parseISO(`${isoDate}T00:00:00Z`);
  if (!isValid(date)) return null;
  const index = findMonthIndex(months, isoDate);
  if (index < 0) return null;
  const record = months[index];
  return {
    month: record.month,
    day: differenceInHours(date, parseISO(`${record.start}T00:00:00Z`)) / HOURS_PER_DAY + 1,
    nameTa: record.name_ta,
    nameEn: record.name_en,
    thiruvalluvarYear: record.thiruvalluvar_year,
    source: record.source,
  };
}
