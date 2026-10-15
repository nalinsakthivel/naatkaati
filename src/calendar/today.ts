import { TZDate } from '@date-fns/tz';
import { addDays, format, parseISO } from 'date-fns';

export function getTodayIso(now: Date, timeZone: string): string {
  return format(new TZDate(now, timeZone), 'yyyy-MM-dd');
}

export function shiftIsoDate(isoDate: string, days: number): string {
  return format(addDays(parseISO(isoDate), days), 'yyyy-MM-dd');
}
