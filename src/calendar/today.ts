import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

/** Civil date (yyyy-MM-dd) of `now` in the given IANA timezone. Never the device timezone by default. */
export function getTodayIso(now: Date, timeZone: string): string {
  return format(new TZDate(now, timeZone), 'yyyy-MM-dd');
}
