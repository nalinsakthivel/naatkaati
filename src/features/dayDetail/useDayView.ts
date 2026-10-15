import { useMemo } from 'react';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import { TZDate } from '@date-fns/tz';
import { format, getDay, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import { useTranslation } from 'react-i18next';
import { getEclipsesInYear, getMoonInfo, getSunTimes } from '@/calendar/astronomy';
import { commemorationsOn } from '@/calendar/commemorations';
import { filterHolidaysByCategory, holidaysOn } from '@/calendar/holidays';
import { kuralOfTheDay } from '@/calendar/kural';
import { toTamilNumerals } from '@/calendar/numerals';
import { getTamilDate } from '@/calendar/tamilDate';
import { isTamilNewYear } from '@/calendar/tamilNewYear';
import type { MoonItem, SkyItem } from '@/components/SkyRow';
import { AppConstants } from '@/constants/AppConstants';
import { ApiConstants } from '@/services/constants/ApiConstants';
import { commemorationReminderKey, holidayReminderKey } from '@/calendar/reminders';
import { useActiveData, useAppColors, useAppSelector } from '@/stores/hooks';
import { useReminders } from './useReminders';

const NO_VALUE = '—';
const NOON_HOUR = 12;

/**
 * Everything the Today and Day Detail screens show for one civil date (yyyy-MM-dd).
 * `moonAt` is the instant used for the moon phase; for a day other than today it is local noon.
 */
export function useDayView(isoDate: string, moonAt?: Date) {
  const { t } = useTranslation();
  const colors = useAppColors();
  const { language, tamilNumerals, holidayCategories, newYearLabel } = useAppSelector(
    (state) => state.settings,
  );
  const isTamil = language === 'ta';
  const locale = isTamil ? ta : enIN;
  const data = useActiveData();
  const location = AppConstants.defaultLocation;
  const { timeZone } = location;

  const reminders = useReminders();
  const digits = (value: number) =>
    tamilNumerals && isTamil ? toTamilNumerals(value) : String(value);
  const timeOf = (instant: Date | null) =>
    instant ? format(new TZDate(instant, timeZone), 'HH:mm') : NO_VALUE;
  const date = parseISO(isoDate);

  const tamilDate = getTamilDate(data.months, isoDate);
  const sun = getSunTimes(isoDate, location);
  const noon = new Date(
    new TZDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      NOON_HOUR,
      0,
      0,
      timeZone,
    ).getTime(),
  );
  const moon = getMoonInfo(moonAt ?? noon);

  const newYear =
    tamilDate && isTamilNewYear(tamilDate.month, tamilDate.day, newYearLabel)
      ? [
          {
            id: 'tamil-new-year',
            name: t('day.tamilNewYear'),
            categoryLabel: t('today.holidayCategory.cultural'),
            appliesTo: '',
            reminderOn: false,
            onToggleReminder: undefined,
          },
        ]
      : [];

  const holidays = [
    ...newYear,
    ...filterHolidaysByCategory(holidaysOn(data.holidays, isoDate), holidayCategories).map(
      (holiday) => ({
        id: holiday.id,
        name: isTamil ? holiday.name_ta : holiday.name_en,
        categoryLabel: t(`today.holidayCategory.${holiday.category}`),
        appliesTo: holiday.applies_to.map((a) => t(`day.appliesTo.${a}`)).join(', '),
        reminderOn: reminders.isOn(holidayReminderKey(holiday.id)),
        onToggleReminder: (enabled: boolean) =>
          reminders.toggle(
            {
              spec: {
                key: holidayReminderKey(holiday.id),
                kind: 'once',
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
              },
              title: isTamil ? holiday.name_ta : holiday.name_en,
              body: t(`today.holidayCategory.${holiday.category}`),
            },
            enabled,
          ),
      }),
    ),
  ].filter((holiday, index, all) => all.findIndex((h) => h.name === holiday.name) === index);

  const commemorations = commemorationsOn(data.commemorations, isoDate).map((item) => ({
    id: item.id,
    name: isTamil ? item.name_ta : item.name_en,
    kindLabel: t(`day.commemorationKind.${item.kind}`),
    description: isTamil ? item.description_ta : item.description_en,
    designations: (item.designations ?? []).map((d) => (isTamil ? d.name_ta : d.name_en)),
    reminderOn: reminders.isOn(commemorationReminderKey(item.id)),
    onToggleReminder: (enabled: boolean) =>
      reminders.toggle(
        {
          spec: {
            key: commemorationReminderKey(item.id),
            kind: 'yearly',
            month: item.month,
            day: item.day,
          },
          title: isTamil ? item.name_ta : item.name_en,
          body: t(`day.commemorationKind.${item.kind}`),
        },
        enabled,
      ),
  }));

  const year = date.getFullYear();
  const eclipses = useMemo(
    () =>
      getEclipsesInYear(year, timeZone)
        .filter((eclipse) => eclipse.date === isoDate)
        .map((eclipse) => ({
          id: `${eclipse.type}-${eclipse.date}`,
          label: t('day.eclipse.label', {
            kind: t(`day.eclipse.${eclipse.kind}`),
            type: t(`day.eclipse.${eclipse.type}`),
          }),
        })),
    [year, timeZone, isoDate, t],
  );

  const sunrise: SkyItem = { label: t('today.sunrise'), value: timeOf(sun.sunrise) };
  const sunset: SkyItem = { label: t('today.sunset'), value: timeOf(sun.sunset) };
  const moonItem: MoonItem = {
    label: t('today.moon'),
    value: t(`today.moonPhase.${moon.phase}`),
    angle: moon.angle,
    illumination: moon.illumination,
  };

  const kural = kuralOfTheDay(data.kurals, isoDate);
  const adhikaram = kural ? data.adhikarams.find((a) => a.number === kural.adhikaram) : undefined;
  const meaningReviewed = kural?.meaning_ta_reviewed_by != null;

  const kuralView = kural
    ? {
        title: t('today.kural.title'),
        numberText: digits(kural.number),
        numberLabel: t('today.kural.number', { number: digits(kural.number) }),
        adhikaramName: adhikaram ? (isTamil ? adhikaram.name_ta : adhikaram.name_en) : '',
        lines: kural.lines_ta,
        meaning: isTamil ? kural.meaning_ta : kural.explanation_en,
        meaningNote: isTamil ? kural.meaning_ta_note : undefined,
        // The unverified label and report action stay visible until a human reviewer signs off.
        unverifiedLabel: isTamil && !meaningReviewed ? t('today.kural.unverified') : undefined,
        textReviewLabel:
          kural.text_status === 'needs_review' ? t('today.kural.textUnderReview') : undefined,
        reportLabel: t('today.kural.report'),
      }
    : null;

  const onReportKural = () => {
    if (!kural) return;
    const params = new URLSearchParams({
      template: ApiConstants.kuralCorrectionTemplate,
      title: `Kural ${kural.number}`,
      body: `Kural: ${kural.number}\nApp version: ${Constants.expoConfig?.version ?? 'unknown'}`,
    });
    Linking.openURL(`${ApiConstants.repoUrl}/issues/new?${params.toString()}`);
  };

  return {
    colors,
    hero: tamilDate
      ? {
          day: digits(tamilDate.day),
          monthName: isTamil ? tamilDate.nameTa : tamilDate.nameEn,
          yearLabel: t('today.yearLabel', { year: digits(tamilDate.thiruvalluvarYear) }),
          weekdayLabel: format(date, 'EEEE', { locale }),
          gregorianLabel: format(date, 'd MMMM yyyy', { locale }),
          isRedLetter: getDay(date) === 0 || holidays.length > 0,
        }
      : null,
    outOfRangeLabel: t('day.outOfRange'),
    gregorianOnly: format(date, 'EEEE, d MMMM yyyy', { locale }),
    holidays,
    commemorations,
    commemorationsTitle: t('day.onThisDay'),
    eclipses,
    eclipseNote: t('day.eclipse.note'),
    sunrise,
    sunset,
    moon: moonItem,
    kural: kuralView,
    onReportKural,
    reminderUi: {
      switchLabel: reminders.switchLabel,
      message: reminders.message,
      openSettingsLabel: reminders.openSettingsLabel,
      onOpenSettings: reminders.onOpenSettings,
    },
  };
}
