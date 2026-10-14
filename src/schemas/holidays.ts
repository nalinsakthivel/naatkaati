import { z } from 'zod';
import { isoDateSchema } from './common';

export const holidaySchema = z.object({
  id: z.string().min(1),
  date: isoDateSchema,
  name_ta: z.string().min(1),
  name_en: z.string().min(1),
  applies_to: z.array(z.enum(['state_govt', 'central_govt', 'banks'])).min(1),
  category: z.enum(['cultural', 'national', 'religious_holiday', 'other']),
  source: z.string().min(1),
  source_url: z.string().optional(),
  note: z.string().optional(),
});

export const holidaysFileSchema = z.object({
  year: z.number().int(),
  version: z.number().int().positive(),
  holidays: z.array(holidaySchema),
});

export type Holiday = z.infer<typeof holidaySchema>;
export type HolidaysFile = z.infer<typeof holidaysFileSchema>;
