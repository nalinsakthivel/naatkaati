import { holidaysOn } from '../holidays';

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
