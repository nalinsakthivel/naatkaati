import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Splash } from '@/components/Splash';
import { useAppColors, useAppSelector } from '@/stores/hooks';
import { FontFamily } from '@/themes/Theme';
import { useState } from 'react';

/** Splash first, then onboarding (once), then the tabs. Day detail, About and Widgets push on top. */
export function RootStack() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const onboardingDone = useAppSelector((state) => state.settings.onboardingDone);
  const [splashDone, setSplashDone] = useState(false);
  const pushed = {
    headerShown: true,
    title: '',
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.primary,
    headerTitleStyle: { fontFamily: FontFamily.displaySemiBold, color: colors.text },
  } as const;
  if (!splashDone) return <Splash onComplete={() => setSplashDone(true)} />;
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Protected guard={!onboardingDone}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={onboardingDone}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[date]" options={pushed} />
        <Stack.Screen name="about" options={{ ...pushed, title: t('about.title') }} />
        <Stack.Screen name="widgets" options={{ ...pushed, title: t('widgets.title') }} />
      </Stack.Protected>
    </Stack>
  );
}
