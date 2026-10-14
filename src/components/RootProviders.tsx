import { useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Catamaran_600SemiBold, Catamaran_800ExtraBold } from '@expo-google-fonts/catamaran';
import {
  NotoSansTamil_400Regular,
  NotoSansTamil_500Medium,
  NotoSansTamil_600SemiBold,
} from '@expo-google-fonts/noto-sans-tamil';
import '@/i18n';
import { store } from '@/stores';

SplashScreen.preventAutoHideAsync();

export function RootProviders({ children }: { children: ReactNode }) {
  const [loaded, error] = useFonts({
    Catamaran_600SemiBold,
    Catamaran_800ExtraBold,
    NotoSansTamil_400Regular,
    NotoSansTamil_500Medium,
    NotoSansTamil_600SemiBold,
  });
  const ready = loaded || error !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return <Provider store={store}>{children}</Provider>;
}
