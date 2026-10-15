import {
  commemorationReminderKey,
  holidayReminderKey,
  planReminder,
  type ReminderSpec,
} from '../reminders';

const now = new Date(2026, 9, 15, 12, 0, 0); // 15 Oct 2026, noon

describe('planReminder', () => {
  const once: ReminderSpec = { key: 'h:x', kind: 'once', year: 2026, month: 10, day: 20 };

  it('plans a one-off reminder at the chosen hour on the date', () => {
    expect(planReminder(once, now, 7)).toEqual({
      type: 'date',
      date: new Date(2026, 9, 20, 7, 0, 0),
    });
  });

  it('returns null for a date in the past', () => {
    expect(planReminder({ ...once, day: 14 }, now, 7)).toBeNull();
  });

  it('returns null for today when the chosen hour has already passed', () => {
    expect(planReminder({ ...once, day: 15 }, now, 7)).toBeNull();
  });

  it('still plans today when the hour is later than now', () => {
    expect(planReminder({ ...once, day: 15 }, now, 18)).not.toBeNull();
  });

  it('returns null for a one-off reminder with no year', () => {
    expect(planReminder({ ...once, year: undefined }, now, 7)).toBeNull();
  });

  it('plans a yearly reminder with a 0-based month', () => {
    const yearly: ReminderSpec = { key: 'c:y', kind: 'yearly', month: 9, day: 17 };
    expect(planReminder(yearly, now, 7)).toEqual({
      type: 'yearly',
      month: 8,
      day: 17,
      hour: 7,
      minute: 0,
    });
  });
});

describe('reminder keys', () => {
  it('namespaces holidays and commemorations', () => {
    expect(holidayReminderKey('tn-2026-pongal')).toBe('h:tn-2026-pongal');
    expect(commemorationReminderKey('periyar-birth')).toBe('c:periyar-birth');
  });
});
