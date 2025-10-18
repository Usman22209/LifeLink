import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "@shared/i18n";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@store/slices/themeSlice";
import { ThemeContext } from "@providers/ThemeProvider";
import { RootState } from "@store/store";
import { setLanguage } from "@store/slices/appSlice";
import AppImage from "@components/AppImage";
const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const mode = useSelector((state: RootState) => state.theme.mode);

  const switchLanguage = async (lang: "en" | "ur") => {
    await i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  useEffect(() => {
    const discoInterval = setInterval(() => {
      // dispatch(toggleTheme());
    }, 200);
    return () => clearInterval(discoInterval);
  }, [dispatch]);

  return (
    <ScreenWrapper
      statusBarColor={theme.background}
      statusBarStyle={mode === "dark" ? "light-content" : "dark-content"}
      scrollable={false}
      backgroundColor={theme.background}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.welcome, { color: theme.text }]}>{t("welcome")}</Text>
        <AppImage
          source={{
            uri: "https://avatars.githubusercontent.com/u/166890135?v=4",
          }}
          style={{ width: 200, height: 35, borderRadius: 50 }}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => switchLanguage("en")}
        >
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => switchLanguage("ur")}
        >
          <Text style={styles.buttonText}>Urdu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.card }]}
          onPress={() => dispatch(toggleTheme())}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Switch to {mode === "light" ? "Dark" : "Light"} Mode
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 160,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

export default LanguageSwitcher;
