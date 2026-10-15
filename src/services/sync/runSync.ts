import type { Manifest, ManifestDataset } from '@/schemas/manifest';
import { parseDataset, schemaForDataset } from './datasets';
import { compareVersions } from './version';

export interface StoredDataset {
  version: number;
  text: string;
}

export interface DatasetStorage {
  read(name: string): StoredDataset | null;
  /** Must be a single atomic write: both version and text change together, or neither does. */
  write(name: string, dataset: StoredDataset): void;
}

export interface SyncDeps {
  fetchManifest(): Promise<Manifest>;
  fetchDataset(url: string): Promise<string>;
  sha256(text: string): Promise<string>;
  utf8Length(text: string): number;
  storage: DatasetStorage;
  appVersion: string;
  /** Version already bundled in the app, per dataset name; 0 if none. */
  bundledVersion(name: string): number;
}

export type SyncOutcome =
  | { name: string; status: 'updated'; version: number }
  | { name: string; status: 'current' }
  | { name: string; status: 'skipped'; reason: 'unsupported' | 'min_app_version' }
  | {
      name: string;
      status: 'failed';
      reason: 'download' | 'size' | 'checksum' | 'invalid';
    };

export interface SyncResult {
  ok: boolean;
  outcomes: SyncOutcome[];
}

function localVersion(deps: SyncDeps, name: string): number {
  return Math.max(deps.storage.read(name)?.version ?? 0, deps.bundledVersion(name));
}

async function syncOne(deps: SyncDeps, dataset: ManifestDataset): Promise<SyncOutcome> {
  const { name } = dataset;
  if (!schemaForDataset(name)) return { name, status: 'skipped', reason: 'unsupported' };
  if (compareVersions(dataset.min_app_version, deps.appVersion) > 0) {
    return { name, status: 'skipped', reason: 'min_app_version' };
  }
  if (dataset.version <= localVersion(deps, name)) return { name, status: 'current' };

  let text: string;
  try {
    text = await deps.fetchDataset(dataset.url);
  } catch {
    return { name, status: 'failed', reason: 'download' };
  }
  // A truncated download is caught by size first, then by checksum.
  if (deps.utf8Length(text) !== dataset.bytes) return { name, status: 'failed', reason: 'size' };
  if ((await deps.sha256(text)) !== dataset.sha256) {
    return { name, status: 'failed', reason: 'checksum' };
  }
  if (parseDataset(name, text) === null) return { name, status: 'failed', reason: 'invalid' };

  // Only now, after every check has passed, replace the working copy in one atomic write.
  deps.storage.write(name, { version: dataset.version, text });
  return { name, status: 'updated', version: dataset.version };
}

/**
 * Manifest-driven sync: fetch manifest, compare versions, download only changed datasets, verify
 * size and SHA-256, validate with zod, then atomically replace. A failure on one dataset never
 * touches working data and never stops the others.
 */
export async function runSync(deps: SyncDeps): Promise<SyncResult> {
  let manifest: Manifest;
  try {
    manifest = await deps.fetchManifest();
  } catch {
    return { ok: false, outcomes: [] };
  }
  const outcomes: SyncOutcome[] = [];
  for (const dataset of manifest.datasets) {
    outcomes.push(await syncOne(deps, dataset));
  }
  return { ok: outcomes.every((outcome) => outcome.status !== 'failed'), outcomes };
}
