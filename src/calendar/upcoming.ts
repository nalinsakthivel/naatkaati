import { addYears, differenceInCalendarDays, format, parseISO } from 'date-fns';

export interface UpcomingItem {
  id: string;
  /** Civil date of the occurrence, yyyy-MM-dd */
  iso: string;
  /** Whole days from the reference date; 0 is the same day */
  daysAway: number;
}

/** Soonest holiday strictly after `fromIso`, or null if none is known. */
export function nextHoliday<T extends { id: string; date: string }>(
  holidays: readonly T[],
  fromIso: string,
): (UpcomingItem & { item: T }) | null {
  const sorted = holidays
    .filter((h) => h.date > fromIso)
    .sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  if (!first) return null;
  return {
    id: first.id,
    iso: first.date,
    item: first,
    daysAway: differenceInCalendarDays(parseISO(first.date), parseISO(fromIso)),
  };
}

/** Soonest yearly commemoration strictly after `fromIso`, rolling to next year when needed. */
export function nextCommemoration<T extends { id: string; month: number; day: number }>(
  commemorations: readonly T[],
  fromIso: string,
): (UpcomingItem & { item: T }) | null {
  const from = parseISO(fromIso);
  let best: (UpcomingItem & { item: T }) | null = null;
  for (const item of commemorations) {
    const thisYear = new Date(from.getFullYear(), item.month - 1, item.day);
    const occurrence =
      differenceInCalendarDays(thisYear, from) > 0 ? thisYear : addYears(thisYear, 1);
    const daysAway = differenceInCalendarDays(occurrence, from);
    if (best === null || daysAway < best.daysAway) {
      best = { id: item.id, iso: format(occurrence, 'yyyy-MM-dd'), item, daysAway };
    }
  }
  return best;
}
