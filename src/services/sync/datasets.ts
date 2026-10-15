import { commemorationsFileSchema } from '@/schemas/commemorations';
import { holidaysFileSchema } from '@/schemas/holidays';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import { thirukkuralFileSchema } from '@/schemas/thirukkural';
import type { ZodType } from 'zod';

export function schemaForDataset(name: string): ZodType | null {
  if (name === 'tamil-months') return tamilMonthsFileSchema;
  if (name === 'commemorations') return commemorationsFileSchema;
  if (name === 'thirukkural') return thirukkuralFileSchema;
  if (/^holidays-\d{4}$/.test(name)) return holidaysFileSchema;
  return null;
}

export function parseDataset(name: string, text: string): unknown | null {
  const schema = schemaForDataset(name);
  if (!schema) return null;
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }
  const result = schema.safeParse(json);
  return result.success ? result.data : null;
}
