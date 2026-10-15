import { configureStore } from '@reduxjs/toolkit';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import { parseReminderKeys, remindersReducer } from './slices/remindersSlice';
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
    onboardingDone: LocalStore.getString(StorageKeys.onboardingDone) === 'true',
  };
}

export const store = configureStore({
  reducer: { settings: settingsReducer, reminders: remindersReducer },
  preloadedState: {
    settings: loadSettings(),
    reminders: { keys: parseReminderKeys(LocalStore.getString(StorageKeys.reminders)) },
  },
});

store.subscribe(() => {
  const { appearance, language, tamilNumerals, holidayCategories, newYearLabel, onboardingDone } =
    store.getState().settings;
  LocalStore.setString(StorageKeys.appearance, appearance);
  LocalStore.setString(StorageKeys.language, language);
  LocalStore.setString(StorageKeys.tamilNumerals, String(tamilNumerals));
  LocalStore.setString(StorageKeys.holidayCategories, holidayCategories.join(','));
  LocalStore.setString(StorageKeys.newYearLabel, newYearLabel);
  LocalStore.setString(StorageKeys.onboardingDone, String(onboardingDone));
  LocalStore.setString(StorageKeys.reminders, store.getState().reminders.keys.join(','));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
