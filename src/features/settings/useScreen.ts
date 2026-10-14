import { useTranslation } from 'react-i18next';
import { useAppColors } from '@/stores/hooks';

export function useSettingsScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  return {
    title: t('screens.settings'),
    colors,
  };
}
