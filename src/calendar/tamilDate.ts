import type { TamilMonthRecord } from '@/schemas/tamilMonths';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export interface TamilDate {
  month: number;
  day: number;
  nameTa: string;
  nameEn: string;
  thiruvalluvarYear: number;
  source: TamilMonthRecord['source'];
}

const LAST_COVERED_DATE = '2100-12-31';

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

export function getTamilDate(
  months: readonly TamilMonthRecord[],
  isoDate: string,
): TamilDate | null {
  if (isoDate > LAST_COVERED_DATE) return null;
  const index = findMonthIndex(months, isoDate);
  if (index < 0) return null;
  const record = months[index];
  return {
    month: record.month,
    day: differenceInCalendarDays(parseISO(isoDate), parseISO(record.start)) + 1,
    nameTa: record.name_ta,
    nameEn: record.name_en,
    thiruvalluvarYear: record.thiruvalluvar_year,
    source: record.source,
  };
}
