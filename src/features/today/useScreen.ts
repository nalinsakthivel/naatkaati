import { useTranslation } from 'react-i18next';
import { useAppColors } from '@/stores/hooks';

export function useTodayScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  return {
    title: t('screens.today'),
    colors,
  };
}
