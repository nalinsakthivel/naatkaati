import { ActivityAction, startActivityAsync } from 'expo-intent-launcher';
import { getCalendars } from 'expo-localization';
import { Platform } from 'react-native';
import { getAutoTimeStatus } from '../../modules/auto-time';

export { getAutoTimeStatus };

export function getDeviceTimeZone(): string | null {
  return getCalendars()[0]?.timeZone ?? null;
}

export async function openDateSettings(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await startActivityAsync(ActivityAction.DATE_SETTINGS);
}
