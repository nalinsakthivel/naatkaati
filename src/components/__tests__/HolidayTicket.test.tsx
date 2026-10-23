import { fireEvent, render } from '@testing-library/react-native';
import { HolidayTicket } from '../HolidayTicket';
import { LightColors } from '@/themes/Colors';

it('opens a listed occasion without requiring a tiny calendar-cell tap', async () => {
  const onPress = jest.fn();
  const screen = await render(
    <HolidayTicket dateLabel="15 Jan" name="Pongal" colors={LightColors} onPress={onPress} />,
  );
  await fireEvent.press(screen.getByRole('button', { name: '15 Jan, Pongal' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
