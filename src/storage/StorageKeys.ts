export const StorageKeys = {
  appearance: 'settings.appearance',
  language: 'settings.language',
  tamilNumerals: 'settings.tamilNumerals',
  holidayCategories: 'settings.holidayCategories',
  newYearLabel: 'settings.newYearLabel',
  reminders: 'reminders.keys',
  onboardingDone: 'settings.onboardingDone',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
