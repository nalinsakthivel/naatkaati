export const StorageKeys = {
  appearance: 'settings.appearance',
  language: 'settings.language',
  tamilNumerals: 'settings.tamilNumerals',
  holidayCategories: 'settings.holidayCategories',
  newYearLabel: 'settings.newYearLabel',
  reminders: 'reminders.keys',
  onboardingDone: 'settings.onboardingDone',
  dataSaver: 'settings.dataSaver',
  lastSyncAt: 'sync.lastSyncAt',
  datasetIndex: 'datasets.index',
} as const;

export const datasetKey = (name: string) => `dataset.${name}` as const;

export type StorageKey =
  (typeof StorageKeys)[keyof typeof StorageKeys] | ReturnType<typeof datasetKey>;
