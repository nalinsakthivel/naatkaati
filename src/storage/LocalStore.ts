import { storage } from './MMKV';
import type { StorageKey } from './StorageKeys';

export const LocalStore = {
  getString(key: StorageKey): string | undefined {
    return storage.getString(key);
  },
  setString(key: StorageKey, value: string): void {
    storage.set(key, value);
  },
  remove(key: StorageKey): void {
    storage.remove(key);
  },
};
