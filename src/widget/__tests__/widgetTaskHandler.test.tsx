import { createWidgetTaskHandler, type WidgetSnapshot } from '../widgetTaskHandler';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

jest.mock('../NaatkaatiWidget', () => ({ NaatkaatiWidget: () => null }));

const snapshot = (day: string): WidgetSnapshot => ({
  model: {
    day,
    monthName: 'Thai',
    year: '2057',
    holidayName: null,
    kuralNumber: '1',
    kuralLines: ['a', 'b'],
  },
  yearLabel: '2057',
});

describe('widget background task', () => {
  it('re-reads offline data on each update instead of keeping yesterday in memory', async () => {
    let current = snapshot('1');
    const handler = createWidgetTaskHandler(() => current);
    const rendered: unknown[] = [];
    const props = {
      widgetAction: 'WIDGET_UPDATE',
      renderWidget: (element: unknown) => rendered.push(element),
    } as unknown as WidgetTaskHandlerProps;
    await handler(props);
    current = snapshot('2');
    await handler(props);
    expect(rendered).toEqual([
      expect.objectContaining({ props: expect.objectContaining({ model: snapshot('1').model }) }),
      expect.objectContaining({ props: expect.objectContaining({ model: snapshot('2').model }) }),
    ]);
  });

  it.each(['WIDGET_DELETED', 'WIDGET_CLICK'] as const)('ignores %s', async (widgetAction) => {
    const load = jest.fn(() => snapshot('1'));
    const renderWidget = jest.fn();
    await createWidgetTaskHandler(load)({
      widgetAction,
      renderWidget,
    } as unknown as WidgetTaskHandlerProps);
    expect(load).not.toHaveBeenCalled();
    expect(renderWidget).not.toHaveBeenCalled();
  });

  it('does not render an unsupported date', async () => {
    const renderWidget = jest.fn();
    await createWidgetTaskHandler(() => null)({
      widgetAction: 'WIDGET_UPDATE',
      renderWidget,
    } as unknown as WidgetTaskHandlerProps);
    expect(renderWidget).not.toHaveBeenCalled();
  });
});
