import { tz } from '@date-fns/tz';
import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { getTamilDate } from '../tamilDate';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import raw from '../../../data/tamil-months.json';
import gazette from '../../../tools/generate-tamil-months/fixtures/gazette.json';

const months = tamilMonthsFileSchema.parse(raw).months;
const civilDate = (iso: string) => parseISO(`${iso}T00:00:00Z`, { in: tz('UTC') });
const shift = (iso: string, days: number) => format(addDays(civilDate(iso), days), 'yyyy-MM-dd');

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
      const prevLength = differenceInCalendarDays(civilDate(start), civilDate(prev.start));

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
    expect(result?.source).toBe('gazette');
    if ('thiruvalluvar_year' in fixture) {
      expect(result?.thiruvalluvarYear).toBe(fixture.thiruvalluvar_year);
    }
  });

  it('keeps official starts when the computed start differs', () => {
    const overrides = raw.months.filter(
      (record) => record.source === 'gazette' && record.computed_start !== record.start,
    );
    expect(overrides.length).toBeGreaterThan(0);
    for (const record of overrides) {
      expect(getTamilDate(months, record.start)).toMatchObject({
        day: 1,
        nameEn: record.name_en,
        source: 'gazette',
      });
      expect(getTamilDate(months, shift(record.start, -1))?.month).not.toBe(record.month);
    }
  });
});

describe('getTamilDate range', () => {
  it.each([
    '',
    'not-a-date',
    '2026-1-15',
    '2026-01-15T23:00:00Z',
    '2026-02-29',
    '2026-02-30',
    '2026-04-31',
    '1900-02-29',
    '2100-02-29',
    '2026-00-15',
    '2026-13-15',
    '2026-01-00',
    '2026-01-32',
  ])('returns null for invalid civil date %j', (iso) => {
    expect(getTamilDate(months, iso)).toBeNull();
  });

  it('returns null before the table starts', () => {
    expect(getTamilDate(months, '1899-12-31')).toBeNull();
    expect(getTamilDate(months, '1900-01-12')).toBeNull();
  });

  it('returns null after the table ends', () => {
    expect(getTamilDate(months, '2101-01-01')).toBeNull();
  });

  it('includes the first date and the partial final month', () => {
    expect(getTamilDate(months, '1900-01-13')).toMatchObject({ day: 1, month: 10 });
    expect(getTamilDate(months, '2100-12-31')).toMatchObject({ day: 15, month: 9 });
    expect(getTamilDate([], '2026-01-15')).toBeNull();
  });

  it('exposes the Thiruvalluvar year and never the 60-year cycle', () => {
    const result = getTamilDate(months, '2026-01-15');
    expect(result?.thiruvalluvarYear).toBe(2057);
    expect(result).not.toHaveProperty('tamil_year_cycle');
  });
});

describe('civil date and year transitions', () => {
  it.each([
    ['1900-02-28', 17],
    ['1900-03-01', 18],
    ['2000-02-29', 17],
    ['2000-03-01', 18],
    ['2100-02-28', 15],
    ['2100-03-01', 16],
    // Samoa skipped this date locally, but it remains a valid Chennai civil date.
    ['2011-12-30', 15],
  ])('converts %s independently of the device timezone', (iso, day) => {
    expect(getTamilDate(months, iso)?.day).toBe(day);
  });

  it('advances the Thiruvalluvar year at Thai 1, not January 1 or Chithirai 1', () => {
    for (const record of months.filter((entry) => entry.month === 10).slice(1)) {
      const year = Number(record.start.slice(0, 4));
      expect(getTamilDate(months, `${year}-01-01`)?.thiruvalluvarYear).toBe(year + 30);
      expect(getTamilDate(months, shift(record.start, -1))?.thiruvalluvarYear).toBe(year + 30);
      expect(getTamilDate(months, record.start)?.thiruvalluvarYear).toBe(year + 31);
      expect(getTamilDate(months, `${year}-04-30`)?.thiruvalluvarYear).toBe(year + 31);
    }
  });
});
