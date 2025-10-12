import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '@shared/i18n';
const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const switchToUrdu = () => i18n.changeLanguage('ur');
  const switchToEnglish = () => i18n.changeLanguage('en');

  return (
    <View>
      <Text>{t('welcome')}</Text>
      <Button title="English" onPress={switchToEnglish} />
      <Button title="Urdu" onPress={switchToUrdu} />
    </View>
  );
};

export default LanguageSwitcher;
