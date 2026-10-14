import { commemorationsFileSchema } from '../commemorations';
import { holidaysFileSchema } from '../holidays';
import { tamilMonthsFileSchema } from '../tamilMonths';
import tamilMonths from '../../../data/tamil-months.json';
import holidays from '../../../data/holidays/2026.json';
import commemorations from '../../../data/commemorations.json';

describe('tamilMonthsFileSchema', () => {
  it('accepts the bundled dataset and strips the 60-year cycle fields', () => {
    const parsed = tamilMonthsFileSchema.parse(tamilMonths);
    expect(parsed.months[0]).not.toHaveProperty('tamil_year_cycle');
  });

  it('rejects a month outside 1-12', () => {
    const bad = { ...tamilMonths, months: [{ ...tamilMonths.months[0], month: 13 }] };
    expect(tamilMonthsFileSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const bad = { ...tamilMonths, months: [{ ...tamilMonths.months[0], start: '13-01-1900' }] };
    expect(tamilMonthsFileSchema.safeParse(bad).success).toBe(false);
  });
});

describe('holidaysFileSchema', () => {
  it('accepts the bundled 2026 dataset', () => {
    expect(holidaysFileSchema.safeParse(holidays).success).toBe(true);
  });

  it('rejects an entry without a source', () => {
    const { source: _source, ...noSource } = holidays.holidays[0];
    const bad = { ...holidays, holidays: [noSource] };
    expect(holidaysFileSchema.safeParse(bad).success).toBe(false);
  });
});

describe('commemorationsFileSchema', () => {
  it('accepts the bundled dataset', () => {
    expect(commemorationsFileSchema.safeParse(commemorations).success).toBe(true);
  });

  it('rejects an unknown kind', () => {
    const bad = {
      ...commemorations,
      commemorations: [{ ...commemorations.commemorations[0], kind: 'festival' }],
    };
    expect(commemorationsFileSchema.safeParse(bad).success).toBe(false);
  });
});
