import { useState } from 'react';
import { useClock } from '@/hooks/useClock';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTodayIso, shiftIsoDate } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { useDayView } from '@/features/dayDetail/useDayView';
import { useTimeBanner } from './useTimeBanner';
import { useUpcoming } from './useUpcoming';

export function useTodayScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const now = useClock();
  const [offset, setOffset] = useState(0);

  const todayIso = getTodayIso(now, AppConstants.defaultLocation.timeZone);
  const shownIso = shiftIsoDate(todayIso, offset);
  const view = useDayView(shownIso, offset === 0 ? now : undefined);
  const timeBanner = useTimeBanner();
  const upcoming = useUpcoming(shownIso);

  return {
    ...view,
    title: offset === 0 ? t('screens.today') : t('screens.dayDetail'),
    navigation: {
      previousLabel: t('day.previous'),
      nextLabel: t('day.next'),
      todayLabel: t('calendar.today'),
      isToday: offset === 0,
      onPrevious: () => setOffset((current) => current - 1),
      onNext: () => setOffset((current) => current + 1),
      onToday: () => setOffset(0),
    },
    timeBanner,
    upcoming,
    topInset: insets.top,
    locationLabel: t('today.location'),
    isToday: offset === 0,
    jumpLabel: t('today.jumpToToday'),
    onNextDay: () => setOffset((current) => current + 1),
    onPreviousDay: () => setOffset((current) => current - 1),
    onJumpToToday: () => setOffset(0),
  };
}
