import { buildWidgetModel, type WidgetInput } from '../widgetModel';
import { commemorationsFileSchema } from '@/schemas/commemorations';
import { holidaysFileSchema } from '@/schemas/holidays';
import { tamilMonthsFileSchema } from '@/schemas/tamilMonths';
import { thirukkuralFileSchema } from '@/schemas/thirukkural';
import holidaysRaw from '../../../data/holidays/2026.json';
import commemorationsRaw from '../../../data/commemorations.json';
import monthsRaw from '../../../data/tamil-months.json';
import kuralRaw from '../../../data/thirukkural.json';

const base: WidgetInput = {
  months: tamilMonthsFileSchema.parse(monthsRaw).months,
  holidays: holidaysFileSchema.parse(holidaysRaw).holidays,
  commemorations: commemorationsFileSchema.parse(commemorationsRaw).commemorations,
  kurals: thirukkuralFileSchema.parse(kuralRaw).kurals,
  iso: '2026-01-15',
  language: 'ta',
  tamilNumerals: false,
  holidayCategories: ['state_govt', 'central_govt', 'banks'],
  location: { latitude: 13.0827, longitude: 80.2707, timeZone: 'Asia/Kolkata' },
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

  it('adds weekday, Gregorian label, sun times and an event name for the richer layouts', () => {
    const model = buildWidgetModel({ ...base, language: 'en' });
    expect(model?.weekday).toBe('Thursday');
    expect(model?.gregorianLabel).toBe('15 January');
    expect(model?.monthYear).toBe('JAN 2026');
    expect(model?.sunrise).toMatch(/^\d{2}:\d{2}$/);
    expect(model?.sunset).toMatch(/^\d{2}:\d{2}$/);
    expect(model?.eventName).toBe(model?.holidayName);
  });
});
