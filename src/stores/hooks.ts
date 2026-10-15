import { getActiveData } from '@/services/activeData';
import type { BundledData } from '@/services/bundledData';
import { getColors, type ColorScheme, type ColorTokens } from '@/themes/Colors';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useResolvedScheme(): ColorScheme {
  const appearance = useAppSelector((state) => state.settings.appearance);
  const system = useColorScheme();
  const systemScheme = system === 'dark' ? 'dark' : 'light';
  return appearance === 'system' ? systemScheme : appearance;
}

export function useAppColors(): ColorTokens {
  return getColors(useResolvedScheme());
}

export function useActiveData(): BundledData {
  const revision = useAppSelector((state) => state.data.revision);
  return useMemo(() => getActiveData(), [revision]);
}
