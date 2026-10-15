import { useEffect, useMemo, useState } from 'react';
import { AppState, Linking } from 'react-native';
import Constants from 'expo-constants';
import { TZDate } from '@date-fns/tz';
import { format, getDay, parseISO } from 'date-fns';
import { enIN } from 'date-fns/locale/en-IN';
import { ta } from 'date-fns/locale/ta';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMoonInfo, getSunTimes } from '@/calendar/astronomy';
import { holidaysOn } from '@/calendar/holidays';
import { kuralOfTheDay } from '@/calendar/kural';
import { toTamilNumerals } from '@/calendar/numerals';
import { getTamilDate } from '@/calendar/tamilDate';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { getBundledData } from '@/services/bundledData';
import { ApiConstants } from '@/services/constants/ApiConstants';
import { useAppColors, useAppSelector } from '@/stores/hooks';
import type { MoonItem, SkyItem } from '@/components/SkyRow';

const NO_VALUE = '—';

export function useTodayScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { language, tamilNumerals } = useAppSelector((state) => state.settings);
  const [now, setNow] = useState(() => new Date());

  // Re-read the clock when the app returns to the foreground so the date never goes stale.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  const data = useMemo(() => getBundledData(), []);
  const { timeZone } = AppConstants.defaultLocation;
  const todayIso = getTodayIso(now, timeZone);
  const isTamil = language === 'ta';
  const digits = (value: number) =>
    tamilNumerals && isTamil ? toTamilNumerals(value) : String(value);
  const timeOf = (instant: Date | null) =>
    instant ? format(new TZDate(instant, timeZone), 'HH:mm') : NO_VALUE;

  const tamilDate = getTamilDate(data.months, todayIso);
  const sun = getSunTimes(todayIso, AppConstants.defaultLocation);
  const moon = getMoonInfo(now);

  const holidays = holidaysOn(data.holidays, todayIso)
    .map((holiday) => ({
      id: holiday.id,
      name: isTamil ? holiday.name_ta : holiday.name_en,
      categoryLabel: t(`today.holidayCategory.${holiday.category}`),
    }))
    .filter((holiday, index, all) => all.findIndex((h) => h.name === holiday.name) === index);

  const sunrise: SkyItem = { label: t('today.sunrise'), value: timeOf(sun.sunrise) };
  const sunset: SkyItem = { label: t('today.sunset'), value: timeOf(sun.sunset) };
  const moonItem: MoonItem = {
    label: t('today.moon'),
    value: t(`today.moonPhase.${moon.phase}`),
    angle: moon.angle,
    illumination: moon.illumination,
  };
  const isSunday = getDay(parseISO(todayIso)) === 0;

  const kural = kuralOfTheDay(data.kurals, todayIso);
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
    topInset: insets.top,
    hero: tamilDate
      ? {
          day: digits(tamilDate.day),
          monthName: isTamil ? tamilDate.nameTa : tamilDate.nameEn,
          yearLabel: t('today.yearLabel', { year: digits(tamilDate.thiruvalluvarYear) }),
          weekdayLabel: format(parseISO(todayIso), 'EEEE', { locale: isTamil ? ta : enIN }),
          gregorianLabel: format(parseISO(todayIso), 'd MMMM yyyy', {
            locale: isTamil ? ta : enIN,
          }),
          isRedLetter: isSunday || holidays.length > 0,
        }
      : null,
    locationLabel: t('today.location'),
    holidays,
    sunrise,
    sunset,
    moon: moonItem,
    kural: kuralView,
    onReportKural,
  };
}
