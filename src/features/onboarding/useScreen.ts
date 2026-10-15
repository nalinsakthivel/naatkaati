import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ChoiceOption } from '@/components/native/ChoiceSheet';
import { RouteEnum } from '@/enums/RouteEnum';
import { useAppColors, useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  setAppearance,
  setLanguage,
  setOnboardingDone,
  type Appearance,
  type Language,
} from '@/stores/slices/settingsSlice';

const STEP_COUNT = 2;

export function useOnboardingScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { appearance, language } = useAppSelector((state) => state.settings);
  const [step, setStep] = useState(0);
  const isLast = step === STEP_COUNT - 1;

  const finish = () => {
    dispatch(setOnboardingDone(true));
    router.replace({ pathname: RouteEnum.Today });
  };

  const languageOptions: ChoiceOption<Language>[] = [
    { value: 'ta', label: 'தமிழ்', detail: 'Tamil' },
    { value: 'en', label: 'English', detail: 'ஆங்கிலம்' },
  ];
  const appearanceOptions: ChoiceOption<Appearance>[] = [
    { value: 'system', label: t('settings.appearanceSystem') },
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
  ];

  return {
    colors,
    topInset: insets.top,
    bottomInset: insets.bottom,
    step,
    stepLabel: t('onboarding.step', { current: step + 1, total: STEP_COUNT }),
    stepNumber: step,
    stepCount: STEP_COUNT,
    kicker: t('splash.name'),
    eyebrow: step === 0 ? t('onboarding.languageEyebrow') : t('onboarding.appearanceEyebrow'),
    privacy: t('onboarding.privacy'),
    title: step === 0 ? t('onboarding.languageTitle') : t('onboarding.appearanceTitle'),
    hint: step === 0 ? t('onboarding.languageHint') : t('onboarding.appearanceHint'),
    languageOptions,
    appearanceOptions,
    language,
    appearance,
    onLanguageChange: (value: Language) => dispatch(setLanguage(value)),
    onAppearanceChange: (value: Appearance) => dispatch(setAppearance(value)),
    primaryLabel: isLast ? t('onboarding.done') : t('onboarding.next'),
    skipLabel: t('onboarding.skip'),
    onPrimary: isLast ? finish : () => setStep(step + 1),
    onSkip: finish,
  };
}
