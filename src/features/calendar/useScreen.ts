import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { addDays, addMonths, format, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { filterHolidaysByCategory } from '@/calendar/holidays';
import { buildMonthGrid } from '@/calendar/monthGrid';
import { isTamilNewYear } from '@/calendar/tamilNewYear';
import { toTamilNumerals } from '@/calendar/numerals';
import { getTodayIso } from '@/calendar/today';
import type { MonthGridCell } from '@/components/MonthGrid';
import { useClock } from '@/hooks/useClock';
import { AppConstants } from '@/constants/AppConstants';
import { RouteEnum } from '@/enums/RouteEnum';
import { useTimeBanner } from '@/features/today/useTimeBanner';
import { useActiveData, useAppColors, useAppSelector } from '@/stores/hooks';

const FIRST_SUNDAY = '2023-01-01';
const MIN_YEAR = 1901;
const MAX_YEAR = 2099;

export function useCalendarScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const timeBanner = useTimeBanner();
  const { language, tamilNumerals, holidayCategories, newYearLabel } = useAppSelector(
    (state) => state.settings,
  );
  const isTamil = language === 'ta';
  const locale = isTamil ? ta : enIN;

  const data = useActiveData();
  const todayIso = getTodayIso(useClock(), AppConstants.defaultLocation.timeZone);
  const [visible, setVisible] = useState(() => parseISO(todayIso));
  const [jumpOpen, setJumpOpen] = useState(false);

  const year = visible.getFullYear();
  const month = visible.getMonth() + 1;
  const digits = (value: number) =>
    tamilNumerals && isTamil ? toTamilNumerals(value) : String(value);

  const openDate = (iso: string) => () =>
    router.push({ pathname: RouteEnum.DayDetailPattern, params: { date: iso } });

  const holidays = useMemo(
    () => filterHolidaysByCategory(data.holidays, holidayCategories),
    [data, holidayCategories],
  );
  const weeks = useMemo(
    () => buildMonthGrid(year, month, data.months, holidays, data.commemorations),
    [year, month, data, holidays],
  );

  const cellWeeks: MonthGridCell[][] = weeks.map((week) =>
    week.map((cell) => {
      const holidayNames = cell.holidays.map((h) => (isTamil ? h.name_ta : h.name_en));
      const tamilLabel = cell.tamil
        ? cell.isTamilMonthStart
          ? isTamil
            ? cell.tamil.monthNameTa
            : cell.tamil.monthNameEn
          : digits(cell.tamil.day)
        : '';
      const spoken = [
        format(parseISO(cell.iso), 'EEEE, d MMMM yyyy', { locale }),
        cell.tamil
          ? `${isTamil ? cell.tamil.monthNameTa : cell.tamil.monthNameEn} ${digits(cell.tamil.day)}`
          : '',
        cell.iso === todayIso ? t('calendar.today') : '',
        ...holidayNames.map((name) => `${t('calendar.holiday')}: ${name}`),
        ...cell.commemorations.map(
          (c) => `${t('calendar.commemoration')}: ${isTamil ? c.name_ta : c.name_en}`,
        ),
      ];
      return {
        key: cell.iso,
        day: String(cell.day),
        tamilLabel,
        inMonth: cell.inMonth,
        isToday: cell.iso === todayIso,
        isSunday: cell.weekday === 0,
        isTamilMonthStart: cell.isTamilMonthStart,
        isHoliday:
          cell.holidays.length > 0 ||
          (cell.tamil !== null && isTamilNewYear(cell.tamil.month, cell.tamil.day, newYearLabel)),
        hasCommemoration: cell.commemorations.length > 0,
        accessibilityLabel: spoken.filter(Boolean).join(', '),
        onPress: () =>
          router.push({ pathname: RouteEnum.DayDetailPattern, params: { date: cell.iso } }),
      };
    }),
  );

  const monthTamilNames = weeks
    .flat()
    .filter((cell) => cell.inMonth && cell.tamil)
    .map((cell) => (isTamil ? cell.tamil?.monthNameTa : cell.tamil?.monthNameEn))
    .filter((name, index, all): name is string => !!name && all.indexOf(name) === index);

  const monthHolidays = weeks
    .flat()
    .filter((cell) => cell.inMonth)
    .flatMap((cell) =>
      cell.holidays.map((holiday) => ({
        id: holiday.id,
        onPress: openDate(cell.iso),
        dateLabel: format(parseISO(cell.iso), 'd MMM', { locale }),
        name: isTamil ? holiday.name_ta : holiday.name_en,
      })),
    )
    .filter(
      (item, index, all) =>
        all.findIndex((o) => o.name === item.name && o.dateLabel === item.dateLabel) === index,
    );

  const monthCommemorations = weeks
    .flat()
    .filter((cell) => cell.inMonth)
    .flatMap((cell) =>
      cell.commemorations.map((item) => ({
        id: `${item.id}-${cell.iso}`,
        onPress: openDate(cell.iso),
        dateLabel: format(parseISO(cell.iso), 'd MMM', { locale }),
        name: isTamil ? item.name_ta : item.name_en,
      })),
    );

  const today = parseISO(todayIso);
  const isCurrentMonth =
    visible.getFullYear() === today.getFullYear() && visible.getMonth() === today.getMonth();
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), 'MMMM', { locale }),
  );
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

  const shiftMonth = (delta: number) =>
    setVisible((current) => {
      const next = addMonths(current, delta);
      return next.getFullYear() < MIN_YEAR || next.getFullYear() > MAX_YEAR ? current : next;
    });

  return {
    colors,
    screenTitle: t('screens.calendar'),
    screenSubtitle: t('calendar.subtitle'),
    legend: [t('calendar.holiday'), t('calendar.commemoration')],
    canGoPrev: year > MIN_YEAR || month > 1,
    canGoNext: year < MAX_YEAR || month < 12,
    timeBanner,
    topInset: insets.top,
    title: format(visible, 'MMMM yyyy', { locale }),
    subtitle:
      monthTamilNames.length > 1
        ? t('calendar.tamilMonths', {
            first: monthTamilNames[0],
            second: monthTamilNames[monthTamilNames.length - 1],
          })
        : (monthTamilNames[0] ?? ''),
    prevLabel: t('calendar.prevMonth'),
    nextLabel: t('calendar.nextMonth'),
    jumpLabel: t('calendar.jump'),
    todayLabel: t('calendar.today'),
    isCurrentMonth,
    onToday: () => setVisible(parseISO(todayIso)),
    onOpenJump: () => setJumpOpen(true),
    jump: {
      isPresented: jumpOpen,
      onDismiss: () => setJumpOpen(false),
      title: t('calendar.jump'),
      monthLabel: t('calendar.month'),
      yearLabel: t('calendar.year'),
      monthNames,
      years,
      month,
      year,
      onChange: (nextYear: number, nextMonth: number) =>
        setVisible(new Date(nextYear, nextMonth - 1, 1)),
    },
    onPrev: () => shiftMonth(-1),
    onNext: () => shiftMonth(1),
    weekdayLabels: Array.from({ length: 7 }, (_, i) =>
      format(addDays(parseISO(FIRST_SUNDAY), i), 'EEE', { locale }),
    ),
    weeks: cellWeeks,
    holidaysTitle: t('calendar.holidaysTitle'),
    noHolidaysLabel: t('calendar.noHolidays'),
    monthHolidays,
    commemorationsTitle: t('calendar.commemorationsTitle'),
    monthCommemorations,
  };
}
