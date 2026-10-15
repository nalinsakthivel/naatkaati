import { isAfter } from 'date-fns';

export type ReminderKind = 'once' | 'yearly';

export interface ReminderSpec {
  key: string;
  kind: ReminderKind;
  month: number;
  day: number;
  year?: number;
}

export type ReminderPlan =
  | { type: 'date'; date: Date }
  | { type: 'yearly'; month: number; day: number; hour: number; minute: number };

export const holidayReminderKey = (id: string) => `h:${id}`;
export const commemorationReminderKey = (id: string) => `c:${id}`;

export function planReminder(spec: ReminderSpec, now: Date, hour: number): ReminderPlan | null {
  if (spec.kind === 'yearly') {
    return { type: 'yearly', month: spec.month - 1, day: spec.day, hour, minute: 0 };
  }
  if (spec.year === undefined) return null;
  const date = new Date(spec.year, spec.month - 1, spec.day, hour, 0, 0);
  return isAfter(date, now) ? { type: 'date', date } : null;
}
