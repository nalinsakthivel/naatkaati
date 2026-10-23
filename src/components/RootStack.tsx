import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppColors, useAppSelector } from '@/stores/hooks';

/** Root navigator. Onboarding is shown until it is finished or skipped, then never again. */
export function RootStack() {
  const colors = useAppColors();
  const { t } = useTranslation();
  const onboardingDone = useAppSelector((state) => state.settings.onboardingDone);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!onboardingDone}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={onboardingDone}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[date]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="about" options={{ headerShown: true, title: t('about.title') }} />
      </Stack.Protected>
    </Stack>
  );
}
