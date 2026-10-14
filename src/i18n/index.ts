import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppConstants } from '@/constants/AppConstants';
import en from './en.json';
import ta from './ta.json';

i18n.use(initReactI18next).init({
  resources: { ta: { translation: ta }, en: { translation: en } },
  lng: AppConstants.defaultLanguage,
  fallbackLng: AppConstants.fallbackLanguage,
  interpolation: { escapeValue: false },
});

export { i18n };
