import { z } from 'zod';
import { isoDateSchema } from './common';

export const designationSchema = z.object({
  name_ta: z.string().min(1),
  name_en: z.string().min(1),
  declared: isoDateSchema.optional(),
  source_url: z.string().min(1),
});

export const commemorationSchema = z.object({
  id: z.string().min(1),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(32),
  year: z.number().int().optional(),
  kind: z.enum(['birth', 'death', 'event']),
  name_ta: z.string().min(1),
  name_en: z.string().min(1),
  description_ta: z.string().min(1),
  description_en: z.string().min(1),
  designations: z.array(designationSchema).optional(),
  source: z.string().min(1),
  source_url: z.string().min(1),
});

export const commemorationsFileSchema = z.object({
  version: z.number().int().positive(),
  commemorations: z.array(commemorationSchema),
});

export type Commemoration = z.infer<typeof commemorationSchema>;
export type CommemorationsFile = z.infer<typeof commemorationsFileSchema>;
