import { thirukkuralFileSchema } from '../thirukkural';
import raw from '../../../data/thirukkural.json';

describe('thirukkuralFileSchema', () => {
  it('accepts the bundled dataset with 1330 kurals', () => {
    const parsed = thirukkuralFileSchema.parse(raw);
    expect(parsed.kurals).toHaveLength(1330);
    expect(parsed.adhikarams).toHaveLength(133);
  });

  it('rejects a kural that does not have exactly two lines', () => {
    const bad = { ...raw, kurals: [{ ...raw.kurals[0], lines_ta: ['one line only'] }] };
    expect(thirukkuralFileSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an unknown text_status', () => {
    const bad = { ...raw, kurals: [{ ...raw.kurals[0], text_status: 'maybe' }] };
    expect(thirukkuralFileSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a missing meaning_ta_reviewed_by field', () => {
    const { meaning_ta_reviewed_by: _omitted, ...rest } = raw.kurals[0];
    expect(thirukkuralFileSchema.safeParse({ ...raw, kurals: [rest] }).success).toBe(false);
  });
});
