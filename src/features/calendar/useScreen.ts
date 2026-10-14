import { useTranslation } from 'react-i18next';
import { useAppColors } from '@/stores/hooks';

export function useCalendarScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  return {
    title: t('screens.calendar'),
    colors,
  };
}
