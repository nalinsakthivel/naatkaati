import { TZDate } from '@date-fns/tz';
import { getEclipsesInYear, getMoonInfo, getSunTimes, type GeoLocation } from '../astronomy';

const chennai: GeoLocation = { latitude: 13.0827, longitude: 80.2707, timeZone: 'Asia/Kolkata' };
const localHour = (d: Date, tz: string) => {
  const t = new TZDate(d, tz);
  return t.getHours() + t.getMinutes() / 60;
};

describe('getSunTimes', () => {
  it('Chennai sunrise and sunset in mid-January are about 06:30 and 18:00 IST', () => {
    const { sunrise, sunset } = getSunTimes('2026-01-15', chennai);
    expect(sunrise).not.toBeNull();
    expect(sunset).not.toBeNull();
    expect(localHour(sunrise as Date, chennai.timeZone)).toBeGreaterThan(6.25);
    expect(localHour(sunrise as Date, chennai.timeZone)).toBeLessThan(6.75);
    expect(localHour(sunset as Date, chennai.timeZone)).toBeGreaterThan(17.75);
    expect(localHour(sunset as Date, chennai.timeZone)).toBeLessThan(18.25);
  });

  it('returns the requested local day even when UTC is on the previous day', () => {
    const { sunrise } = getSunTimes('2026-06-01', chennai);
    expect(sunrise).not.toBeNull();
    expect(new TZDate(sunrise as Date, chennai.timeZone).getDate()).toBe(1);
  });

  it('returns null sunrise and sunset during polar night', () => {
    const tromso: GeoLocation = {
      latitude: 78.2,
      longitude: 15.6,
      timeZone: 'Arctic/Longyearbyen',
    };
    expect(getSunTimes('2026-12-21', tromso)).toEqual({ sunrise: null, sunset: null });
  });
});

describe('getMoonInfo', () => {
  it('is full around 2026-01-03', () => {
    const moon = getMoonInfo(new Date('2026-01-03T10:00:00Z'));
    expect(moon.phase).toBe('full_moon');
    expect(moon.illumination).toBeGreaterThan(0.98);
  });

  it('is new around 2026-01-18', () => {
    const moon = getMoonInfo(new Date('2026-01-18T20:00:00Z'));
    expect(moon.phase).toBe('new_moon');
    expect(moon.illumination).toBeLessThan(0.02);
  });

  it('is waxing between new and full', () => {
    expect(getMoonInfo(new Date('2026-01-25T12:00:00Z')).angle).toBeLessThan(180);
  });
});

describe('getEclipsesInYear', () => {
  const eclipses = getEclipsesInYear(2026, 'Asia/Kolkata');
  const find = (date: string) => eclipses.find((e) => e.date === date);

  it('finds the 2026 solar and lunar eclipses', () => {
    expect(find('2026-02-17')).toMatchObject({ type: 'solar', kind: 'annular' });
    expect(find('2026-03-03')).toMatchObject({ type: 'lunar', kind: 'total' });
    expect(find('2026-08-12')).toMatchObject({ type: 'solar', kind: 'total' });
    expect(find('2026-08-28')).toMatchObject({ type: 'lunar', kind: 'partial' });
  });

  it('returns only dates inside the year, in order', () => {
    expect(eclipses.length).toBe(4);
    eclipses.forEach((e) => expect(e.date.startsWith('2026-')).toBe(true));
    expect(eclipses.map((e) => e.date)).toEqual([...eclipses.map((e) => e.date)].sort());
  });
});
