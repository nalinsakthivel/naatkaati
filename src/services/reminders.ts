import { planReminder, type ReminderSpec } from '@/calendar/reminders';
import { AppConstants } from '@/constants/AppConstants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'reminders';

export type ScheduleResult = 'scheduled' | 'denied' | 'past';

async function ensureChannel(channelName: string): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: channelName,
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleReminder(
  spec: ReminderSpec,
  content: { title: string; body: string; channelName: string },
): Promise<ScheduleResult> {
  if (!(await ensureNotificationPermission())) return 'denied';
  const plan = planReminder(spec, new Date(), AppConstants.reminderHour);
  if (!plan) return 'past';
  await ensureChannel(content.channelName);
  await Notifications.scheduleNotificationAsync({
    identifier: spec.key,
    content: { title: content.title, body: content.body },
    trigger:
      plan.type === 'date'
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: plan.date,
            channelId: CHANNEL_ID,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.YEARLY,
            month: plan.month,
            day: plan.day,
            hour: plan.hour,
            minute: plan.minute,
            channelId: CHANNEL_ID,
          },
  });
  return 'scheduled';
}

export async function cancelReminder(key: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(key);
}
