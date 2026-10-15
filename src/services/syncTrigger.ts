import { AppConstants } from '@/constants/AppConstants';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import { store } from '@/stores';
import { getNetworkStateAsync, NetworkStateType } from 'expo-network';
import { syncData } from './syncService';

export async function maybeSync(force = false): Promise<void> {
  try {
    if (!force) {
      const last = Number(LocalStore.getString(StorageKeys.lastSyncAt) ?? 0);
      if (Date.now() - last < AppConstants.syncIntervalMs) return;
    }
    const network = await getNetworkStateAsync();
    if (!network.isConnected || network.isInternetReachable === false) return;
    const wifiOnly = store.getState().settings.dataSaver;
    if (!force && wifiOnly && network.type !== NetworkStateType.WIFI) return;

    const result = await syncData();
    if (result.ok) LocalStore.setString(StorageKeys.lastSyncAt, String(Date.now()));
  } catch {}
}
