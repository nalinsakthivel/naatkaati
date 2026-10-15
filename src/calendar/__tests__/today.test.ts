import { getTodayIso, shiftIsoDate } from '../today';

describe('getTodayIso', () => {
  it('uses the location timezone, not UTC', () => {
    // 20:00 UTC on 14 Oct is already 15 Oct in India (UTC+5:30)
    expect(getTodayIso(new Date('2026-10-14T20:00:00Z'), 'Asia/Kolkata')).toBe('2026-10-15');
    expect(getTodayIso(new Date('2026-10-14T20:00:00Z'), 'UTC')).toBe('2026-10-14');
  });

  it('rolls over at local midnight', () => {
    expect(getTodayIso(new Date('2026-10-14T18:29:59Z'), 'Asia/Kolkata')).toBe('2026-10-14');
    expect(getTodayIso(new Date('2026-10-14T18:30:00Z'), 'Asia/Kolkata')).toBe('2026-10-15');
  });
});

describe('shiftIsoDate', () => {
  it('moves forward and backward across month and year ends', () => {
    expect(shiftIsoDate('2026-10-31', 1)).toBe('2026-11-01');
    expect(shiftIsoDate('2026-01-01', -1)).toBe('2025-12-31');
    expect(shiftIsoDate('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('handles leap days', () => {
    expect(shiftIsoDate('2028-02-28', 1)).toBe('2028-02-29');
    expect(shiftIsoDate('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('returns the same date for 0 days', () => {
    expect(shiftIsoDate('2026-10-15', 0)).toBe('2026-10-15');
  });
});
