export type AppliesTo = 'state_govt' | 'central_govt' | 'banks';

export function holidaysOn<T extends { date: string }>(
  holidays: readonly T[],
  isoDate: string,
): T[] {
  return holidays.filter((holiday) => holiday.date === isoDate);
}

export function filterHolidaysByCategory<T extends { applies_to: readonly AppliesTo[] }>(
  holidays: readonly T[],
  enabled: readonly AppliesTo[],
): T[] {
  return holidays.filter((holiday) => holiday.applies_to.some((a) => enabled.includes(a)));
}

const CATEGORY_ORDER: readonly AppliesTo[] = ['state_govt', 'central_govt', 'banks'];

/**
 * The state and central lists often carry the same holiday as two records. Records on the same
 * date with the same Tamil name become one: the first record keeps its wording, and the
 * `applies_to` lists are combined. Different holidays on one date stay separate.
 */
export function mergeSameDayHolidays<
  T extends { date: string; name_ta: string; applies_to: readonly AppliesTo[] },
>(holidays: readonly T[]): (Omit<T, 'applies_to'> & { applies_to: AppliesTo[] })[] {
  const merged = new Map<string, T & { applies_to: AppliesTo[] }>();
  for (const holiday of holidays) {
    const key = `${holiday.date}|${holiday.name_ta}`;
    const existing = merged.get(key);
    const combined = new Set([...(existing?.applies_to ?? []), ...holiday.applies_to]);
    merged.set(key, {
      ...(existing ?? holiday),
      applies_to: CATEGORY_ORDER.filter((category) => combined.has(category)),
    });
  }
  return [...merged.values()];
}
