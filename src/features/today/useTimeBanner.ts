import { getTimeWarnings } from '@/calendar/timeWarnings';
import { AppConstants } from '@/constants/AppConstants';
import { getAutoTimeStatus, getDeviceTimeZone, openDateSettings } from '@/services/timeCheck';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState } from 'react-native';

export function useTimeBanner() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  const warnings = getTimeWarnings(
    getAutoTimeStatus(),
    getDeviceTimeZone(),
    AppConstants.defaultLocation.timeZone,
    now,
  );

  if (warnings.autoTimeOff) {
    return {
      message: t('timeBanner.autoTimeOff'),
      actionLabel: t('timeBanner.openSettings'),
      onAction: () => {
        openDateSettings();
      },
    };
  }
  if (warnings.timezoneDiffers) {
    return { message: t('timeBanner.timezoneDiffers', { place: t('today.location') }) };
  }
  return null;
}
