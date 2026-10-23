import { commemorationsFileSchema } from '../commemorations';
import { holidaysFileSchema } from '../holidays';
import { tamilMonthsFileSchema } from '../tamilMonths';
import { thirukkuralFileSchema } from '../thirukkural';
import { manifestSchema } from '../manifest';
import rawManifest from '../../../data/manifest.json';
import commemorations from '../../../data/commemorations.json';
import holidays from '../../../data/holidays/2026.json';
import months from '../../../data/tamil-months.json';
import kurals from '../../../data/thirukkural.json';

const manifest = manifestSchema.parse(rawManifest);
const schemas = {
  commemorations: commemorationsFileSchema,
  'tamil-months': tamilMonthsFileSchema,
  thirukkural: thirukkuralFileSchema,
};
const files: Record<string, unknown> = {
  'commemorations.json': commemorations,
  'holidays/2026.json': holidays,
  'tamil-months.json': months,
  'thirukkural.json': kurals,
};

describe('every published dataset', () => {
  it.each(manifest.datasets)(
    '$name passes its runtime schema and matches the manifest version',
    (dataset) => {
      const json = files[dataset.url];
      expect(json).toBeDefined();
      const schema = dataset.name.startsWith('holidays-')
        ? holidaysFileSchema
        : schemas[dataset.name as keyof typeof schemas];
      expect(schema).toBeDefined();
      const parsed = schema.parse(json);
      expect(parsed.version).toBe(dataset.version);
    },
  );
});
