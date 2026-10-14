import {
  initialSettingsState,
  isAppearance,
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
