import { NaatkaatiWidget } from '@/widget/NaatkaatiWidget';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { loadWidgetSnapshot, WIDGET_NAME } from './widgetData';

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
  } catch {}
}
