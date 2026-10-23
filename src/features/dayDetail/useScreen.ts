import { useLocalSearchParams, useRouter } from 'expo-router';
import { isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { getTodayIso, shiftIsoDate } from '@/calendar/today';
import { useClock } from '@/hooks/useClock';
import { AppConstants } from '@/constants/AppConstants';
import { isoDateSchema } from '@/schemas/common';
import { useDayView } from './useDayView';

export function useDayDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const parsed = isoDateSchema.safeParse(date);
  const validIso = parsed.success && isValid(parseISO(parsed.data)) ? parsed.data : null;
  const todayIso = getTodayIso(useClock(), AppConstants.defaultLocation.timeZone);
  // A malformed route param falls back to today so the screen never crashes.
  const iso = validIso ?? todayIso;
  const view = useDayView(iso);
  const goTo = (target: string) => router.setParams({ date: target });

  return {
    ...view,
    title: t('screens.dayDetail'),
    navigation: {
      previousLabel: t('day.previous'),
      nextLabel: t('day.next'),
      todayLabel: t('calendar.today'),
      isToday: iso === todayIso,
      onPrevious: () => goTo(shiftIsoDate(iso, -1)),
      onNext: () => goTo(shiftIsoDate(iso, 1)),
      onToday: () => goTo(todayIso),
    },
    invalidDateLabel: validIso ? null : t('day.invalidDate'),
    isToday: iso === todayIso,
    jumpLabel: t('today.jumpToToday'),
    onNextDay: () => goTo(shiftIsoDate(iso, 1)),
    onPreviousDay: () => goTo(shiftIsoDate(iso, -1)),
    onJumpToToday: () => goTo(todayIso),
  };
}
