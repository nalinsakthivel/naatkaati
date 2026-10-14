import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '@/stores/hooks';

export function useDayDetailScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const { date } = useLocalSearchParams<{ date: string }>();
  return {
    title: t('screens.dayDetail'),
    date,
    colors,
  };
}
