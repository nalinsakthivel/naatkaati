import type { AppliesTo } from '@/calendar/holidays';
import type { NewYearLabel } from '@/calendar/tamilNewYear';
import {
  DEFAULT_WIDGET_VARIANT,
  toggleWidgetFavorite,
  type WidgetVariant,
} from '@/calendar/widgetVariants';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Appearance = 'system' | 'light' | 'dark';
export type Language = 'ta' | 'en';

export const HOLIDAY_CATEGORIES: readonly AppliesTo[] = ['state_govt', 'central_govt', 'banks'];

export interface SettingsState {
  appearance: Appearance;
  language: Language;
  tamilNumerals: boolean;
  holidayCategories: AppliesTo[];
  newYearLabel: NewYearLabel;
  onboardingDone: boolean;
  dataSaver: boolean;
  widgetVariant: WidgetVariant;
  widgetFavorites: WidgetVariant[];
}

export const initialSettingsState: SettingsState = {
  appearance: 'system',
  language: 'ta',
  tamilNumerals: false,
  holidayCategories: [...HOLIDAY_CATEGORIES],
  newYearLabel: 'thai',
  onboardingDone: false,
  dataSaver: false,
  widgetVariant: DEFAULT_WIDGET_VARIANT,
  widgetFavorites: [DEFAULT_WIDGET_VARIANT],
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
    setDataSaver(state, action: PayloadAction<boolean>) {
      state.dataSaver = action.payload;
    },
    setOnboardingDone(state, action: PayloadAction<boolean>) {
      state.onboardingDone = action.payload;
    },
    setWidgetVariant(state, action: PayloadAction<WidgetVariant>) {
      state.widgetVariant = action.payload;
    },
    toggleFavoriteWidget(state, action: PayloadAction<WidgetVariant>) {
      state.widgetFavorites = toggleWidgetFavorite(state.widgetFavorites, action.payload);
    },
    setNewYearLabel(state, action: PayloadAction<NewYearLabel>) {
      state.newYearLabel = action.payload;
    },
  },
});

export const {
  setAppearance,
  setLanguage,
  setTamilNumerals,
  setHolidayCategory,
  setNewYearLabel,
  setOnboardingDone,
  setDataSaver,
  setWidgetVariant,
  toggleFavoriteWidget,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
