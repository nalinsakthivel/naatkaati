import { getTimeWarnings } from '../timeWarnings';

const on = { autoTime: true, autoTimeZone: true };
const now = new Date('2026-10-15T06:00:00Z');

describe('getTimeWarnings', () => {
  it('has no warnings when automatic time is on and the timezones match', () => {
    expect(getTimeWarnings(on, 'Asia/Kolkata', 'Asia/Kolkata', now)).toEqual({
      autoTimeOff: false,
      timezoneDiffers: false,
    });
  });

  it('warns when automatic date/time is off', () => {
    expect(
      getTimeWarnings({ autoTime: false, autoTimeZone: true }, 'Asia/Kolkata', 'Asia/Kolkata', now)
        .autoTimeOff,
    ).toBe(true);
  });

  it('warns when automatic timezone is off', () => {
    expect(
      getTimeWarnings({ autoTime: true, autoTimeZone: false }, 'Asia/Kolkata', 'Asia/Kolkata', now)
        .autoTimeOff,
    ).toBe(true);
  });

  it('flags a different device timezone', () => {
    expect(getTimeWarnings(on, 'Asia/Singapore', 'Asia/Kolkata', now).timezoneDiffers).toBe(true);
  });

  it('treats timezone aliases with the same offset as equal', () => {
    expect(getTimeWarnings(on, 'Asia/Calcutta', 'Asia/Kolkata', now).timezoneDiffers).toBe(false);
  });

  it('does not flag a difference when the device timezone is unknown', () => {
    expect(getTimeWarnings(on, null, 'Asia/Kolkata', now).timezoneDiffers).toBe(false);
  });
});
