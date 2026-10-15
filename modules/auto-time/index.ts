import { Platform } from 'react-native';
import type { AutoTimeStatus } from './src/AutoTime.types';

export type { AutoTimeStatus };

/** Safe default for platforms without the API (iOS has no public equivalent): report "on". */
const SAFE_DEFAULT: AutoTimeStatus = { autoTime: true, autoTimeZone: true };

export function getAutoTimeStatus(): AutoTimeStatus {
  if (Platform.OS !== 'android') return SAFE_DEFAULT;
  try {
    // Required lazily so non-Android bundles never touch the native module.
    const module = require('./src/AutoTimeModule').default;
    return module.getStatus();
  } catch {
    return SAFE_DEFAULT;
  }
}
