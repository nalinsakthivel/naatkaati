import type { TamilMonthRecord } from '@/schemas/tamilMonths';
import { filterHolidaysByCategory, holidaysOn, type AppliesTo } from './holidays';
import { kuralOfTheDay } from './kural';
import { toTamilNumerals } from './numerals';
import { getTamilDate } from './tamilDate';

export interface WidgetInput {
  months: readonly TamilMonthRecord[];
  holidays: readonly { date: string; name_ta: string; name_en: string; applies_to: AppliesTo[] }[];
  kurals: readonly { number: number; lines_ta: string[] }[];
  iso: string;
  language: 'ta' | 'en';
  tamilNumerals: boolean;
  holidayCategories: readonly AppliesTo[];
}

export interface WidgetModel {
  day: string;
  monthName: string;
  year: string;
  holidayName: string | null;
  kuralNumber: string;
  kuralLines: string[];
}

export function buildWidgetModel(input: WidgetInput): WidgetModel | null {
  const tamil = getTamilDate(input.months, input.iso);
  if (!tamil) return null;
  const isTamil = input.language === 'ta';
  const digits = (value: number) =>
    input.tamilNumerals && isTamil ? toTamilNumerals(value) : String(value);
  const holiday = filterHolidaysByCategory(
    holidaysOn(input.holidays, input.iso),
    input.holidayCategories,
  )[0];
  const kural = kuralOfTheDay(input.kurals, input.iso);
  return {
    day: digits(tamil.day),
    monthName: isTamil ? tamil.nameTa : tamil.nameEn,
    year: digits(tamil.thiruvalluvarYear),
    holidayName: holiday ? (isTamil ? holiday.name_ta : holiday.name_en) : null,
    kuralNumber: kural ? digits(kural.number) : '',
    kuralLines: kural ? kural.lines_ta : [],
  };
}
