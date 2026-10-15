import { kuralOfTheDay } from '../kural';

const kurals = Array.from({ length: 1330 }, (_, i) => i + 1);

describe('kuralOfTheDay', () => {
  it('is deterministic for a date', () => {
    expect(kuralOfTheDay(kurals, '2026-10-15')).toBe(kuralOfTheDay(kurals, '2026-10-15'));
  });

  it('advances by one kural per day', () => {
    const a = kuralOfTheDay(kurals, '2026-10-15') as number;
    const b = kuralOfTheDay(kurals, '2026-10-16') as number;
    expect(b === a + 1 || (a === 1330 && b === 1)).toBe(true);
  });

  it('starts at kural 1 on the epoch and wraps after 1330 days', () => {
    expect(kuralOfTheDay(kurals, '2000-01-01')).toBe(1);
    expect(kuralOfTheDay(kurals, '2000-01-02')).toBe(2);
    expect(kuralOfTheDay(kurals, '2003-08-23')).toBe(1); // 1330 days after epoch
  });

  it('handles dates before the epoch', () => {
    expect(kuralOfTheDay(kurals, '1999-12-31')).toBe(1330);
  });

  it('returns null for an empty list', () => {
    expect(kuralOfTheDay([], '2026-10-15')).toBeNull();
  });
});
