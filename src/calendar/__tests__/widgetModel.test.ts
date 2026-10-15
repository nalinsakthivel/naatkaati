import { buildWidgetModel, type WidgetInput } from '../widgetModel';
import { holidaysFileSchema } from '@/schemas/holidays';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import { thirukkuralFileSchema } from '@/schemas/thirukkural';
import holidaysRaw from '../../../data/holidays/2026.json';
import monthsRaw from '../../../data/tamil-months.json';
import kuralRaw from '../../../data/thirukkural.json';

const base: WidgetInput = {
  months: tamilMonthsFileSchema.parse(monthsRaw).months,
  holidays: holidaysFileSchema.parse(holidaysRaw).holidays,
  kurals: thirukkuralFileSchema.parse(kuralRaw).kurals,
  iso: '2026-01-15',
  language: 'ta',
  tamilNumerals: false,
  holidayCategories: ['state_govt', 'central_govt', 'banks'],
};

describe('buildWidgetModel', () => {
  it('builds the Tamil date, holiday and kural for a date', () => {
    const model = buildWidgetModel(base);
    expect(model).not.toBeNull();
    expect(model?.monthName).toBe('தை');
    expect(model?.holidayName).toBeTruthy();
    expect(model?.kuralLines).toHaveLength(2);
  });

  it('uses English names in English mode', () => {
    expect(buildWidgetModel({ ...base, language: 'en' })?.monthName).toBe('Thai');
  });

  it('uses Tamil numerals only in Tamil mode when enabled', () => {
    const tamil = buildWidgetModel({ ...base, tamilNumerals: true });
    expect(tamil?.day).toMatch(/^[௦-௯]+$/);
    const english = buildWidgetModel({ ...base, language: 'en', tamilNumerals: true });
    expect(english?.day).toMatch(/^\d+$/);
  });

  it('has no holiday on an ordinary day', () => {
    expect(buildWidgetModel({ ...base, iso: '2026-03-03' })?.holidayName).toBeNull();
  });

  it('hides a holiday when its category is turned off', () => {
    const onlyCentral = buildWidgetModel({ ...base, holidayCategories: [] });
    expect(onlyCentral?.holidayName).toBeNull();
  });

  it('returns null outside the date table', () => {
    expect(buildWidgetModel({ ...base, iso: '1850-01-01' })).toBeNull();
  });

  it('never shows yesterday: a new date gives a new model', () => {
    const a = buildWidgetModel({ ...base, iso: '2026-10-15' });
    const b = buildWidgetModel({ ...base, iso: '2026-10-16' });
    expect(a?.day).not.toBe(b?.day);
  });
});
