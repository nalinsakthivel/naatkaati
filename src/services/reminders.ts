import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { planReminder, type ReminderSpec } from '@/calendar/reminders';
import { AppConstants } from '@/constants/AppConstants';

const CHANNEL_ID = 'reminders';

export type ScheduleResult = 'scheduled' | 'denied' | 'past';

async function ensureChannel(channelName: string): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: channelName,
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/** Asks for notification permission. Called only when the user sets their first reminder. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** Schedules an inexact, day-level reminder. Never uses exact alarms. */
export async function scheduleReminder(
  spec: ReminderSpec,
  content: { title: string; body: string; channelName: string },
): Promise<ScheduleResult> {
  const plan = planReminder(spec, new Date(), AppConstants.reminderHour);
  if (!plan) return 'past';
  // Android 13+ needs a channel before its notification permission prompt can appear.
  await ensureChannel(content.channelName);
  if (!(await ensureNotificationPermission())) return 'denied';
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
