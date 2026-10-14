import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getColors, type ColorTokens } from '@/themes/Colors';
import type { AppDispatch, RootState } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useAppColors(): ColorTokens {
  const appearance = useAppSelector((state) => state.settings.appearance);
  const system = useColorScheme();
  const systemScheme = system === 'dark' ? 'dark' : 'light';
  const scheme = appearance === 'system' ? systemScheme : appearance;
  return getColors(scheme);
}
