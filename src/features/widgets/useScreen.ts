import { useState } from 'react';
import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { buildWidgetModel } from '@/calendar/widgetModel';
import { WIDGET_VARIANTS, type WidgetVariant } from '@/calendar/widgetVariants';
import { getTodayIso } from '@/calendar/today';
import { AppConstants } from '@/constants/AppConstants';
import { refreshWidgets } from '@/services/widgetRefresh';
import { useActiveData, useAppColors, useAppDispatch, useAppSelector } from '@/stores/hooks';
import { setWidgetVariant, toggleFavoriteWidget } from '@/stores/slices/settingsSlice';

export function useWidgetsScreen() {
  const { t } = useTranslation();
  const colors = useAppColors();
  const dispatch = useAppDispatch();
  const data = useActiveData();
  const { language, tamilNumerals, holidayCategories, widgetVariant, widgetFavorites } =
    useAppSelector((state) => state.settings);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const model = buildWidgetModel({
    months: data.months,
    holidays: data.holidays,
    commemorations: data.commemorations,
    kurals: data.kurals,
    iso: getTodayIso(new Date(), AppConstants.defaultLocation.timeZone),
    language,
    tamilNumerals,
    holidayCategories,
    location: AppConstants.defaultLocation,
  });

  const variants = WIDGET_VARIANTS.filter(
    (variant) => !onlyFavorites || widgetFavorites.includes(variant),
  ).map((variant) => {
    const name = t(`widgets.variant.${variant}.name`);
    const size = t(`widgets.variant.${variant}.size`);
    return {
      id: variant,
      name,
      size,
      description: t(`widgets.variant.${variant}.description`),
      selected: variant === widgetVariant,
      favorite: widgetFavorites.includes(variant),
      onSelect: () => {
        dispatch(setWidgetVariant(variant));
        // Settings are persisted by the store subscriber; the widget reads them from storage.
        setTimeout(refreshWidgets, 0);
      },
      onToggleFavorite: () => dispatch(toggleFavoriteWidget(variant)),
      onShare: () => {
        Share.share({ message: t('widgets.shareMessage', { name, size }) });
      },
    };
  });

  return {
    colors,
    model,
    yearLabel: model ? t('today.yearLabel', { year: model.year }) : '',
    labels: {
      appName: t('splash.name'),
      kuralTitle: t('today.kural.title'),
      eventTitle: t('widgets.dayNote'),
      introTitle: t('widgets.introTitle'),
      introBody: t('widgets.introBody'),
      all: t('widgets.all', { count: WIDGET_VARIANTS.length }),
      favorites: t('widgets.favorites', { count: widgetFavorites.length }),
      choose: t('widgets.choose'),
      chosen: t('widgets.chosen'),
      favorite: t('widgets.favorite'),
      share: t('widgets.share'),
      emptyTitle: t('widgets.emptyTitle'),
      emptyBody: t('widgets.emptyBody'),
      emptyAction: t('widgets.emptyAction'),
      note: t('widgets.note'),
      howTo: t('widgets.howTo'),
    },
    onlyFavorites,
    onShowAll: () => setOnlyFavorites(false),
    onShowFavorites: () => setOnlyFavorites(true),
    variants: variants as readonly (Omit<(typeof variants)[number], 'id'> & {
      id: WidgetVariant;
    })[],
  };
}
