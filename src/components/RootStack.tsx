import { useAppColors, useAppSelector } from '@/stores/hooks';
import { FontFamily } from '@/themes/Theme';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export function RootStack() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const onboardingDone = useAppSelector((state) => state.settings.onboardingDone);
  const pushed = {
    headerShown: true,
    title: '',
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.primary,
    headerTitleStyle: { fontFamily: FontFamily.displaySemiBold, color: colors.text },
  } as const;
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Protected guard={!onboardingDone}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={onboardingDone}>
        <Stack.Screen name="index" />
        <Stack.Screen name="calendar" options={{ ...pushed, title: t('tabs.calendar') }} />
        <Stack.Screen name="settings" options={{ ...pushed, title: t('tabs.settings') }} />
        <Stack.Screen name="day/[date]" options={pushed} />
        <Stack.Screen name="about" options={pushed} />
      </Stack.Protected>
    </Stack>
  );
}
