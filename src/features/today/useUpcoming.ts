import { format, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { filterHolidaysByCategory } from '@/calendar/holidays';
import { nextCommemoration, nextHoliday } from '@/calendar/upcoming';
import type { UpcomingRow } from '@/components/UpcomingList';
import { RouteEnum } from '@/enums/RouteEnum';
import { useActiveData, useAppSelector } from '@/stores/hooks';

/** The next holiday and next commemoration after `fromIso`, ready to render. */
export function useUpcoming(fromIso: string) {
  const { t } = useTranslation();
  const router = useRouter();
  const data = useActiveData();
  const { language, holidayCategories } = useAppSelector((state) => state.settings);
  const isTamil = language === 'ta';
  const locale = isTamil ? ta : enIN;
  const dayOf = (iso: string) => format(parseISO(iso), 'd', { locale });
  const monthOf = (iso: string) => format(parseISO(iso), 'MMM', { locale });

  const open = (iso: string) => () =>
    router.push({ pathname: RouteEnum.DayDetailPattern, params: { date: iso } });
  const when = (daysAway: number) =>
    daysAway === 1 ? t('today.upcoming.tomorrow') : t('today.upcoming.inDays', { count: daysAway });

  const holiday = nextHoliday(filterHolidaysByCategory(data.holidays, holidayCategories), fromIso);
  const commemoration = nextCommemoration(data.commemorations, fromIso);

  const rows: UpcomingRow[] = [];
  if (holiday) {
    rows.push({
      id: `holiday-${holiday.id}`,
      kindLabel: t('today.upcoming.nextHoliday'),
      name: isTamil ? holiday.item.name_ta : holiday.item.name_en,
      dayLabel: dayOf(holiday.iso),
      monthLabel: monthOf(holiday.iso),
      whenLabel: when(holiday.daysAway),
      tone: 'holiday',
      onPress: open(holiday.iso),
    });
  }
  if (commemoration) {
    rows.push({
      id: `commemoration-${commemoration.id}`,
      kindLabel: t('today.upcoming.nextCommemoration'),
      name: isTamil ? commemoration.item.name_ta : commemoration.item.name_en,
      dayLabel: dayOf(commemoration.iso),
      monthLabel: monthOf(commemoration.iso),
      whenLabel: when(commemoration.daysAway),
      tone: 'commemoration',
      onPress: open(commemoration.iso),
    });
  }
  return { title: t('today.upcoming.title'), rows };
}
