import type { ReactElement } from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import type { WidgetModel } from '@/calendar/widgetModel';
import { NaatkaatiWidget } from './NaatkaatiWidget';

export interface WidgetSnapshot {
  model: WidgetModel;
  yearLabel: string;
}

/**
 * Builds the widget task handler. Data loading is injected, so this module only imports
 * src/calendar types and the widget layout. Re-reading the date on every update keeps the
 * widget from ever showing yesterday.
 */
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
