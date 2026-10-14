export const StorageKeys = {
  appearance: 'settings.appearance',
  language: 'settings.language',
  tamilNumerals: 'settings.tamilNumerals',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
