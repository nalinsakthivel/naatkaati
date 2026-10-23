import { useState } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ReminderSpec } from '@/calendar/reminders';
import { cancelReminder, scheduleReminder } from '@/services/reminders';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { reminderAdded, reminderRemoved } from '@/stores/slices/remindersSlice';

export interface ReminderRequest {
  spec: ReminderSpec;
  title: string;
  body: string;
}

/** Turns reminders on and off. Permission is asked only when the first reminder is switched on. */
export function useReminders() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const keys = useAppSelector((state) => state.reminders.keys);
  const [message, setMessage] = useState<'denied' | 'past' | 'failed' | null>(null);

  const isOn = (key: string) => keys.includes(key);

  const toggle = async (request: ReminderRequest, enabled: boolean) => {
    setMessage(null);
    try {
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
    } catch {
      setMessage('failed');
    }
  };

  return {
    isOn,
    toggle,
    switchLabel: t('reminder.remindMe'),
    message: message ? t(`reminder.${message}`) : null,
    openSettingsLabel: message === 'denied' ? t('reminder.openSettings') : null,
    onOpenSettings: async () => {
      try {
        await Linking.openSettings();
      } catch {
        setMessage('failed');
      }
    },
  };
}
