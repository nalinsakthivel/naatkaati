import { useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Catamaran_600SemiBold, Catamaran_800ExtraBold } from '@expo-google-fonts/catamaran';
import {
  NotoSansTamil_400Regular,
  NotoSansTamil_500Medium,
  NotoSansTamil_600SemiBold,
} from '@expo-google-fonts/noto-sans-tamil';
import { i18n } from '@/i18n';
import { store } from '@/stores';
import { useAppSelector, useResolvedScheme } from '@/stores/hooks';

SplashScreen.preventAutoHideAsync();

function LanguageSync() {
  const language = useAppSelector((state) => state.settings.language);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return null;
}

function ThemedStatusBar() {
  // Light icons on the dark night-sky theme, dark icons on the light theme.
  return <StatusBar style={useResolvedScheme() === 'dark' ? 'light' : 'dark'} />;
}

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
  return (
    <Provider store={store}>
      <LanguageSync />
      <ThemedStatusBar />
      {children}
    </Provider>
  );
}
