import { z } from 'zod';

export const manifestDatasetSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  version: z.number().int().positive(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  bytes: z.number().int().positive(),
  min_app_version: z.string().regex(/^\d+\.\d+\.\d+$/),
});

export const manifestSchema = z.object({
  schema_version: z.number().int().positive(),
  datasets: z.array(manifestDatasetSchema),
});

export type ManifestDataset = z.infer<typeof manifestDatasetSchema>;
export type Manifest = z.infer<typeof manifestSchema>;
