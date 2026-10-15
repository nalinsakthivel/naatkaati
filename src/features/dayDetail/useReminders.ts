import type { ReminderSpec } from '@/calendar/reminders';
import { cancelReminder, scheduleReminder } from '@/services/reminders';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { reminderAdded, reminderRemoved } from '@/stores/slices/remindersSlice';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

export interface ReminderRequest {
  spec: ReminderSpec;
  title: string;
  body: string;
}

export function useReminders() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const keys = useAppSelector((state) => state.reminders.keys);
  const [message, setMessage] = useState<'denied' | 'past' | null>(null);

  const isOn = (key: string) => keys.includes(key);

  const toggle = async (request: ReminderRequest, enabled: boolean) => {
    setMessage(null);
    if (!enabled) {
      await cancelReminder(request.spec.key);
      dispatch(reminderRemoved(request.spec.key));
      return;
    }
    const result = await scheduleReminder(request.spec, {
      title: request.title,
      body: request.body,
      channelName: t('reminder.channel'),
    });
    if (result === 'scheduled') dispatch(reminderAdded(request.spec.key));
    else setMessage(result);
  };

  return {
    isOn,
    toggle,
    switchLabel: t('reminder.remindMe'),
    message:
      message === 'denied' ? t('reminder.denied') : message === 'past' ? t('reminder.past') : null,
    openSettingsLabel: message === 'denied' ? t('reminder.openSettings') : null,
    onOpenSettings: () => Linking.openSettings(),
  };
}
