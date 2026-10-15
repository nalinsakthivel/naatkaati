import {
  initialSettingsState,
  isAppearance,
  isLanguage,
  parseHolidayCategories,
  setHolidayCategory,
  setNewYearLabel,
  setOnboardingDone,
  setLanguage,
  setTamilNumerals,
  setAppearance,
  settingsReducer,
  setWidgetVariant,
  toggleFavoriteWidget,
} from '../settingsSlice';

describe('settingsSlice', () => {
  it('defaults to system appearance', () => {
    expect(initialSettingsState.appearance).toBe('system');
  });

  it('sets appearance', () => {
    expect(settingsReducer(initialSettingsState, setAppearance('dark')).appearance).toBe('dark');
  });

  it('validates stored appearance values', () => {
    expect(isAppearance('light')).toBe(true);
    expect(isAppearance('purple')).toBe(false);
    expect(isAppearance(undefined)).toBe(false);
  });
});

describe('settingsSlice language and numerals', () => {
  it('defaults to Tamil with Arabic numerals', () => {
    expect(initialSettingsState.language).toBe('ta');
    expect(initialSettingsState.tamilNumerals).toBe(false);
  });

  it('sets language and numerals', () => {
    const withEn = settingsReducer(initialSettingsState, setLanguage('en'));
    expect(withEn.language).toBe('en');
    expect(settingsReducer(withEn, setTamilNumerals(true)).tamilNumerals).toBe(true);
  });

  it('validates stored language values', () => {
    expect(isLanguage('ta')).toBe(true);
    expect(isLanguage('fr')).toBe(false);
  });
});

describe('settingsSlice holiday categories and new year label', () => {
  it('shows every category by default', () => {
    expect(initialSettingsState.holidayCategories).toEqual(['state_govt', 'central_govt', 'banks']);
    expect(initialSettingsState.newYearLabel).toBe('thai');
  });

  it('turns a category off and back on, keeping a stable order', () => {
    const off = settingsReducer(
      initialSettingsState,
      setHolidayCategory({ category: 'central_govt', enabled: false }),
    );
    expect(off.holidayCategories).toEqual(['state_govt', 'banks']);
    const on = settingsReducer(
      off,
      setHolidayCategory({ category: 'central_govt', enabled: true }),
    );
    expect(on.holidayCategories).toEqual(['state_govt', 'central_govt', 'banks']);
  });

  it('sets the new year label', () => {
    expect(settingsReducer(initialSettingsState, setNewYearLabel('chithirai')).newYearLabel).toBe(
      'chithirai',
    );
  });

  it('parses stored categories, dropping unknown values', () => {
    expect(parseHolidayCategories(undefined)).toEqual(['state_govt', 'central_govt', 'banks']);
    expect(parseHolidayCategories('banks,bogus')).toEqual(['banks']);
    expect(parseHolidayCategories('')).toEqual([]);
  });
});

describe('settingsSlice onboarding', () => {
  it('starts not done and can be completed', () => {
    expect(initialSettingsState.onboardingDone).toBe(false);
    expect(settingsReducer(initialSettingsState, setOnboardingDone(true)).onboardingDone).toBe(
      true,
    );
  });
});

describe('settingsSlice widgets', () => {
  it('defaults to the classic widget with classic as the only favourite', () => {
    expect(initialSettingsState.widgetVariant).toBe('classic');
    expect(initialSettingsState.widgetFavorites).toEqual(['classic']);
  });

  it('selects a widget and toggles favourites', () => {
    const selected = settingsReducer(initialSettingsState, setWidgetVariant('kural'));
    expect(selected.widgetVariant).toBe('kural');
    const favored = settingsReducer(selected, toggleFavoriteWidget('kural'));
    expect(favored.widgetFavorites).toEqual(['classic', 'kural']);
    expect(settingsReducer(favored, toggleFavoriteWidget('classic')).widgetFavorites).toEqual([
      'kural',
    ]);
  });
});
