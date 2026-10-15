import { differenceInCalendarDays, parseISO } from 'date-fns';

const EPOCH = '2000-01-01';

/**
 * Deterministic kural for a civil date: days since 2000-01-01, modulo the kural count.
 * The app and the widget share this, so both always show the same kural.
 */
export function kuralOfTheDay<T>(kurals: readonly T[], isoDate: string): T | null {
  if (kurals.length === 0) return null;
  const days = differenceInCalendarDays(parseISO(isoDate), parseISO(EPOCH));
  const index = ((days % kurals.length) + kurals.length) % kurals.length;
  return kurals[index];
}
