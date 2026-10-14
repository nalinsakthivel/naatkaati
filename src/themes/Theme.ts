/**
 * Naatkaati non-color design tokens: typography, spacing, radius, elevation, motion.
 *
 * Typography concept:
 * - Catamaran: display + headings. Its heavy weights make the big Tamil date the
 *   one memorable element of the app.
 * - Noto Sans Tamil: body text, lists, kural meanings. Best coverage and legibility.
 * Both cover Tamil and Latin, so Tamil and English never mix fonts in one line.
 *
 * Tamil needs more vertical room than Latin (vowel signs above and below the line),
 * so line heights are ~1.5x font size. Never reduce them.
 */

import { TextStyle } from 'react-native';

// Must match the names loaded via expo-font / @expo-google-fonts in app/_layout.tsx
export const FontFamily = {
  displayBold: 'Catamaran_800ExtraBold',
  displaySemiBold: 'Catamaran_600SemiBold',
  bodyRegular: 'NotoSansTamil_400Regular',
  bodyMedium: 'NotoSansTamil_500Medium',
  bodySemiBold: 'NotoSansTamil_600SemiBold',
} as const;

type TypeToken = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'>;

export const Typography = {
  /** The Tamil date numeral on the Today screen — the hero of the app */
  heroDate: { fontFamily: FontFamily.displayBold, fontSize: 88, lineHeight: 96, letterSpacing: -1 },
  /** Tamil month + year under the hero date, e.g. "ஐப்பசி 28, திருவள்ளுவர் ஆண்டு 2057" */
  heroCaption: { fontFamily: FontFamily.displaySemiBold, fontSize: 20, lineHeight: 30 },
  title: { fontFamily: FontFamily.displayBold, fontSize: 24, lineHeight: 36 },
  heading: { fontFamily: FontFamily.displaySemiBold, fontSize: 18, lineHeight: 28 },
  /** Thirukkural couplet text */
  kural: { fontFamily: FontFamily.bodySemiBold, fontSize: 18, lineHeight: 30 },
  body: { fontFamily: FontFamily.bodyRegular, fontSize: 16, lineHeight: 26 },
  bodyStrong: { fontFamily: FontFamily.bodyMedium, fontSize: 16, lineHeight: 26 },
  caption: { fontFamily: FontFamily.bodyRegular, fontSize: 13, lineHeight: 20 },
  /** Month grid: English (Gregorian) day number */
  gridDay: { fontFamily: FontFamily.displaySemiBold, fontSize: 18, lineHeight: 24 },
  /** Month grid: small Tamil date under the English number */
  gridTamilDay: { fontFamily: FontFamily.bodyRegular, fontSize: 11, lineHeight: 16 },
  button: { fontFamily: FontFamily.bodySemiBold, fontSize: 16, lineHeight: 24 },
} satisfies Record<string, TypeToken>;

/** 4-point spacing scale */
export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Radius varies by hierarchy — not one value for everything */
export const Radius = {
  cell: 10, // month grid day cell
  chip: 999, // category chips (holiday / cultural / commemoration)
  card: 16, // occasion cards, kural card
  sheet: 24, // bottom sheets
  banner: 12, // timezone / announcement banners
} as const;

/** Flat by default; elevation only for things that float above content */
export const Elevation = {
  none: { elevation: 0 },
  floating: { elevation: 4 }, // FAB, bottom sheet
} as const;

export const Layout = {
  screenPaddingH: Spacing.lg,
  minTouchTarget: 48, // Android accessibility minimum
  monthGridColumns: 7,
  maxContentWidth: 640, // tablets / foldables
} as const;

export const Motion = {
  fast: 150,
  normal: 250,
  // Only user-triggered motion (month swipe, sheet open). No decorative entrance animations.
} as const;

export const Theme = {
  FontFamily,
  Typography,
  Spacing,
  Radius,
  Elevation,
  Layout,
  Motion,
} as const;
