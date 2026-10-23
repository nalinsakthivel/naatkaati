import { act, renderHook } from '@testing-library/react-native';
import { useReminders } from '../useReminders';
import { scheduleReminder, cancelReminder } from '@/services/reminders';

const mockDispatch = jest.fn();
jest.mock('@/stores/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ['h:test'],
}));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock('@/services/reminders', () => ({
  scheduleReminder: jest.fn(),
  cancelReminder: jest.fn(),
}));
const request = {
  spec: { key: 'h:test', kind: 'once' as const, year: 2027, month: 1, day: 15 },
  title: 'Pongal',
  body: 'Holiday',
};
beforeEach(() => jest.clearAllMocks());

it.each([true, false])(
  'shows a recoverable message when reminder enabled=%s fails',
  async (enabled) => {
    jest.mocked(scheduleReminder).mockRejectedValue(new Error('service unavailable'));
    jest.mocked(cancelReminder).mockRejectedValue(new Error('service unavailable'));
    const hook = await renderHook(() => useReminders());
    await act(async () => {
      await hook.result.current.toggle(request, enabled);
    });
    expect(hook.result.current.message).toBe('reminder.failed');
    expect(mockDispatch).not.toHaveBeenCalled();
  },
);
