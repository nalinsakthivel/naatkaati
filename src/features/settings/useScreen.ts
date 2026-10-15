import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppliesTo } from '@/calendar/holidays';
import type { NewYearLabel } from '@/calendar/tamilNewYear';
import type { PickerOption } from '@/components/native/SettingsPickerRow';
import { RouteEnum } from '@/enums/RouteEnum';
import { useAppColors, useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  setAppearance,
  setHolidayCategory,
  setLanguage,
  setNewYearLabel,
  setTamilNumerals,
  type Appearance,
  type Language,
} from '@/stores/slices/settingsSlice';

const CATEGORY_LABEL_KEYS = [
  ['state_govt', 'settings.categoryState'],
  ['central_govt', 'settings.categoryCentral'],
  ['banks', 'settings.categoryBanks'],
] as const satisfies readonly (readonly [AppliesTo, string])[];

export function useSettingsScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { appearance, language, tamilNumerals, holidayCategories, newYearLabel } = useAppSelector(
    (state) => state.settings,
  );

  const appearanceOptions: PickerOption<Appearance>[] = [
    { value: 'system', label: t('settings.appearanceSystem') },
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
  ];
  // Language names are shown in their own language, never translated.
  const languageOptions: PickerOption<Language>[] = [
    { value: 'ta', label: 'தமிழ்' },
    { value: 'en', label: 'English' },
  ];
  const newYearOptions: PickerOption<NewYearLabel>[] = [
    { value: 'thai', label: t('settings.newYearThai') },
    { value: 'chithirai', label: t('settings.newYearChithirai') },
  ];
  const categoryRows = CATEGORY_LABEL_KEYS.map(([category, labelKey]) => ({
    category,
    label: t(labelKey),
    enabled: holidayCategories.includes(category),
  }));

  return {
    title: t('screens.settings'),
    colors,
    topInset: insets.top,
    labels: {
      display: t('settings.display'),
      appearance: t('settings.appearance'),
      language: t('settings.language'),
      tamilNumerals: t('settings.tamilNumerals'),
      holidays: t('settings.holidays'),
      newYear: t('settings.newYear'),
      aboutSection: t('settings.aboutSection'),
      about: t('settings.about'),
    },
    appearance,
    language,
    tamilNumerals,
    newYearLabel,
    appearanceOptions,
    languageOptions,
    newYearOptions,
    categoryRows,
    onAppearanceChange: (value: Appearance) => dispatch(setAppearance(value)),
    onLanguageChange: (value: Language) => dispatch(setLanguage(value)),
    onTamilNumeralsChange: (value: boolean) => dispatch(setTamilNumerals(value)),
    onNewYearChange: (value: NewYearLabel) => dispatch(setNewYearLabel(value)),
    onCategoryChange: (category: AppliesTo, enabled: boolean) =>
      dispatch(setHolidayCategory({ category, enabled })),
    onOpenAbout: () => router.push({ pathname: RouteEnum.About }),
  };
}
