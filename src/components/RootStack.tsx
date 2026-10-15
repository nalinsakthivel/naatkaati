import { useAppSelector } from '@/stores/hooks';
import { Stack } from 'expo-router';

export function RootStack() {
  const onboardingDone = useAppSelector((state) => state.settings.onboardingDone);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!onboardingDone}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={onboardingDone}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[date]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="about" options={{ headerShown: true, title: '' }} />
      </Stack.Protected>
    </Stack>
  );
}
