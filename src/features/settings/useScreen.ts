import { useState } from 'react';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppliesTo } from '@/calendar/holidays';
import type { NewYearLabel } from '@/calendar/tamilNewYear';
import type { ChoiceOption } from '@/components/native/ChoiceSheet';
import { RouteEnum } from '@/enums/RouteEnum';
import { maybeSync } from '@/services/syncTrigger';
import { useAppColors, useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  setAppearance,
  setDataSaver,
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

type PickerKind = 'appearance' | 'language' | 'newYear';

export function useSettingsScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { appearance, language, tamilNumerals, holidayCategories, newYearLabel, dataSaver } =
    useAppSelector((state) => state.settings);
  const syncStatus = useAppSelector((state) => state.data.syncStatus);
  const [picker, setPicker] = useState<PickerKind | null>(null);

  const appearanceOptions: ChoiceOption<Appearance>[] = [
    { value: 'system', label: t('settings.appearanceSystem') },
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
  ];
  // Language names are shown in their own language, never translated.
  const languageOptions: ChoiceOption<Language>[] = [
    { value: 'ta', label: 'தமிழ்' },
    { value: 'en', label: 'English' },
  ];
  const newYearOptions: ChoiceOption<NewYearLabel>[] = [
    { value: 'thai', label: t('settings.newYearThai') },
    { value: 'chithirai', label: t('settings.newYearChithirai') },
  ];
  const categoryRows = CATEGORY_LABEL_KEYS.map(([category, labelKey]) => ({
    category,
    label: t(labelKey),
    enabled: holidayCategories.includes(category),
  }));

  const labelOf = <T extends string>(options: readonly ChoiceOption<T>[], value: T) =>
    options.find((option) => option.value === value)?.label ?? '';

  return {
    title: t('screens.settings'),
    versionLabel: t('about.version', { version: Constants.expoConfig?.version ?? '' }),
    appearanceValueLabel: labelOf(appearanceOptions, appearance),
    languageValueLabel: labelOf(languageOptions, language),
    newYearValueLabel: labelOf(newYearOptions, newYearLabel),
    picker,
    openPicker: (kind: PickerKind) => () => setPicker(kind),
    closePicker: () => setPicker(null),
    colors,
    topInset: insets.top,
    labels: {
      display: t('settings.display'),
      appearance: t('settings.appearance'),
      language: t('settings.language'),
      tamilNumerals: t('settings.tamilNumerals'),
      holidays: t('settings.holidays'),
      newYear: t('settings.newYear'),
      data: t('data.section'),
      wifiOnly: t('data.wifiOnly'),
      updateNow: t('data.updateNow'),
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
    dataSaver,
    syncStatusLabel: t(`data.${syncStatus}`),
    onDataSaverChange: (value: boolean) => dispatch(setDataSaver(value)),
    onUpdateNow: () => {
      maybeSync(true);
    },
    onAppearanceChange: (value: Appearance) => dispatch(setAppearance(value)),
    onLanguageChange: (value: Language) => dispatch(setLanguage(value)),
    onTamilNumeralsChange: (value: boolean) => dispatch(setTamilNumerals(value)),
    onNewYearChange: (value: NewYearLabel) => dispatch(setNewYearLabel(value)),
    onCategoryChange: (category: AppliesTo, enabled: boolean) =>
      dispatch(setHolidayCategory({ category, enabled })),
    onOpenAbout: () => router.push({ pathname: RouteEnum.About }),
  };
}
