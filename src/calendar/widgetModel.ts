import { TZDate } from '@date-fns/tz';
import { format, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import type { TamilMonthRecord } from '@/schemas/tamilMonths';
import { getSunTimes, type GeoLocation } from './astronomy';
import { commemorationsOn } from './commemorations';
import { filterHolidaysByCategory, holidaysOn, type AppliesTo } from './holidays';
import { kuralOfTheDay } from './kural';
import { toTamilNumerals } from './numerals';
import { getTamilDate } from './tamilDate';

export interface WidgetInput {
  months: readonly TamilMonthRecord[];
  holidays: readonly { date: string; name_ta: string; name_en: string; applies_to: AppliesTo[] }[];
  commemorations: readonly { month: number; day: number; name_ta: string; name_en: string }[];
  kurals: readonly { number: number; lines_ta: string[] }[];
  iso: string;
  language: 'ta' | 'en';
  tamilNumerals: boolean;
  holidayCategories: readonly AppliesTo[];
  location: GeoLocation;
}

export interface WidgetModel {
  day: string;
  monthName: string;
  year: string;
  /** e.g. "Monday" / "திங்கள்" */
  weekday: string;
  /** e.g. "28 September" */
  gregorianLabel: string;
  /** e.g. "SEP 2026" */
  monthYear: string;
  holidayName: string | null;
  /** The holiday if there is one, otherwise a commemoration; null on an ordinary day */
  eventName: string | null;
  sunrise: string;
  sunset: string;
  kuralNumber: string;
  kuralLines: string[];
}

const NO_TIME = '—';

export function buildWidgetModel(input: WidgetInput): WidgetModel | null {
  const tamil = getTamilDate(input.months, input.iso);
  if (!tamil) return null;
  const isTamil = input.language === 'ta';
  const locale = isTamil ? ta : enIN;
  const date = parseISO(input.iso);
  const digits = (value: number) =>
    input.tamilNumerals && isTamil ? toTamilNumerals(value) : String(value);
  const holiday = filterHolidaysByCategory(
    holidaysOn(input.holidays, input.iso),
    input.holidayCategories,
  )[0];
  const commemoration = commemorationsOn(input.commemorations, input.iso)[0];
  const holidayName = holiday ? (isTamil ? holiday.name_ta : holiday.name_en) : null;
  const commemorationName = commemoration
    ? isTamil
      ? commemoration.name_ta
      : commemoration.name_en
    : null;
  const sun = getSunTimes(input.iso, input.location);
  const timeOf = (instant: Date | null) =>
    instant ? format(new TZDate(instant, input.location.timeZone), 'HH:mm') : NO_TIME;
  const kural = kuralOfTheDay(input.kurals, input.iso);
  return {
    day: digits(tamil.day),
    monthName: isTamil ? tamil.nameTa : tamil.nameEn,
    year: digits(tamil.thiruvalluvarYear),
    weekday: format(date, 'EEEE', { locale }),
    gregorianLabel: format(date, 'd MMMM', { locale }),
    monthYear: format(date, 'MMM yyyy', { locale: enIN }).toUpperCase(),
    holidayName,
    eventName: holidayName ?? commemorationName,
    sunrise: timeOf(sun.sunrise),
    sunset: timeOf(sun.sunset),
    kuralNumber: kural ? digits(kural.number) : '',
    kuralLines: kural ? kural.lines_ta : [],
  };
}
