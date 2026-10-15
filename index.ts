import 'expo-router/entry';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { loadWidgetSnapshot } from './src/services/widgetData';
import { createWidgetTaskHandler } from './src/widget/widgetTaskHandler';

// The Android home-screen widget runs this handler in the background, with or without the app UI.
registerWidgetTaskHandler(createWidgetTaskHandler(loadWidgetSnapshot));
