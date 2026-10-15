export function holidaysOn<T extends { date: string }>(
  holidays: readonly T[],
  isoDate: string,
): T[] {
  return holidays.filter((holiday) => holiday.date === isoDate);
}
