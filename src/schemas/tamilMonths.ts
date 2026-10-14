import { z } from 'zod';
import { isoDateSchema } from './common';

export const tamilMonthSchema = z.object({
  start: isoDateSchema,
  month: z.number().int().min(1).max(12),
  name_ta: z.string().min(1),
  name_en: z.string().min(1),
  thiruvalluvar_year: z.number().int().positive(),
  source: z.enum(['gazette', 'computed']),
});

export const tamilMonthsFileSchema = z.object({
  version: z.number().int().positive(),
  range: z.tuple([z.number().int(), z.number().int()]),
  months: z.array(tamilMonthSchema).min(1),
});

export type TamilMonthRecord = z.infer<typeof tamilMonthSchema>;
export type TamilMonthsFile = z.infer<typeof tamilMonthsFileSchema>;
