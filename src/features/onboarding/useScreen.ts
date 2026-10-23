import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
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
  useEffect(() => {
    if (step === 0) return;
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      setStep(0);
      return true;
    });
    return () => listener.remove();
  }, [step]);
  const isLast = step === STEP_COUNT - 1;

  const finish = () => {
    dispatch(setOnboardingDone(true));
    router.replace({ pathname: RouteEnum.Today });
  };

  const languageOptions: ChoiceOption<Language>[] = [
    { value: 'ta', label: 'தமிழ்' },
    { value: 'en', label: 'English' },
  ];
  const appearanceOptions: ChoiceOption<Appearance>[] = [
    { value: 'system', label: t('settings.appearanceSystem') },
    { value: 'light', label: t('settings.appearanceLight') },
    { value: 'dark', label: t('settings.appearanceDark') },
  ];

  return {
    colors,
    welcomeTitle: t('app.name'),
    welcomeIntro: t('onboarding.intro'),
    backLabel: t('onboarding.back'),
    onBack: () => setStep((current) => Math.max(0, current - 1)),
    topInset: insets.top,
    bottomInset: insets.bottom,
    step,
    stepLabel: t('onboarding.step', { current: step + 1, total: STEP_COUNT }),
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
