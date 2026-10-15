import { manifestSchema } from '../manifest';
import raw from '../../../data/manifest.json';

describe('manifestSchema', () => {
  it('accepts the bundled manifest', () => {
    expect(manifestSchema.safeParse(raw).success).toBe(true);
  });

  it('rejects a malformed checksum', () => {
    const bad = { ...raw, datasets: [{ ...raw.datasets[0], sha256: 'abc' }] };
    expect(manifestSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a bad min_app_version', () => {
    const bad = { ...raw, datasets: [{ ...raw.datasets[0], min_app_version: 'one' }] };
    expect(manifestSchema.safeParse(bad).success).toBe(false);
  });
});
