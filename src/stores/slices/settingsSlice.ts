import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Appearance = 'system' | 'light' | 'dark';
export type Language = 'ta' | 'en';

export interface SettingsState {
  appearance: Appearance;
  language: Language;
  /** Tamil numerals apply to the Tamil date display only; Gregorian dates stay in Arabic numerals. */
  tamilNumerals: boolean;
}

export const initialSettingsState: SettingsState = {
  appearance: 'system',
  language: 'ta',
  tamilNumerals: false,
};

export function isAppearance(value: string | undefined): value is Appearance {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function isLanguage(value: string | undefined): value is Language {
  return value === 'ta' || value === 'en';
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
  },
});

export const { setAppearance, setLanguage, setTamilNumerals } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
