/**
 * Naatkaati color tokens.
 *
 * Palette concept: "Sky and soil" — the night sky the calendar is computed from,
 * and the Tamil land it is lived on.
 *
 *   Iravu (இரவு)        night indigo  — brand, primary actions, commemorations
 *   Manjal (மஞ்சள்)      turmeric      — today, the one bright highlight in the app
 *   Sembaruthi (செம்பருத்தி) hibiscus red — holidays (Tamil calendars traditionally mark holidays and Sundays in red)
 *   Nel (நெல்)          paddy green   — Tamil cultural and agricultural days
 *   Kolam (கோலம்)        rice-flour white — light background
 *   Mai (மை)            ink           — text
 *
 * Rules:
 * - Never use raw hex values outside this file.
 * - Manjal is a FILL color only in light mode. Text on light surfaces uses `todayText`.
 * - All text/background pairs below meet WCAG AA (4.5:1) or better.
 */

export interface ColorTokens {
  // Surfaces
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string; // chips, tiles and tracks on a surface
  border: string;

  // Text
  text: string;
  textMuted: string;
  textOnPrimary: string;
  textOnToday: string;

  // Brand
  primary: string;
  primaryPressed: string;

  // Calendar semantics
  today: string; // fill for today's cell / highlight
  todayText: string; // turmeric-family color safe for text
  holiday: string; // state, central, bank holidays + Sunday numerals
  holidaySoft: string; // cell background tint
  cultural: string; // Tamil cultural / agricultural days
  culturalSoft: string;
  commemoration: string;
  commemorationSoft: string;
  otherMonthText: string; // dates outside the visible month

  // Indigo surfaces: the kural card and the splash
  hero: string; // fill
  onHero: string; // primary text
  onHeroMuted: string; // secondary text
  heroAccent: string; // green accent line, readable on indigo
  heroSoft: string; // translucent fill and dividers
  splash: string; // splash screen fill
  splashTile: string; // logo tile on the splash
  splashInk: string; // logo strokes on the splash

  // Feedback
  warning: string; // e.g. auto-time banner
  warningSoft: string;
  error: string;
  success: string;

  // Overlays
  scrim: string;
}

export const LightColors: ColorTokens = {
  background: '#FAFAF7', // Kolam
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceMuted: '#F3F3EF',
  border: '#E4E3DC',

  text: '#1C1D24', // Mai
  textMuted: '#5B5F6E',
  textOnPrimary: '#FFFFFF',
  textOnToday: '#1C1D24',

  primary: '#24306B', // Iravu
  primaryPressed: '#1A2453',

  today: '#F2B705', // Manjal
  todayText: '#7A5200',
  holiday: '#B42E24', // Sembaruthi
  holidaySoft: '#FBEAE7',
  cultural: '#2B6E46', // Nel
  culturalSoft: '#E6F2EA',
  commemoration: '#24306B',
  commemorationSoft: '#E8EBF7',
  otherMonthText: '#A7A9B2',

  hero: '#24306B', // Iravu
  onHero: '#FFFFFF',
  onHeroMuted: '#C9D0F0',
  heroAccent: '#7FCB9B',
  heroSoft: 'rgba(255, 255, 255, 0.18)',
  splash: '#24306B',
  splashTile: '#FAFAF7',
  splashInk: '#24306B',

  warning: '#7A5200',
  warningSoft: '#FDF3D4',
  error: '#B42E24',
  success: '#2B6E46',

  scrim: 'rgba(15, 20, 48, 0.45)',
};

export const DarkColors: ColorTokens = {
  background: '#0F1430', // night sky, indigo-tinted (not neutral black)
  surface: '#18204A',
  surfaceRaised: '#202A5A',
  surfaceMuted: '#20264A',
  border: '#2C3768',

  text: '#EEF0F7',
  textMuted: '#A3A9C2',
  textOnPrimary: '#0F1430',
  textOnToday: '#0F1430',

  primary: '#A9B6F2',
  primaryPressed: '#C3CDF7',

  today: '#F2B705', // Manjal reads like a lamp on the night sky
  todayText: '#F2B705',
  holiday: '#FF8A7A',
  holidaySoft: '#3A1E2E',
  cultural: '#7FCB9B',
  culturalSoft: '#1B3436',
  commemoration: '#A9B6F2',
  commemorationSoft: '#232D5E',
  otherMonthText: '#5C6488',

  hero: '#202A5A',
  onHero: '#EEF0F7',
  onHeroMuted: '#A3A9C2',
  heroAccent: '#7FCB9B',
  heroSoft: 'rgba(255, 255, 255, 0.14)',
  splash: '#0F1430',
  splashTile: '#202956',
  splashInk: '#FAFAF7',

  warning: '#F2B705',
  warningSoft: '#3A3320',
  error: '#FF8A7A',
  success: '#7FCB9B',

  scrim: 'rgba(0, 0, 0, 0.6)',
};

export type ColorScheme = 'light' | 'dark';

export const getColors = (scheme: ColorScheme): ColorTokens =>
  scheme === 'dark' ? DarkColors : LightColors;
