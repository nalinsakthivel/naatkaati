import { getTodayIso, shiftIsoDate } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { useDayView } from '@/features/dayDetail/useDayView';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTimeBanner } from './useTimeBanner';
import { useUpcoming } from './useUpcoming';

export function useTodayScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(() => new Date());
  const [offset, setOffset] = useState(0);

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
    kicker: t('splash.name'),
    title: t('tabs.today'),
    locationLabel: t('today.location'),
    offline: { title: t('today.offlineTitle'), body: t('today.offlineBody') },
    isToday: offset === 0,
    jumpLabel: t('today.jumpToToday'),
    onNextDay: () => setOffset((current) => current + 1),
    onPreviousDay: () => setOffset((current) => current - 1),
    onJumpToToday: () => setOffset(0),
  };
}
