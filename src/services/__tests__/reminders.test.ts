import * as Notifications from 'expo-notifications';
import { cancelReminder, scheduleReminder } from '../reminders';

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date', YEARLY: 'yearly' },
}));

const mocked = jest.mocked(Notifications);
const content = { title: 'Pongal', body: 'Holiday', channelName: 'Reminders' };
const future = new Date().getFullYear() + 1;

beforeEach(() => jest.clearAllMocks());

describe('scheduleReminder', () => {
  it('asks for permission, then schedules when granted', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true } as never);
    mocked.requestPermissionsAsync.mockResolvedValue({ granted: true } as never);
    const result = await scheduleReminder(
      { key: 'h:a', kind: 'once', year: future, month: 1, day: 15 },
      content,
    );
    expect(result).toBe('scheduled');
    expect(mocked.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 'h:a' }),
    );
  });

  it('does not ask again when already granted', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never);
    await scheduleReminder({ key: 'h:a', kind: 'once', year: future, month: 1, day: 15 }, content);
    expect(mocked.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('returns denied and schedules nothing when permission is refused', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true } as never);
    mocked.requestPermissionsAsync.mockResolvedValue({ granted: false } as never);
    const result = await scheduleReminder(
      { key: 'h:a', kind: 'once', year: future, month: 1, day: 15 },
      content,
    );
    expect(result).toBe('denied');
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('returns denied without prompting when the system will not ask again', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: false } as never);
    const result = await scheduleReminder(
      { key: 'h:a', kind: 'once', year: future, month: 1, day: 15 },
      content,
    );
    expect(result).toBe('denied');
    expect(mocked.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('returns past for a one-off date that has gone', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never);
    const result = await scheduleReminder(
      { key: 'h:a', kind: 'once', year: 2000, month: 1, day: 1 },
      content,
    );
    expect(result).toBe('past');
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules a yearly trigger for a commemoration', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never);
    await scheduleReminder({ key: 'c:b', kind: 'yearly', month: 9, day: 17 }, content);
    expect(mocked.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ type: 'yearly', month: 8, day: 17 }),
      }),
    );
  });
});

describe('cancelReminder', () => {
  it('cancels by key', async () => {
    await cancelReminder('h:a');
    expect(mocked.cancelScheduledNotificationAsync).toHaveBeenCalledWith('h:a');
  });
});
