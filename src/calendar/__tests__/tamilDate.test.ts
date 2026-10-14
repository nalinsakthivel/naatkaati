import { addDays, format, parseISO } from 'date-fns';
import { getTamilDate } from '../tamilDate';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import raw from '../../../data/tamil-months.json';
import gazette from '../../../tools/generate-tamil-months/fixtures/gazette.json';

const months = tamilMonthsFileSchema.parse(raw).months;
const shift = (iso: string, days: number) => format(addDays(parseISO(iso), days), 'yyyy-MM-dd');

describe('getTamilDate at every month boundary', () => {
  it('table is sorted by start date', () => {
    for (let i = 1; i < months.length; i++) {
      expect(months[i].start > months[i - 1].start).toBe(true);
    }
  });

  it('maps start day to day 1, day before to the last day of the previous month, day after to day 2', () => {
    for (let i = 1; i < months.length; i++) {
      const { start, month, name_en } = months[i];
      const prev = months[i - 1];
      const prevLength = Math.round(
        (parseISO(start).getTime() - parseISO(prev.start).getTime()) / 86_400_000,
      );

      const onStart = getTamilDate(months, start);
      expect(onStart).toMatchObject({ day: 1, month, nameEn: name_en });

      const before = getTamilDate(months, shift(start, -1));
      expect(before).toMatchObject({ day: prevLength, month: prev.month });

      const after = getTamilDate(months, shift(start, 1));
      expect(after).toMatchObject({ day: 2, month });
    }
  });
});

describe('getTamilDate against official Gazette fixtures', () => {
  it.each(gazette.fixtures)('$date is $month_en $day', (fixture) => {
    const result = getTamilDate(months, fixture.date);
    expect(result?.nameEn).toBe(fixture.month_en);
    expect(result?.day).toBe(fixture.day);
  });
});

describe('getTamilDate range', () => {
  it('returns null before the table starts', () => {
    expect(getTamilDate(months, '1899-12-31')).toBeNull();
    expect(getTamilDate(months, '1900-01-12')).toBeNull();
  });

  it('returns null after the table ends', () => {
    expect(getTamilDate(months, '2101-01-01')).toBeNull();
  });

  it('exposes the Thiruvalluvar year and never the 60-year cycle', () => {
    const result = getTamilDate(months, '2026-01-15');
    expect(result?.thiruvalluvarYear).toBe(2057);
    expect(result).not.toHaveProperty('tamil_year_cycle');
  });
});
