import { useLocalSearchParams } from 'expo-router';
import { isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { isoDateSchema } from '@/schemas/common';
import { useDayView } from './useDayView';

export function useDayDetailScreen() {
  const { t } = useTranslation();
  const { date } = useLocalSearchParams<{ date: string }>();
  const parsed = isoDateSchema.safeParse(date);
  const validIso = parsed.success && isValid(parseISO(parsed.data)) ? parsed.data : null;
  // A malformed route param falls back to today so the screen never crashes.
  const iso = validIso ?? getTodayIso(new Date(), AppConstants.defaultLocation.timeZone);
  const view = useDayView(iso);
  return { ...view, invalidDateLabel: validIso ? null : t('day.invalidDate') };
}
