import type { PickerOption } from '@/components/native/SettingsPickerRow';
import { useAppColors, useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  setAppearance,
  setLanguage,
  setTamilNumerals,
  type Appearance,
  type Language,
} from '@/stores/slices/settingsSlice';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useSettingsScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { appearance, language, tamilNumerals } = useAppSelector((state) => state.settings);

  const appearanceOptions: PickerOption<Appearance>[] = [
    { value: 'system', label: t('settings.appearanceSystem') },
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
  ];

  const languageOptions: PickerOption<Language>[] = [
    { value: 'ta', label: 'தமிழ்' },
    { value: 'en', label: 'English' },
  ];

  return {
    title: t('screens.settings'),
    colors,
    topInset: insets.top,
    labels: {
      display: t('settings.display'),
      appearance: t('settings.appearance'),
      language: t('settings.language'),
      tamilNumerals: t('settings.tamilNumerals'),
    },
    appearance,
    language,
    tamilNumerals,
    appearanceOptions,
    languageOptions,
    onAppearanceChange: (value: Appearance) => dispatch(setAppearance(value)),
    onLanguageChange: (value: Language) => dispatch(setLanguage(value)),
    onTamilNumeralsChange: (value: boolean) => dispatch(setTamilNumerals(value)),
  };
}
