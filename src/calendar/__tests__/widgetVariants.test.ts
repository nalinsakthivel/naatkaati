import {
  DEFAULT_WIDGET_VARIANT,
  isWidgetVariant,
  parseWidgetFavorites,
  toggleWidgetFavorite,
} from '../widgetVariants';

describe('widget variants', () => {
  it('validates stored variant ids', () => {
    expect(isWidgetVariant('kural')).toBe(true);
    expect(isWidgetVariant('huge')).toBe(false);
    expect(isWidgetVariant(undefined)).toBe(false);
  });

  it('defaults to classic', () => {
    expect(DEFAULT_WIDGET_VARIANT).toBe('classic');
    expect(parseWidgetFavorites(undefined)).toEqual(['classic']);
  });

  it('parses stored favourites, dropping unknown values and keeping a stable order', () => {
    expect(parseWidgetFavorites('culture,bogus,classic')).toEqual(['classic', 'culture']);
    expect(parseWidgetFavorites('')).toEqual([]);
  });

  it('toggles a favourite on and off', () => {
    const added = toggleWidgetFavorite(['classic'], 'kural');
    expect(added).toEqual(['classic', 'kural']);
    expect(toggleWidgetFavorite(added, 'classic')).toEqual(['kural']);
  });
});
