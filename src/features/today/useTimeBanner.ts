import { useClock } from '@/hooks/useClock';
import { useTranslation } from 'react-i18next';
import { getTimeWarnings } from '@/calendar/timeWarnings';
import { AppConstants } from '@/constants/AppConstants';
import { getAutoTimeStatus, getDeviceTimeZone, openDateSettings } from '@/services/timeCheck';

/** Banner content for a wrong or mismatched device clock, or null when everything is fine. */
export function useTimeBanner() {
  const { t } = useTranslation();
  const now = useClock();

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
