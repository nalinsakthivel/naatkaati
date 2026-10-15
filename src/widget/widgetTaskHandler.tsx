import type { WidgetModel } from '@/calendar/widgetModel';
import type { WidgetVariant } from '@/calendar/widgetVariants';
import type { ReactElement } from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { NaatkaatiWidget, type WidgetLabels } from './NaatkaatiWidget';

export interface WidgetSnapshot {
  model: WidgetModel;
  yearLabel: string;
  variant: WidgetVariant;
  labels: WidgetLabels;
}

export function createWidgetTaskHandler(loadSnapshot: () => WidgetSnapshot | null) {
  return async (props: WidgetTaskHandlerProps): Promise<void> => {
    if (props.widgetAction === 'WIDGET_DELETED' || props.widgetAction === 'WIDGET_CLICK') return;
    const snapshot = loadSnapshot();
    if (!snapshot) return;
    const widget: ReactElement = (
      <NaatkaatiWidget
        {...snapshot}
        size={{ width: props.widgetInfo.width, height: props.widgetInfo.height }}
      />
    );
    props.renderWidget(widget);
  };
}
