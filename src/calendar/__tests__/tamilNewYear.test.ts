import { isTamilNewYear } from '../tamilNewYear';
import { getTamilDate } from '../tamilDate';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import raw from '../../../data/tamil-months.json';

const months = tamilMonthsFileSchema.parse(raw).months;

describe('isTamilNewYear', () => {
  it('is Thai 1 when the label is thai', () => {
    expect(isTamilNewYear(10, 1, 'thai')).toBe(true);
    expect(isTamilNewYear(1, 1, 'thai')).toBe(false);
  });

  it('is Chithirai 1 when the label is chithirai', () => {
    expect(isTamilNewYear(1, 1, 'chithirai')).toBe(true);
    expect(isTamilNewYear(10, 1, 'chithirai')).toBe(false);
  });

  it('is only the first day of the month', () => {
    expect(isTamilNewYear(10, 2, 'thai')).toBe(false);
  });

  it.each([
    ['2026-01-14', false, false],
    ['2026-01-15', true, false],
    ['2026-01-16', false, false],
    ['2026-04-13', false, false],
    ['2026-04-14', false, true],
    ['2026-04-15', false, false],
  ])('labels %s without changing its conversion or year', (iso, thai, chithirai) => {
    const date = getTamilDate(months, iso);
    if (!date) throw new Error(`Missing Tamil date for ${iso}`);
    const before = { ...date };
    expect(isTamilNewYear(date.month, date.day, 'thai')).toBe(thai);
    expect(isTamilNewYear(date.month, date.day, 'chithirai')).toBe(chithirai);
    expect(date).toEqual(before);
  });
});
