import { toTamilNumerals } from '../numerals';

describe('toTamilNumerals', () => {
  it('converts every digit', () => {
    expect(toTamilNumerals(1234567890)).toBe('௧௨௩௪௫௬௭௮௯௦');
  });

  it('leaves non-digits alone', () => {
    expect(toTamilNumerals('28-ஐப்பசி')).toBe('௨௮-ஐப்பசி');
  });
});
