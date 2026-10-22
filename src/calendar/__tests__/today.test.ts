import { getTodayIso, shiftIsoDate } from '../today';
import { getTamilDate } from '../tamilDate';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import raw from '../../../data/tamil-months.json';

const months = tamilMonthsFileSchema.parse(raw).months;

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

  it('crosses the official Thai boundary and year at Chennai midnight', () => {
    const before = getTodayIso(new Date('2026-01-14T18:29:59Z'), 'Asia/Kolkata');
    const after = getTodayIso(new Date('2026-01-14T18:30:00Z'), 'Asia/Kolkata');
    expect(before).toBe('2026-01-14');
    expect(after).toBe('2026-01-15');
    expect(getTamilDate(months, before)).toMatchObject({
      month: 9,
      day: 30,
      thiruvalluvarYear: 2056,
    });
    expect(getTamilDate(months, after)).toMatchObject({
      month: 10,
      day: 1,
      thiruvalluvarYear: 2057,
    });
  });

  it('uses the selected location even when another location is on the previous date', () => {
    const now = new Date('2026-01-14T18:30:00Z');
    expect(getTodayIso(now, 'America/Los_Angeles')).toBe('2026-01-14');
    expect(getTodayIso(now, 'Asia/Kolkata')).toBe('2026-01-15');
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
