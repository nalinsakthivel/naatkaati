import type { ExpoConfig } from 'expo/config';

const APP_ID = 'com.nalindev.naatkaati';

const BRAND_LIGHT = '#24306B';
const BACKGROUND_LIGHT = '#FAFAF7';
const BACKGROUND_DARK = '#0F1430';

const config: ExpoConfig = {
  name: 'Naatkaati',
  slug: 'naatkaati',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'naatkaati',
  userInterfaceStyle: 'automatic',
  platforms: ['android', 'ios'],
  ios: {
    bundleIdentifier: APP_ID,
    icon: './assets/expo.icon',
  },
  android: {
    package: APP_ID,
    adaptiveIcon: {
      backgroundColor: BRAND_LIGHT,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    blockedPermissions: [
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.USE_EXACT_ALARM',
    ],
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    [
      'expo-splash-screen',
      {
        backgroundColor: BACKGROUND_LIGHT,
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        dark: { backgroundColor: BACKGROUND_DARK },
      },
    ],
    'expo-localization',
    'expo-notifications',
    'expo-background-task',
    [
      'react-native-android-widget',
      {
        widgets: [
          {
            name: 'NaatkaatiWidget',
            label: 'Naatkaati',
            description: "Today's Tamil date, any holiday, and the kural of the day",
            minWidth: '250dp',
            minHeight: '110dp',
            targetCellWidth: 4,
            targetCellHeight: 2,
            resizeMode: 'horizontal|vertical',
            // Android's minimum is 30 minutes; the date-change receiver covers midnight.
            updatePeriodMillis: 1800000,
          },
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
