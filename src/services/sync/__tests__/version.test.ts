import { compareVersions } from '../version';

describe('compareVersions', () => {
  it('compares numerically, not lexically', () => {
    expect(compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
    expect(compareVersions('1.2.0', '1.10.0')).toBeLessThan(0);
  });

  it('treats equal versions as 0', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('treats missing parts as 0', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
  });
});
