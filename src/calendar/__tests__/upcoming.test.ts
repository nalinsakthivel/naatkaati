import { nextCommemoration, nextHoliday } from '../upcoming';

describe('nextHoliday', () => {
  const holidays = [
    { id: 'b', date: '2026-11-08' },
    { id: 'a', date: '2026-10-20' },
    { id: 'c', date: '2026-12-25' },
  ];

  it('returns the soonest holiday after the date, whatever the list order', () => {
    expect(nextHoliday(holidays, '2026-10-15')).toMatchObject({ id: 'a', daysAway: 5 });
  });

  it('is strictly after: a holiday today is not "upcoming"', () => {
    expect(nextHoliday(holidays, '2026-10-20')?.id).toBe('b');
  });

  it('returns null when nothing is left', () => {
    expect(nextHoliday(holidays, '2026-12-25')).toBeNull();
  });
});

describe('nextCommemoration', () => {
  const items = [
    { id: 'periyar-birth', month: 9, day: 17 },
    { id: 'periyar-death', month: 12, day: 24 },
    { id: 'language-martyrs', month: 1, day: 25 },
  ];

  it('picks the soonest this year', () => {
    expect(nextCommemoration(items, '2026-10-15')).toMatchObject({
      id: 'periyar-death',
      iso: '2026-12-24',
      daysAway: 70,
    });
  });

  it('rolls over to next year after the last date', () => {
    expect(nextCommemoration(items, '2026-12-30')).toMatchObject({
      id: 'language-martyrs',
      iso: '2027-01-25',
    });
  });

  it('is strictly after: today is not upcoming', () => {
    expect(nextCommemoration(items, '2026-09-17')?.id).toBe('periyar-death');
  });

  it('returns null for an empty list', () => {
    expect(nextCommemoration([], '2026-10-15')).toBeNull();
  });
});
