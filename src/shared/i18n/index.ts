import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import ur from './ur.json';

const LANGUAGE_STORAGE_KEY = 'appLanguage';

const resources = {
  en: { translation: en },
  ur: { translation: ur }
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(storedLang => {
        if (storedLang) {
          callback(storedLang);
          return;
        }
        const locales = RNLocalize.getLocales();
        if (Array.isArray(locales) && locales.length > 0) {
          // pick languageCode (e.g., "en", "ur")
          callback(locales[0].languageCode);
        } else {
          callback('en');
        }
      })
      .catch(() => callback('en'));
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng).catch(() => {});
  }
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
export { LANGUAGE_STORAGE_KEY };
