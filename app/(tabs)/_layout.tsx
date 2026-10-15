import { Tabs } from 'expo-router';
import { NavigationDock } from '@/components/NavigationDock';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <NavigationDock {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="holidays" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
