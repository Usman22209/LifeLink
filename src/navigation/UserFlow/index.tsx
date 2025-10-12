import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '@shared/i18n';
import { colors } from '@theme/colors';
import { fontFamily } from '@theme/fonts';

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const switchToUrdu = () => i18n.changeLanguage('ur');
  const switchToEnglish = () => i18n.changeLanguage('en');

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{t('welcome')}</Text>

      <TouchableOpacity style={styles.button} onPress={switchToEnglish}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={switchToUrdu}>
        <Text style={styles.buttonText}>Urdu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.black ?? '#000',
    fontFamily: fontFamily.MEDIUM,
  },
  button: {
    backgroundColor: colors.primary ?? '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white ?? '#fff',
    fontSize: 16,
    fontFamily: fontFamily.SEMIBOLD,
  },
});

export default LanguageSwitcher;
