import type { GeoLocation } from '@/calendar/astronomy';

export const AppConstants = {
  defaultLanguage: 'ta',
  fallbackLanguage: 'en',
  /** Chennai (IST): the reference location of the official Tamil Nadu calendar. */
  defaultLocation: {
    latitude: 13.0827,
    longitude: 80.2707,
    timeZone: 'Asia/Kolkata',
  } satisfies GeoLocation,
} as const;
