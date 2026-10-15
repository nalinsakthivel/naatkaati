import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getTimeWarnings } from '@/calendar/timeWarnings';
import { AppConstants } from '@/constants/AppConstants';
import { getAutoTimeStatus, getDeviceTimeZone, openDateSettings } from '@/services/timeCheck';

/** Banner content for a wrong or mismatched device clock, or null when everything is fine. */
export function useTimeBanner() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  // Re-check when the user comes back from the system settings.
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
