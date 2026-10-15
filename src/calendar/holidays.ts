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
