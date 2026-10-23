import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo';

/** Register the next inexact Chennai-midnight refresh whenever a widget reads its snapshot. */
export function scheduleWidgetMidnightRefresh(): void {
  if (Platform.OS !== 'android') return;
  requireOptionalNativeModule<{ scheduleNextRefresh(): void }>(
    'WidgetRefresh',
  )?.scheduleNextRefresh();
}
