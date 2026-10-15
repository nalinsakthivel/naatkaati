import { filterHolidaysByCategory, holidaysOn, mergeSameDayHolidays } from '../holidays';

const list = [
  { date: '2026-01-15', id: 'a' },
  { date: '2026-01-15', id: 'b' },
  { date: '2026-01-26', id: 'c' },
];

describe('holidaysOn', () => {
  it('returns every holiday on the date', () => {
    expect(holidaysOn(list, '2026-01-15').map((h) => h.id)).toEqual(['a', 'b']);
  });

  it('returns an empty list when there is none', () => {
    expect(holidaysOn(list, '2026-02-01')).toEqual([]);
  });
});

describe('filterHolidaysByCategory', () => {
  const items = [
    { id: 'a', applies_to: ['state_govt', 'banks'] as const },
    { id: 'b', applies_to: ['central_govt'] as const },
  ];

  it('keeps holidays that apply to any enabled category', () => {
    expect(filterHolidaysByCategory(items, ['banks']).map((i) => i.id)).toEqual(['a']);
    expect(filterHolidaysByCategory(items, ['central_govt']).map((i) => i.id)).toEqual(['b']);
  });

  it('returns nothing when no category is enabled', () => {
    expect(filterHolidaysByCategory(items, [])).toEqual([]);
  });
});

describe('mergeSameDayHolidays', () => {
  const central = {
    id: 'cg-diwali',
    date: '2026-11-08',
    name_ta: 'தீபாவளி',
    applies_to: ['central_govt'] as const,
  };
  const state = {
    id: 'tn-deepavali',
    date: '2026-11-08',
    name_ta: 'தீபாவளி',
    applies_to: ['state_govt', 'banks'] as const,
  };

  it('merges the same holiday listed by the central and state lists into one record', () => {
    const merged = mergeSameDayHolidays([central, state]);
    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe('cg-diwali');
    expect(merged[0].applies_to).toEqual(['state_govt', 'central_govt', 'banks']);
  });

  it('keeps different holidays on the same date apart', () => {
    const other = { ...state, id: 'tn-other', name_ta: 'ஆயுத பூஜை' };
    expect(mergeSameDayHolidays([central, other]).map((h) => h.id)).toEqual([
      'cg-diwali',
      'tn-other',
    ]);
  });

  it('keeps the same name on different dates apart', () => {
    const later = { ...state, id: 'later', date: '2027-10-29' };
    expect(mergeSameDayHolidays([central, later])).toHaveLength(2);
  });
});
