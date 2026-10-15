import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { useDayView } from '@/features/dayDetail/useDayView';

export function useTodayScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(() => new Date());

  // Re-read the clock when the app returns to the foreground so the date never goes stale.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  const todayIso = getTodayIso(now, AppConstants.defaultLocation.timeZone);
  const view = useDayView(todayIso, now);

  return { ...view, topInset: insets.top, locationLabel: t('today.location') };
}
