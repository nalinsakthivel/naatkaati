import { buildMonthGrid } from '../monthGrid';
import { getTamilDate } from '../tamilDate';
import { commemorationsFileSchema } from '@/schemas/commemorations';
import { holidaysFileSchema } from '@/schemas/holidays';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import holidaysRaw from '../../../data/holidays/2026.json';
import commemorationsRaw from '../../../data/commemorations.json';
import monthsRaw from '../../../data/tamil-months.json';

const months = tamilMonthsFileSchema.parse(monthsRaw).months;
const holidays = holidaysFileSchema.parse(holidaysRaw).holidays;
const commemorations = commemorationsFileSchema.parse(commemorationsRaw).commemorations;

describe('buildMonthGrid', () => {
  it('starts weeks on Sunday and pads with the previous month (Oct 2026 starts on a Thursday)', () => {
    const grid = buildMonthGrid(2026, 10, months, holidays, commemorations);
    expect(grid).toHaveLength(5);
    expect(grid[0][0]).toMatchObject({ iso: '2026-09-27', inMonth: false, weekday: 0 });
    expect(grid[0][4]).toMatchObject({ iso: '2026-10-01', inMonth: true, weekday: 4 });
    expect(grid[4][6]).toMatchObject({ iso: '2026-10-31', inMonth: true });
  });

  it('uses exactly 4 weeks when February starts on Sunday and has 28 days (Feb 2026)', () => {
    const grid = buildMonthGrid(2026, 2, months, holidays, commemorations);
    expect(grid).toHaveLength(4);
    expect(grid[0][0].iso).toBe('2026-02-01');
    expect(grid[3][6].iso).toBe('2026-02-28');
  });

  it('handles a leap February (Feb 2028)', () => {
    const grid = buildMonthGrid(2028, 2, months, holidays, commemorations);
    const inMonth = grid.flat().filter((cell) => cell.inMonth);
    expect(inMonth).toHaveLength(29);
    expect(inMonth[28].iso).toBe('2028-02-29');
  });

  it('crosses year boundaries (Dec 2026 grid ends in Jan 2027)', () => {
    const cells = buildMonthGrid(2026, 12, months, holidays, commemorations).flat();
    expect(
      cells[cells.length - 1].iso.startsWith('2027-01') || cells[cells.length - 1].inMonth,
    ).toBe(true);
    expect(cells.some((cell) => cell.iso === '2026-12-31' && cell.inMonth)).toBe(true);
  });

  it('every cell matches getTamilDate', () => {
    for (const cell of buildMonthGrid(2026, 4, months, holidays, commemorations).flat()) {
      const expected = getTamilDate(months, cell.iso);
      expect(cell.tamil?.day).toBe(expected?.day);
      expect(cell.isTamilMonthStart).toBe(expected?.day === 1);
    }
  });

  it('marks exactly one Tamil month start in Chithirai 2026 (14 April)', () => {
    const cell = buildMonthGrid(2026, 4, months, holidays, commemorations)
      .flat()
      .find((c) => c.iso === '2026-04-14');
    expect(cell?.isTamilMonthStart).toBe(true);
    expect(cell?.tamil?.monthNameEn).toBe('Chithirai');
  });

  it('attaches holidays to their date (Pongal, 15 Jan 2026)', () => {
    const cell = buildMonthGrid(2026, 1, months, holidays, commemorations)
      .flat()
      .find((c) => c.iso === '2026-01-15');
    expect(cell?.holidays.some((h) => h.name_en === 'Pongal')).toBe(true);
  });

  it('gives no Tamil date outside the table range', () => {
    const cell = buildMonthGrid(1900, 1, months, holidays, commemorations)
      .flat()
      .find((c) => c.iso === '1900-01-05');
    expect(cell?.tamil).toBeNull();
  });

  it('pads the last supported month without extrapolating Tamil dates into 2101', () => {
    const cells = buildMonthGrid(2100, 12, months, [], []).flat();
    expect(cells.find((cell) => cell.iso === '2100-12-31')?.tamil).toMatchObject({
      month: 9,
      day: 15,
    });
    const beyond = cells.filter((cell) => cell.iso > '2100-12-31');
    expect(beyond.length).toBeGreaterThan(0);
    for (const cell of beyond) {
      expect(cell.tamil).toBeNull();
      expect(cell.isTamilMonthStart).toBe(false);
      expect(cell.inMonth).toBe(false);
    }
  });

  it('attaches commemorations by Gregorian month and day (Periyar birth, 17 Sep)', () => {
    const cell = buildMonthGrid(2026, 9, months, holidays, commemorations)
      .flat()
      .find((c) => c.iso === '2026-09-17');
    expect(cell?.commemorations.map((c) => c.id)).toContain('periyar-birth');
  });
});
