import {
  initialSettingsState,
  isAppearance,
  isLanguage,
  setLanguage,
  setTamilNumerals,
  setAppearance,
  settingsReducer,
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
