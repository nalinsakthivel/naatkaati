import { getTodayIso } from '@/calendar/today';
import { buildWidgetModel } from '@/calendar/widgetModel';
import { AppConstants } from '@/constants/AppConstants';
import { i18n } from '@/i18n';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import { isWidgetVariant, DEFAULT_WIDGET_VARIANT } from '@/calendar/widgetVariants';
import { isLanguage, parseHolidayCategories } from '@/stores/slices/settingsSlice';
import type { WidgetSnapshot } from '@/widget/widgetTaskHandler';
import { getActiveData } from './activeData';

export const WIDGET_NAME = 'NaatkaatiWidget';

export function loadWidgetSnapshot(): WidgetSnapshot | null {
  const storedLanguage = LocalStore.getString(StorageKeys.language);
  const language = isLanguage(storedLanguage) ? storedLanguage : AppConstants.defaultLanguage;
  const data = getActiveData();
  const model = buildWidgetModel({
    months: data.months,
    holidays: data.holidays,
    commemorations: data.commemorations,
    kurals: data.kurals,
    iso: getTodayIso(new Date(), AppConstants.defaultLocation.timeZone),
    language,
    location: AppConstants.defaultLocation,
    tamilNumerals: LocalStore.getString(StorageKeys.tamilNumerals) === 'true',
    holidayCategories: parseHolidayCategories(LocalStore.getString(StorageKeys.holidayCategories)),
  });
  if (!model) return null;
  const t = i18n.getFixedT(language);
  const storedVariant = LocalStore.getString(StorageKeys.widgetVariant);
  return {
    model,
    yearLabel: t('today.yearLabel', { year: model.year }),
    variant: isWidgetVariant(storedVariant) ? storedVariant : DEFAULT_WIDGET_VARIANT,
    labels: {
      appName: t('splash.name'),
      kuralTitle: t('today.kural.title'),
      eventTitle: t('widgets.dayNote'),
    },
  };
}
