import { z } from 'zod';

export const kuralSchema = z.object({
  number: z.number().int().min(1).max(1330),
  adhikaram: z.number().int().min(1).max(133),
  lines_ta: z.array(z.string().min(1)).length(2),
  translation_en: z.string().min(1),
  explanation_en: z.string().min(1),
  meaning_ta: z.string().min(1),
  text_status: z.enum(['verified', 'corrected', 'single_source', 'needs_review']),
  meaning_ta_author: z.string().min(1),
  meaning_ta_reviewed_by: z.string().nullable(),
  meaning_ta_note: z.string().optional(),
  text_note: z.string().optional(),
  english_note: z.string().optional(),
});

export const adhikaramSchema = z.object({
  number: z.number().int().min(1).max(133),
  name_ta: z.string().min(1),
  name_en: z.string().min(1),
});

export const thirukkuralFileSchema = z.object({
  version: z.number().int().positive(),
  adhikarams: z.array(adhikaramSchema).min(1),
  kurals: z.array(kuralSchema).min(1),
});

export type Kural = z.infer<typeof kuralSchema>;
export type Adhikaram = z.infer<typeof adhikaramSchema>;
export type ThirukkuralFile = z.infer<typeof thirukkuralFileSchema>;
