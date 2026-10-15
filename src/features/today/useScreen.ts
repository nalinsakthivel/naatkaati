import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
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
  const [now, setNow] = useState(() => new Date());
  // Days away from today. Kept as an offset so the view stays correct across midnight.
  const [offset, setOffset] = useState(0);

  // Re-read the clock when the app returns to the foreground so the date never goes stale.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  const todayIso = getTodayIso(now, AppConstants.defaultLocation.timeZone);
  const shownIso = shiftIsoDate(todayIso, offset);
  const view = useDayView(shownIso, offset === 0 ? now : undefined);
  const timeBanner = useTimeBanner();
  const upcoming = useUpcoming(shownIso);

  return {
    ...view,
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
