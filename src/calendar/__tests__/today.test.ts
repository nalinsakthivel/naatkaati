import { getTodayIso } from '../today';

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
