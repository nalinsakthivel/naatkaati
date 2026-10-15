import { isTamilNewYear } from '../tamilNewYear';

describe('isTamilNewYear', () => {
  it('is Thai 1 when the label is thai', () => {
    expect(isTamilNewYear(10, 1, 'thai')).toBe(true);
    expect(isTamilNewYear(1, 1, 'thai')).toBe(false);
  });

  it('is Chithirai 1 when the label is chithirai', () => {
    expect(isTamilNewYear(1, 1, 'chithirai')).toBe(true);
    expect(isTamilNewYear(10, 1, 'chithirai')).toBe(false);
  });

  it('is only the first day of the month', () => {
    expect(isTamilNewYear(10, 2, 'thai')).toBe(false);
  });
});
