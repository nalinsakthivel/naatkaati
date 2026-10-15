import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { NaatkaatiWidget } from '@/widget/NaatkaatiWidget';
import { loadWidgetSnapshot, WIDGET_NAME } from './widgetData';

/** Re-renders any placed widgets with today's data. Android only; a no-op elsewhere. */
export async function refreshWidgets(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: () => {
        const snapshot = loadWidgetSnapshot();
        return snapshot ? (
          <NaatkaatiWidget model={snapshot.model} yearLabel={snapshot.yearLabel} />
        ) : (
          <></>
        );
      },
    });
  } catch {
    // No widget placed, or the widget host is unavailable: nothing to refresh.
  }
}
