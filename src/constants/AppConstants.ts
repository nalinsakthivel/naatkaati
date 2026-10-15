import type { GeoLocation } from '@/calendar/astronomy';

export const AppConstants = {
  defaultLanguage: 'ta',
  /** How long the brand splash shows before onboarding or Today. */
  splashMs: 1800,
  fallbackLanguage: 'en',
  /** Local hour at which day-level reminders fire. */
  reminderHour: 7,
  /** Minimum time between automatic data syncs: 24 hours. */
  syncIntervalMs: 24 * 60 * 60 * 1000,
  /** Chennai (IST): the reference location of the official Tamil Nadu calendar. */
  defaultLocation: {
    latitude: 13.0827,
    longitude: 80.2707,
    timeZone: 'Asia/Kolkata',
  } satisfies GeoLocation,
} as const;
