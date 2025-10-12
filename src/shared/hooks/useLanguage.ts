import { useState, useEffect } from 'react';
import i18n, { LANGUAGE_STORAGE_KEY } from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLanguage = () => {
  const [locale, setLocale] = useState(i18n.language);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLang) setLocale(storedLang);
      } catch {}
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lng: 'en' | 'ur') => {
    try {
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      setLocale(lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return { locale, changeLanguage };
};

export default useLanguage;
