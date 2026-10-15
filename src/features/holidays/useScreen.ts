import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  filterHolidaysByCategory,
  mergeSameDayHolidays,
  type AppliesTo,
} from '@/calendar/holidays';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { RouteEnum } from '@/enums/RouteEnum';
import { useActiveData, useAppColors, useAppSelector } from '@/stores/hooks';

export type HolidayFilter = 'all' | AppliesTo;

const FILTERS: readonly HolidayFilter[] = ['all', 'state_govt', 'central_govt', 'banks'];

export function useHolidaysScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = useActiveData();
  const { language, holidayCategories } = useAppSelector((state) => state.settings);
  const isTamil = language === 'ta';
  const locale = isTamil ? ta : enIN;
  const [filter, setFilter] = useState<HolidayFilter>('all');
  const todayIso = getTodayIso(new Date(), AppConstants.defaultLocation.timeZone);

  const groups = useMemo(() => {
    const enabled = filterHolidaysByCategory(
      mergeSameDayHolidays(data.holidays),
      holidayCategories,
    );
    const shown = filter === 'all' ? enabled : filterHolidaysByCategory(enabled, [filter]);
    const upcoming = shown
      .filter((holiday) => holiday.date >= todayIso)
      .sort((a, b) => a.date.localeCompare(b.date));
    const byMonth = new Map<string, typeof upcoming>();
    for (const holiday of upcoming) {
      const key = holiday.date.slice(0, 7);
      byMonth.set(key, [...(byMonth.get(key) ?? []), holiday]);
    }
    return [...byMonth.entries()].map(([key, items]) => ({
      key,
      title: format(parseISO(`${key}-01`), 'MMMM yyyy', { locale }),
      items: items.map((holiday) => ({
        id: holiday.id,
        day: format(parseISO(holiday.date), 'd', { locale }),
        weekday: format(parseISO(holiday.date), 'EEE', { locale }),
        name: isTamil ? holiday.name_ta : holiday.name_en,
        secondary: isTamil ? holiday.name_en : holiday.name_ta,
        tags: holiday.applies_to.map((a) => t(`day.appliesTo.${a}`)),
        onPress: () =>
          router.push({ pathname: RouteEnum.DayDetailPattern, params: { date: holiday.date } }),
      })),
    }));
  }, [data, holidayCategories, filter, todayIso, locale, isTamil, t, router]);

  return {
    colors,
    topInset: insets.top,
    kicker: t('splash.name'),
    title: t('tabs.holidays'),
    subtitle: t('holidays.subtitle'),
    filters: FILTERS.map((value) => ({
      value,
      label: value === 'all' ? t('holidays.all') : t(`day.appliesTo.${value}`),
      selected: value === filter,
      onPress: () => setFilter(value),
    })),
    groups,
    emptyLabel: t('holidays.empty'),
    note: { title: t('holidays.noteTitle'), body: t('holidays.noteBody') },
  };
}
