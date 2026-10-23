import { getColors } from '../Colors';

function luminance(hex: string): number {
  const rgb = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

it.each(['light', 'dark'] as const)(
  'keeps small adjacent-month labels readable in %s theme',
  (scheme) => {
    const colors = getColors(scheme);
    const l1 = luminance(colors.otherMonthText),
      l2 = luminance(colors.surface);
    expect((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toBeGreaterThanOrEqual(4.5);
  },
);

describe('getColors', () => {
  it('returns distinct light and dark tokens', () => {
    expect(getColors('light').background).not.toBe(getColors('dark').background);
  });

  it('defines every token in both themes', () => {
    expect(Object.keys(getColors('light')).sort()).toEqual(Object.keys(getColors('dark')).sort());
  });
});
