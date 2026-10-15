import { manifestSchema } from '@/schemas/manifest';
import { store } from '@/stores';
import { dataUpdated, syncStatusChanged } from '@/stores/slices/dataSlice';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { resetActiveData } from './activeData';
import { bundledVersion } from './bundledData';
import { dataApi } from './dataApi';
import { datasetStorage } from './sync/datasetStorage';
import { runSync, type SyncResult } from './sync/runSync';

const encoder = new TextEncoder();

export async function syncData(): Promise<SyncResult> {
  store.dispatch(syncStatusChanged('syncing'));
  const result = await runSync({
    fetchManifest: async () => {
      const text = await store
        .dispatch(dataApi.endpoints.getManifestText.initiate(undefined, { forceRefetch: true }))
        .unwrap();
      return manifestSchema.parse(JSON.parse(text));
    },
    fetchDataset: (url) =>
      store
        .dispatch(dataApi.endpoints.getDatasetText.initiate(url, { forceRefetch: true }))
        .unwrap(),
    sha256: (text) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text),
    utf8Length: (text) => encoder.encode(text).length,
    storage: datasetStorage,
    appVersion: Constants.expoConfig?.version ?? '0.0.0',
    bundledVersion,
  });
  if (result.outcomes.some((outcome) => outcome.status === 'updated')) {
    resetActiveData();
    store.dispatch(dataUpdated());
  }
  store.dispatch(syncStatusChanged(result.ok ? 'ok' : 'failed'));
  return result;
}
