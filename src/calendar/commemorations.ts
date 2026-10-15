import { getDate, getMonth, parseISO } from 'date-fns';

export interface CommemorationLike {
  month: number;
  day: number;
}

export function commemorationsOn<T extends CommemorationLike>(
  commemorations: readonly T[],
  isoDate: string,
): T[] {
  const date = parseISO(isoDate);
  const month = getMonth(date) + 1;
  const day = getDate(date);
  return commemorations.filter((item) => item.month === month && item.day === day);
}
