import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '@shared/i18n';
import { colors } from '@theme/colors';
import Text from '@components/AppText';
import ScreenWrapper from '@components/ScreenWrapper';

const LanguageSwitcher = () => {
  const { t } = useTranslation();

  const switchToUrdu = () => i18n.changeLanguage('ur');
  const switchToEnglish = () => i18n.changeLanguage('en');

  return (
    <ScreenWrapper
      statusBarColor={colors.white}
      statusBarStyle="dark-content"
      scrollable={false}
      backgroundColor={colors.white}
    >
      <View style={styles.container}>
        <Text style={styles.welcome}>{t('welcome')}</Text>

        <TouchableOpacity style={styles.button} onPress={switchToEnglish}>
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={switchToUrdu}>
          <Text style={styles.buttonText}>Urdu</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default LanguageSwitcher;
