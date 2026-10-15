export const StorageKeys = {
  appearance: 'settings.appearance',
  language: 'settings.language',
  tamilNumerals: 'settings.tamilNumerals',
  holidayCategories: 'settings.holidayCategories',
  newYearLabel: 'settings.newYearLabel',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
