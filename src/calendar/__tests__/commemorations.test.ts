import { commemorationsOn } from '../commemorations';
import { commemorationsFileSchema } from '@/schemas/commemorations';
import raw from '../../../data/commemorations.json';

const list = commemorationsFileSchema.parse(raw).commemorations;

describe('commemorationsOn', () => {
  it('matches by Gregorian month and day in any year', () => {
    expect(commemorationsOn(list, '2026-09-17').map((c) => c.id)).toContain('periyar-birth');
    expect(commemorationsOn(list, '2031-09-17').map((c) => c.id)).toContain('periyar-birth');
  });

  it('returns an empty list on an ordinary day', () => {
    expect(commemorationsOn(list, '2026-03-03')).toEqual([]);
  });

  it('does not match the same day number in another month', () => {
    expect(commemorationsOn(list, '2026-10-17')).toEqual([]);
  });

  it('handles every bundled entry on its own date', () => {
    for (const item of list) {
      const iso = `2026-${String(item.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
      expect(commemorationsOn(list, iso).map((c) => c.id)).toContain(item.id);
    }
  });
});
