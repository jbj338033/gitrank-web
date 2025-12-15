import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './locales/ko.json';
import en from './locales/en.json';

const savedLocale = localStorage.getItem('locale') || 'ko';

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLocale,
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (locale: string) => {
  localStorage.setItem('locale', locale);
  i18n.changeLanguage(locale);
};

export default i18n;
