import type { WidgetModel } from '@/calendar/widgetModel';
import type { ReactElement } from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { NaatkaatiWidget } from './NaatkaatiWidget';

export interface WidgetSnapshot {
  model: WidgetModel;
  yearLabel: string;
}

export function createWidgetTaskHandler(loadSnapshot: () => WidgetSnapshot | null) {
  return async (props: WidgetTaskHandlerProps): Promise<void> => {
    if (props.widgetAction === 'WIDGET_DELETED' || props.widgetAction === 'WIDGET_CLICK') return;
    const snapshot = loadSnapshot();
    if (!snapshot) return;
    const widget: ReactElement = (
      <NaatkaatiWidget model={snapshot.model} yearLabel={snapshot.yearLabel} />
    );
    props.renderWidget(widget);
  };
}
