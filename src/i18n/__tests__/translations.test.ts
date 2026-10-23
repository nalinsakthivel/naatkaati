import { createInstance } from 'i18next';
import { i18n } from '../index';
import en from '../en.json';
import ta from '../ta.json';

type TranslationTree = { [key: string]: string | TranslationTree };

function leaves(tree: TranslationTree, prefix = ''): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) =>
      typeof value === 'string'
        ? [[`${prefix}${key}`, value]]
        : Object.entries(leaves(value, `${prefix}${key}.`)),
    ),
  );
}

const tamil = leaves(ta);
const english = leaves(en);
const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*([^}]+?)\s*}}/g)].map((m) => m[1]).sort();

describe('Tamil-first translations', () => {
  it('has matching Tamil and English keys', () => {
    expect(Object.keys(tamil).sort()).toEqual(Object.keys(english).sort());
  });

  it.each(Object.keys(tamil))('%s preserves interpolation fields and meaningful text', (key) => {
    expect(placeholders(tamil[key])).toEqual(placeholders(english[key]));
    // Idle sync intentionally has no visible status text.
    if (key !== 'data.idle') {
      expect(tamil[key].trim()).not.toBe('');
      expect(english[key].trim()).not.toBe('');
    }
  });

  it('renders Tamil by default and switches to English without losing interpolation', async () => {
    expect(i18n.options.lng).toBe('ta');
    const instance = createInstance();
    await instance.init({
      lng: 'ta',
      fallbackLng: 'en',
      resources: { ta: { translation: ta }, en: { translation: en } },
      interpolation: { escapeValue: false },
    });
    expect(instance.t('tabs.today')).toBe('இன்று');
    expect(instance.t('today.yearLabel', { year: 2057 })).toContain('2057');
    await instance.changeLanguage('en');
    expect(instance.t('tabs.today')).toBe('Today');
    expect(instance.t('today.yearLabel', { year: 2057 })).toContain('2057');
  });
});
