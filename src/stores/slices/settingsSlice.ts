import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppliesTo } from '@/calendar/holidays';
import type { NewYearLabel } from '@/calendar/tamilNewYear';

export type Appearance = 'system' | 'light' | 'dark';
export type Language = 'ta' | 'en';

export const HOLIDAY_CATEGORIES: readonly AppliesTo[] = ['state_govt', 'central_govt', 'banks'];

export interface SettingsState {
  appearance: Appearance;
  language: Language;
  /** Tamil numerals apply to the Tamil date display only; Gregorian dates stay in Arabic numerals. */
  tamilNumerals: boolean;
  /** Holiday categories shown in the app. */
  holidayCategories: AppliesTo[];
  newYearLabel: NewYearLabel;
}

export const initialSettingsState: SettingsState = {
  appearance: 'system',
  language: 'ta',
  tamilNumerals: false,
  holidayCategories: [...HOLIDAY_CATEGORIES],
  newYearLabel: 'thai',
};

export function isAppearance(value: string | undefined): value is Appearance {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function isLanguage(value: string | undefined): value is Language {
  return value === 'ta' || value === 'en';
}

export function isNewYearLabel(value: string | undefined): value is NewYearLabel {
  return value === 'thai' || value === 'chithirai';
}

/** Parses a stored comma-separated category list. Unknown values are dropped; undefined gives all. */
export function parseHolidayCategories(value: string | undefined): AppliesTo[] {
  if (value === undefined) return [...HOLIDAY_CATEGORIES];
  return HOLIDAY_CATEGORIES.filter((category) => value.split(',').includes(category));
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    setAppearance(state, action: PayloadAction<Appearance>) {
      state.appearance = action.payload;
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setTamilNumerals(state, action: PayloadAction<boolean>) {
      state.tamilNumerals = action.payload;
    },
    setHolidayCategory(state, action: PayloadAction<{ category: AppliesTo; enabled: boolean }>) {
      const { category, enabled } = action.payload;
      const without = state.holidayCategories.filter((c) => c !== category);
      state.holidayCategories = enabled
        ? HOLIDAY_CATEGORIES.filter((c) => c === category || without.includes(c))
        : without;
    },
    setNewYearLabel(state, action: PayloadAction<NewYearLabel>) {
      state.newYearLabel = action.payload;
    },
  },
});

export const { setAppearance, setLanguage, setTamilNumerals, setHolidayCategory, setNewYearLabel } =
  settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
