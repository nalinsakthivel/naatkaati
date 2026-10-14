import { configureStore } from '@reduxjs/toolkit';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import {
  initialSettingsState,
  isAppearance,
  isLanguage,
  settingsReducer,
  type SettingsState,
} from './slices/settingsSlice';

function loadSettings(): SettingsState {
  const appearance = LocalStore.getString(StorageKeys.appearance);
  const language = LocalStore.getString(StorageKeys.language);
  const tamilNumerals = LocalStore.getString(StorageKeys.tamilNumerals);
  return {
    appearance: isAppearance(appearance) ? appearance : initialSettingsState.appearance,
    language: isLanguage(language) ? language : initialSettingsState.language,
    tamilNumerals:
      tamilNumerals === undefined ? initialSettingsState.tamilNumerals : tamilNumerals === 'true',
  };
}

export const store = configureStore({
  reducer: { settings: settingsReducer },
  preloadedState: { settings: loadSettings() },
});

store.subscribe(() => {
  const { appearance, language, tamilNumerals } = store.getState().settings;
  LocalStore.setString(StorageKeys.appearance, appearance);
  LocalStore.setString(StorageKeys.language, language);
  LocalStore.setString(StorageKeys.tamilNumerals, String(tamilNumerals));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
