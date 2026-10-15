import { Stack } from 'expo-router';
import { RootProviders } from '@/components/RootProviders';

export default function RootLayout() {
  return (
    <RootProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="day/[date]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen name="about" options={{ headerShown: true, title: '' }} />
      </Stack>
    </RootProviders>
  );
}
