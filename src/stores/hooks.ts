import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getColors, type ColorScheme, type ColorTokens } from '@/themes/Colors';
import { getActiveData } from '@/services/activeData';
import type { BundledData } from '@/services/bundledData';
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

/** Bundled data, or newer validated downloaded data. Re-reads after each successful sync. */
export function useActiveData(): BundledData {
  const revision = useAppSelector((state) => state.data.revision);
  // `revision` is the dependency that forces a re-read after a sync replaces data.
  return useMemo(() => getActiveData(), [revision]);
}
