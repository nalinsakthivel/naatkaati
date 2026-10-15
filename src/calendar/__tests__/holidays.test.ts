import { filterHolidaysByCategory, holidaysOn } from '../holidays';

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
