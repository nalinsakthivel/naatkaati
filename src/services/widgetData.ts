import { buildWidgetModel } from '@/calendar/widgetModel';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { i18n } from '@/i18n';
import { LocalStore } from '@/storage/LocalStore';
import { StorageKeys } from '@/storage/StorageKeys';
import { isLanguage, parseHolidayCategories } from '@/stores/slices/settingsSlice';
import type { WidgetSnapshot } from '@/widget/widgetTaskHandler';
import { getActiveData } from './activeData';
import { scheduleWidgetMidnightRefresh } from '../../modules/widget-refresh';

export const WIDGET_NAME = 'NaatkaatiWidget';

/**
 * Reads settings straight from storage (the widget can run before the app UI starts) and builds
 * what the widget shows for today in the default location's timezone.
 */
export function loadWidgetSnapshot(): WidgetSnapshot | null {
  scheduleWidgetMidnightRefresh();
  const storedLanguage = LocalStore.getString(StorageKeys.language);
  const language = isLanguage(storedLanguage) ? storedLanguage : AppConstants.defaultLanguage;
  const data = getActiveData();
  const model = buildWidgetModel({
    months: data.months,
    holidays: data.holidays,
    kurals: data.kurals,
    iso: getTodayIso(new Date(), AppConstants.defaultLocation.timeZone),
    language,
    tamilNumerals: LocalStore.getString(StorageKeys.tamilNumerals) === 'true',
    holidayCategories: parseHolidayCategories(LocalStore.getString(StorageKeys.holidayCategories)),
  });
  if (!model) return null;
  return {
    model,
    yearLabel: i18n.getFixedT(language)('today.yearLabel', { year: model.year }),
  };
}
