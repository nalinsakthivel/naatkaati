import { TZDate } from '@date-fns/tz';
import { addDays, format, parseISO } from 'date-fns';

/** Civil date (yyyy-MM-dd) of `now` in the given IANA timezone. Never the device timezone by default. */
export function getTodayIso(now: Date, timeZone: string): string {
  return format(new TZDate(now, timeZone), 'yyyy-MM-dd');
}

/** The civil date `days` after (or before, if negative) `isoDate`. */
export function shiftIsoDate(isoDate: string, days: number): string {
  return format(addDays(parseISO(isoDate), days), 'yyyy-MM-dd');
}
