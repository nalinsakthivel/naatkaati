import { NaatkaatiWidget } from '@/widget/NaatkaatiWidget';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { loadWidgetSnapshot, WIDGET_NAME } from './widgetData';

export async function refreshWidgets(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: (widgetInfo) => {
        const snapshot = loadWidgetSnapshot();
        return snapshot ? (
          <NaatkaatiWidget
            {...snapshot}
            size={{ width: widgetInfo.width, height: widgetInfo.height }}
          />
        ) : (
          <></>
        );
      },
    });
  } catch {}
}
