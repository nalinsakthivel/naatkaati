import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';
import {
  Body,
  Illumination,
  MoonPhase,
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  Observer,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
  SearchRiseSet,
} from 'astronomy-engine';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  /** IANA timezone, e.g. "Asia/Kolkata" */
  timeZone: string;
}

export interface SunTimes {
  /** null when the sun does not rise/set that day (polar regions) */
  sunrise: Date | null;
  sunset: Date | null;
}

export type MoonPhaseName =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface MoonInfo {
  /** Ecliptic elongation from the sun, 0-360 degrees (0 = new, 180 = full) */
  angle: number;
  /** Illuminated fraction, 0-1 */
  illumination: number;
  phase: MoonPhaseName;
}

export type EclipseType = 'solar' | 'lunar';

export interface Eclipse {
  type: EclipseType;
  /** penumbral | partial | total | annular */
  kind: string;
  peak: Date;
  /** Civil date of the peak in the requested timezone, yyyy-MM-dd */
  date: string;
}

const MOON_PHASES: readonly MoonPhaseName[] = [
  'new_moon',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full_moon',
  'waning_gibbous',
  'last_quarter',
  'waning_crescent',
];

const RISE = 1;
const SET = -1;
const SEARCH_DAYS = 1;

function startOfLocalDay(isoDate: string, timeZone: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(new TZDate(year, month - 1, day, timeZone).getTime());
}

export function getSunTimes(isoDate: string, location: GeoLocation): SunTimes {
  const observer = new Observer(location.latitude, location.longitude, 0);
  const dayStart = startOfLocalDay(isoDate, location.timeZone);
  const sunrise = SearchRiseSet(Body.Sun, observer, RISE, dayStart, SEARCH_DAYS);
  const sunset = SearchRiseSet(Body.Sun, observer, SET, dayStart, SEARCH_DAYS);
  return { sunrise: sunrise?.date ?? null, sunset: sunset?.date ?? null };
}

export function getMoonInfo(at: Date): MoonInfo {
  const angle = MoonPhase(at);
  const bucket = Math.floor(((angle + 22.5) % 360) / 45);
  return {
    angle,
    illumination: Illumination(Body.Moon, at).phase_fraction,
    phase: MOON_PHASES[bucket],
  };
}

function localDate(instant: Date, timeZone: string): string {
  return format(new TZDate(instant, timeZone), 'yyyy-MM-dd');
}

/** Global eclipses (visible somewhere on Earth, not necessarily at the user's location) in a calendar year. */
export function getEclipsesInYear(year: number, timeZone: string): Eclipse[] {
  const rangeStart = `${year}-01-01`;
  const rangeEnd = `${year}-12-31`;
  const searchFrom = new Date(Date.UTC(year - 1, 11, 25));
  const eclipses: Eclipse[] = [];

  let lunar = SearchLunarEclipse(searchFrom);
  while (localDate(lunar.peak.date, timeZone) <= rangeEnd) {
    const date = localDate(lunar.peak.date, timeZone);
    if (date >= rangeStart) {
      eclipses.push({ type: 'lunar', kind: lunar.kind, peak: lunar.peak.date, date });
    }
    lunar = NextLunarEclipse(lunar.peak);
  }

  let solar = SearchGlobalSolarEclipse(searchFrom);
  while (localDate(solar.peak.date, timeZone) <= rangeEnd) {
    const date = localDate(solar.peak.date, timeZone);
    if (date >= rangeStart) {
      eclipses.push({ type: 'solar', kind: solar.kind, peak: solar.peak.date, date });
    }
    solar = NextGlobalSolarEclipse(solar.peak);
  }

  return eclipses.sort((a, b) => a.peak.getTime() - b.peak.getTime());
}
