import { LocalStore } from '@/storage/LocalStore';
import { datasetKey, StorageKeys } from '@/storage/StorageKeys';
import type { DatasetStorage, StoredDataset } from './runSync';

function parseStored(raw: string | undefined): StoredDataset | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === 'object' &&
      value !== null &&
      'version' in value &&
      'text' in value &&
      typeof value.version === 'number' &&
      typeof value.text === 'string'
    ) {
      return { version: value.version, text: value.text };
    }
  } catch {
    // Corrupt entry: treat as absent so the bundled data is used.
  }
  return null;
}

export function listStoredDatasetNames(): string[] {
  const index = LocalStore.getString(StorageKeys.datasetIndex);
  return index ? index.split(',').filter((name) => name.length > 0) : [];
}

/** Downloaded datasets in MMKV. Each dataset is one key, so a write replaces it atomically. */
export const datasetStorage: DatasetStorage = {
  read: (name) => parseStored(LocalStore.getString(datasetKey(name))),
  write: (name, dataset) => {
    LocalStore.setString(datasetKey(name), JSON.stringify(dataset));
    const names = listStoredDatasetNames();
    if (!names.includes(name)) {
      LocalStore.setString(StorageKeys.datasetIndex, [...names, name].join(','));
    }
  },
};
