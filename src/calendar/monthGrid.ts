import { addDays, format, getDay, getDaysInMonth } from 'date-fns';
import { commemorationsOn, type CommemorationLike } from './commemorations';
import { getTamilDate } from './tamilDate';
import type { TamilMonthRecord } from '@/schemas/tamilMonths';

export interface HolidayLike {
  id: string;
  date: string;
  name_ta: string;
  name_en: string;
}

export interface CommemorationEntry extends CommemorationLike {
  id: string;
  name_ta: string;
  name_en: string;
}

export interface GridCell<
  H extends HolidayLike,
  C extends CommemorationEntry = CommemorationEntry,
> {
  iso: string;
  /** Gregorian day of month */
  day: number;
  /** 0 = Sunday ... 6 = Saturday. Weeks start on Sunday. */
  weekday: number;
  inMonth: boolean;
  tamil: { day: number; monthNameTa: string; monthNameEn: string } | null;
  /** First day of a Tamil month */
  isTamilMonthStart: boolean;
  holidays: H[];
  commemorations: C[];
}

const toIso = (date: Date) => format(date, 'yyyy-MM-dd');

/**
 * Weeks (Sunday first) covering a Gregorian month, including the leading and trailing days
 * of neighbouring months. `month` is 1-12. Only as many weeks as the month needs.
 */
export function buildMonthGrid<H extends HolidayLike, C extends CommemorationEntry>(
  year: number,
  month: number,
  months: readonly TamilMonthRecord[],
  holidays: readonly H[],
  commemorations: readonly C[],
): GridCell<H, C>[][] {
  const first = new Date(year, month - 1, 1);
  const leading = getDay(first);
  const weekCount = Math.ceil((leading + getDaysInMonth(first)) / 7);
  const gridStart = addDays(first, -leading);

  const weeks: GridCell<H, C>[][] = [];
  for (let w = 0; w < weekCount; w++) {
    const week: GridCell<H, C>[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      const iso = toIso(date);
      const tamil = getTamilDate(months, iso);
      week.push({
        iso,
        day: date.getDate(),
        weekday: d,
        inMonth: date.getMonth() === month - 1,
        tamil: tamil
          ? { day: tamil.day, monthNameTa: tamil.nameTa, monthNameEn: tamil.nameEn }
          : null,
        isTamilMonthStart: tamil?.day === 1,
        holidays: holidays.filter((holiday) => holiday.date === iso),
        commemorations: commemorationsOn(commemorations, iso),
      });
    }
    weeks.push(week);
  }
  return weeks;
}
