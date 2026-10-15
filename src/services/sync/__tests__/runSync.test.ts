import type { Manifest } from '@/schemas/manifest';
import { runSync, type DatasetStorage, type StoredDataset, type SyncDeps } from '../runSync';
import commemorationsRaw from '../../../../data/commemorations.json';

const validText = JSON.stringify(commemorationsRaw);
// Deterministic stand-in for SHA-256 (the real digest is injected in production via expo-crypto):
// any change to the text changes the 64-hex-digit result.
function sha(text: string): string {
  let hash = 2166136261;
  let out = '';
  for (let round = 0; round < 8; round++) {
    for (let i = 0; i < text.length; i++) {
      hash = Math.imul(hash ^ text.charCodeAt(i), 16777619) >>> 0;
    }
    hash = Math.imul(hash ^ round, 16777619) >>> 0;
    out += hash.toString(16).padStart(8, '0');
  }
  return out;
}
const bytesOf = (text: string) => new TextEncoder().encode(text).length;

function makeStorage(initial: Record<string, StoredDataset> = {}): DatasetStorage & {
  data: Record<string, StoredDataset>;
} {
  const data = { ...initial };
  return {
    data,
    read: (name) => data[name] ?? null,
    write: (name, dataset) => {
      data[name] = dataset;
    },
  };
}

function manifestFor(
  text: string,
  overrides: Partial<Manifest['datasets'][number]> = {},
): Manifest {
  return {
    schema_version: 1,
    datasets: [
      {
        name: 'commemorations',
        url: 'commemorations.json',
        version: 2,
        sha256: sha(text),
        bytes: bytesOf(text),
        min_app_version: '1.0.0',
        ...overrides,
      },
    ],
  };
}

function makeDeps(
  manifest: Manifest | Error,
  payload: string | Error,
  storage = makeStorage(),
  appVersion = '1.0.0',
): SyncDeps & { fetched: string[] } {
  const fetched: string[] = [];
  return {
    fetched,
    fetchManifest: async () => {
      if (manifest instanceof Error) throw manifest;
      return manifest;
    },
    fetchDataset: async (url) => {
      fetched.push(url);
      if (payload instanceof Error) throw payload;
      return payload;
    },
    sha256: async (text) => sha(text),
    utf8Length: bytesOf,
    storage,
    appVersion,
    bundledVersion: () => 1,
  };
}

describe('runSync', () => {
  it('downloads, verifies, validates and stores a newer dataset', async () => {
    const storage = makeStorage();
    const result = await runSync(makeDeps(manifestFor(validText), validText, storage));
    expect(result.ok).toBe(true);
    expect(result.outcomes[0]).toEqual({ name: 'commemorations', status: 'updated', version: 2 });
    expect(storage.data.commemorations).toEqual({ version: 2, text: validText });
  });

  it('does nothing when the bundled or stored version is already current', async () => {
    const deps = makeDeps(manifestFor(validText, { version: 1 }), validText);
    const result = await runSync(deps);
    expect(result.outcomes[0]).toEqual({ name: 'commemorations', status: 'current' });
    expect(deps.fetched).toEqual([]);
  });

  it('rejects a checksum mismatch and keeps working data', async () => {
    const existing = { version: 1, text: '{"keep":"me"}' };
    const storage = makeStorage({ commemorations: existing });
    const tampered = validText.replace('Periyar', 'Peri-yar');
    const manifest = manifestFor(validText, { bytes: bytesOf(tampered) });
    const result = await runSync(makeDeps(manifest, tampered, storage));
    expect(result.ok).toBe(false);
    expect(result.outcomes[0]).toMatchObject({ status: 'failed', reason: 'checksum' });
    expect(storage.data.commemorations).toEqual(existing);
  });

  it('rejects invalid JSON even when size and checksum match', async () => {
    const broken = '{ not json';
    const storage = makeStorage();
    const result = await runSync(makeDeps(manifestFor(broken), broken, storage));
    expect(result.outcomes[0]).toMatchObject({ status: 'failed', reason: 'invalid' });
    expect(storage.data.commemorations).toBeUndefined();
  });

  it('rejects JSON that fails the schema', async () => {
    const wrongShape = JSON.stringify({ version: 2, commemorations: [{ id: 'x' }] });
    const storage = makeStorage();
    const result = await runSync(makeDeps(manifestFor(wrongShape), wrongShape, storage));
    expect(result.outcomes[0]).toMatchObject({ status: 'failed', reason: 'invalid' });
    expect(storage.data.commemorations).toBeUndefined();
  });

  it('rejects a partial download and keeps working data', async () => {
    const existing = { version: 1, text: validText };
    const storage = makeStorage({ commemorations: existing });
    const partial = validText.slice(0, Math.floor(validText.length / 2));
    const result = await runSync(makeDeps(manifestFor(validText), partial, storage));
    expect(result.outcomes[0]).toMatchObject({ status: 'failed', reason: 'size' });
    expect(storage.data.commemorations).toEqual(existing);
  });

  it('reports a failed download without touching storage', async () => {
    const storage = makeStorage();
    const result = await runSync(makeDeps(manifestFor(validText), new Error('offline'), storage));
    expect(result.outcomes[0]).toMatchObject({ status: 'failed', reason: 'download' });
    expect(storage.data).toEqual({});
  });

  it('skips a dataset that needs a newer app version', async () => {
    const deps = makeDeps(manifestFor(validText, { min_app_version: '2.0.0' }), validText);
    const result = await runSync(deps);
    expect(result.outcomes[0]).toEqual({
      name: 'commemorations',
      status: 'skipped',
      reason: 'min_app_version',
    });
    expect(deps.fetched).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('ignores datasets this app version cannot handle', async () => {
    const deps = makeDeps(manifestFor(validText, { name: 'future-dataset' }), validText);
    const result = await runSync(deps);
    expect(result.outcomes[0]).toMatchObject({ status: 'skipped', reason: 'unsupported' });
    expect(deps.fetched).toEqual([]);
  });

  it('fails softly when the manifest cannot be fetched (airplane mode)', async () => {
    const result = await runSync(makeDeps(new Error('offline'), validText));
    expect(result).toEqual({ ok: false, outcomes: [] });
  });
});
