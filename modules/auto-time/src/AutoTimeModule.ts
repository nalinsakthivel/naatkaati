import { NativeModule, requireNativeModule } from 'expo';
import type { AutoTimeStatus } from './AutoTime.types';

declare class AutoTimeModule extends NativeModule {
  getStatus(): AutoTimeStatus;
}

export default requireNativeModule<AutoTimeModule>('AutoTime');
