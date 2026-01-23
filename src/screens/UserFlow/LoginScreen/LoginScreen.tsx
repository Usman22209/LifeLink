import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import ScreenWrapper from "@components/ScreenWrapper";
import useTranslation from "@shared/hooks/useTranslation";
import Text from "@components/AppText";
import AppImage from "@components/AppImage";
import { AppImages } from "@assets/images";
import { Icons } from "@components/AnyIcon";
import AnySvg from "@components/AnySvg";
import KeyboardAwareContainer from "@components/KeyboardAwareContainer";
import AppInput from "@components/AppInput";
import AppButton from "@components/AppButton";
import { useSelector } from "react-redux";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useLogin } from "@shared/query/auth/useLogin";
import { useGoogleLogin } from "@shared/query/auth/useGoogleLogin";
import useGoogleSignIn from "@shared/hooks/auth/useGoogleSignin";

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.LOGIN
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: loginMutate, isPending: loginPending } = useLogin();
  const { mutate: googleLoginMutate, isPending: googleLoginPending } = useGoogleLogin();
  const { signIn } = useGoogleSignIn();

  const handleLogin = () => {
    if (!email || !password) {
      return;
    }
    loginMutate({ email, password });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn();
      const idToken = result.data?.idToken;
      console.log("Google ID Token:", idToken);
      googleLoginMutate({ idToken });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <ScreenWrapper
      scrollable={false}
      backgroundColor={colors.background}
      safeArea
      style={styles.wrapper}
    >
      <KeyboardAwareContainer contentContainerStyle={styles.keyboardContent}>
        <View style={styles.logoContainer}>
          <AppImage
            source={AppImages.AppLogoHorizontal}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <AppInput
            label={t("login.email")}
            iconType={Icons.Feather}
            iconName="mail"
            placeholder={t("login.emailPlaceholder")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AppInput
            label={t("login.password")}
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder={t("login.passwordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureText={true}
          />

          <TouchableOpacity
            style={styles.forgotContainer}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
          >
            <Text medium FONT_14 style={{ color: colors.primary }}>
              {t("login.forgotPassword")}
            </Text>
          </TouchableOpacity>

          <AppButton
            title={t("login.loginButton")}
            onPress={handleLogin}
            loading={loginPending}
            style={{ marginTop: verticalScale(12) }}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text
              medium
              FONT_12
              style={[styles.dividerText, { color: colors.textSecondary }]}
            >
              {t("login.or")}
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.85}
            disabled={googleLoginPending}
          >
            <View style={styles.googleIconWrapper}>
              <AnySvg
                name="google"
                width={moderateScale(24)}
                height={moderateScale(24)}
              />
            </View>
            <Text
              semiBold
              FONT_14
              style={[styles.googleText, { color: colors.text }]}
            >
              {googleLoginPending ? t("login.loading") : t("login.continueWithGoogle")}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: colors.textSecondary }}>
              {t("login.noAccount")}{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ROUTES.SIGNUP)}
            >
              <Text bold FONT_14 style={{ color: colors.primary }}>
                {t("login.signUpLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareContainer>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  keyboardContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: scale(16),
  },
  logoContainer: { alignItems: "center", marginBottom: verticalScale(6) },
  logo: { width: scale(250), height: verticalScale(180) },
  formContainer: { width: "100%", paddingHorizontal: 0 },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: verticalScale(-6),
    marginBottom: verticalScale(8),
  },
  dividerContainer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: scale(16) },
  googleButton: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
  },
  googleIconWrapper: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    [I18nManager.isRTL ? "marginLeft" : "marginRight"]: scale(12),
  },
  googleText: {},
  footer: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
});
