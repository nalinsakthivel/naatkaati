import { configureStore } from '@reduxjs/toolkit';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import {
  initialSettingsState,
  isAppearance,
  isLanguage,
  isNewYearLabel,
  parseHolidayCategories,
  settingsReducer,
  type SettingsState,
} from './slices/settingsSlice';

function loadSettings(): SettingsState {
  const appearance = LocalStore.getString(StorageKeys.appearance);
  const language = LocalStore.getString(StorageKeys.language);
  const tamilNumerals = LocalStore.getString(StorageKeys.tamilNumerals);
  const newYearLabel = LocalStore.getString(StorageKeys.newYearLabel);
  return {
    appearance: isAppearance(appearance) ? appearance : initialSettingsState.appearance,
    language: isLanguage(language) ? language : initialSettingsState.language,
    tamilNumerals:
      tamilNumerals === undefined ? initialSettingsState.tamilNumerals : tamilNumerals === 'true',
    holidayCategories: parseHolidayCategories(LocalStore.getString(StorageKeys.holidayCategories)),
    newYearLabel: isNewYearLabel(newYearLabel) ? newYearLabel : initialSettingsState.newYearLabel,
  };
}

export const store = configureStore({
  reducer: { settings: settingsReducer },
  preloadedState: { settings: loadSettings() },
});

store.subscribe(() => {
  const { appearance, language, tamilNumerals, holidayCategories, newYearLabel } =
    store.getState().settings;
  LocalStore.setString(StorageKeys.appearance, appearance);
  LocalStore.setString(StorageKeys.language, language);
  LocalStore.setString(StorageKeys.tamilNumerals, String(tamilNumerals));
  LocalStore.setString(StorageKeys.holidayCategories, holidayCategories.join(','));
  LocalStore.setString(StorageKeys.newYearLabel, newYearLabel);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
