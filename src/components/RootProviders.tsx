import { i18n } from '@/i18n';
import { maybeSync } from '@/services/syncTrigger';
import { refreshWidgets } from '@/services/widgetRefresh';
import { store } from '@/stores';
import { useAppSelector, useResolvedScheme } from '@/stores/hooks';
import { Catamaran_600SemiBold, Catamaran_800ExtraBold } from '@expo-google-fonts/catamaran';
import {
  NotoSansTamil_400Regular,
  NotoSansTamil_500Medium,
  NotoSansTamil_600SemiBold,
} from '@expo-google-fonts/noto-sans-tamil';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function LanguageSync() {
  const language = useAppSelector((state) => state.settings.language);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return null;
}

function ThemedStatusBar() {
  return <StatusBar style={useResolvedScheme() === 'dark' ? 'light' : 'dark'} />;
}

function DataSync() {
  useEffect(() => {
    maybeSync();
    refreshWidgets();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        maybeSync();
        refreshWidgets();
      }
    });
    return () => subscription.remove();
  }, []);
  return null;
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
      <DataSync />
      {children}
    </Provider>
  );
}
