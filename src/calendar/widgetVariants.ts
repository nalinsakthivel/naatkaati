/** The home-screen widget layouts the user can pick between. */
export type WidgetVariant = 'classic' | 'minimal' | 'kural' | 'culture';

export const WIDGET_VARIANTS: readonly WidgetVariant[] = ['classic', 'minimal', 'kural', 'culture'];

export const DEFAULT_WIDGET_VARIANT: WidgetVariant = 'classic';

export function isWidgetVariant(value: string | undefined): value is WidgetVariant {
  return WIDGET_VARIANTS.some((variant) => variant === value);
}

/** Parses a stored comma-separated list. Unknown values are dropped; undefined gives the default. */
export function parseWidgetFavorites(value: string | undefined): WidgetVariant[] {
  if (value === undefined) return [DEFAULT_WIDGET_VARIANT];
  const stored = value.split(',');
  return WIDGET_VARIANTS.filter((variant) => stored.includes(variant));
}

/** Adds or removes a favourite, keeping the order of `WIDGET_VARIANTS`. */
export function toggleWidgetFavorite(
  favorites: readonly WidgetVariant[],
  variant: WidgetVariant,
): WidgetVariant[] {
  const next = favorites.includes(variant)
    ? favorites.filter((item) => item !== variant)
    : [...favorites, variant];
  return WIDGET_VARIANTS.filter((item) => next.includes(item));
}
