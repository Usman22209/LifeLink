import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

import en from "./en.json";
import ur from "./ur.json";

const LANGUAGE_STORAGE_KEY = "appLanguage";

const resources = {
  en: { translation: en },
  ur: { translation: ur },
};

// RTL Languages
const RTL_LANGUAGES = ["ur", "ar"];

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((storedLang) => {
        if (storedLang) {
          callback(storedLang);
          return;
        }
        const locales = RNLocalize.getLocales();
        if (Array.isArray(locales) && locales.length > 0) {
          callback(locales[0].languageCode);
        } else {
          callback("en");
        }
      })
      .catch(() => callback("en"));
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng).catch(() => {});
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Set initial RTL based on current language
const currentLanguage = i18n.language || "en";
const isRTL = RTL_LANGUAGES.includes(currentLanguage);
if (I18nManager.isRTL !== isRTL) {
  I18nManager.forceRTL(isRTL);
  I18nManager.allowRTL(isRTL);
}

export default i18n;
export { LANGUAGE_STORAGE_KEY, RTL_LANGUAGES };
