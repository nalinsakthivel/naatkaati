import { fireEvent, render } from '@testing-library/react-native';
import { DateNavigator } from '../DateNavigator';
import { MonthHeader } from '../MonthHeader';
import { LightColors } from '@/themes/Colors';

it('provides previous, next and return-to-today actions without swiping', async () => {
  const previous = jest.fn(),
    next = jest.fn(),
    today = jest.fn();
  const screen = await render(
    <DateNavigator
      previousLabel="Previous day"
      nextLabel="Next day"
      todayLabel="Today"
      isToday={false}
      onPrevious={previous}
      onNext={next}
      onToday={today}
      colors={LightColors}
    />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Previous day' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Next day' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Today' }));
  expect([previous.mock.calls.length, next.mock.calls.length, today.mock.calls.length]).toEqual([
    1, 1, 1,
  ]);
});

it('keeps month navigation disabled at the supported boundary', async () => {
  const previous = jest.fn();
  const screen = await render(
    <MonthHeader
      title="January 1901"
      subtitle="Margazhi – Thai"
      prevLabel="Previous month"
      nextLabel="Next month"
      jumpLabel="Choose month"
      todayLabel="Today"
      onPrev={previous}
      onNext={jest.fn()}
      onOpenJump={jest.fn()}
      onToday={jest.fn()}
      canGoPrev={false}
      colors={LightColors}
    />,
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Previous month', disabled: true }));
  expect(previous).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Today' })).toBeTruthy();
});
