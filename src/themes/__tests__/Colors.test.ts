import { getColors } from '../Colors';

describe('getColors', () => {
  it('returns distinct light and dark tokens', () => {
    expect(getColors('light').background).not.toBe(getColors('dark').background);
  });

  it('defines every token in both themes', () => {
    expect(Object.keys(getColors('light')).sort()).toEqual(Object.keys(getColors('dark')).sort());
  });
});
