import React from "react";
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
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useSignupForm } from "@shared/forms/hooks/useSignupForm";
import type { SignupFormValues } from "@shared/forms/schemas/signup.schema";
import { useSignup } from "@shared/query/auth/useSignup";
import { useGoogleLogin } from "@shared/query/auth/useGoogleLogin";
import useGoogleSignIn from "@shared/hooks/auth/useGoogleSignin";
import { colors } from "@theme/colors";

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.SIGNUP
>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useSignupForm();
  const { mutate: signupMutate, isPending: signupPending } = useSignup();
  const { mutate: googleLoginMutate, isPending: googleLoginPending } =
    useGoogleLogin();
  const { signIn } = useGoogleSignIn();

  const handleSignup = (data: SignupFormValues) => {
    signupMutate({ email: data.email, password: data.password });
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signIn();
      const idToken = result?.data?.idToken;
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
            name="email"
            control={control}
            label={t("signup.email")}
            iconType={Icons.Feather}
            iconName="mail"
            placeholder={t("signup.emailPlaceholder")}
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <AppInput
            name="password"
            control={control}
            label={t("signup.password")}
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder={t("signup.passwordPlaceholder")}
            secureText={true}
            error={errors.password?.message}
          />

          <AppInput
            name="confirmPassword"
            control={control}
            label={t("signup.confirmPassword")}
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-reset"
            iconSize={moderateScale(24)}
            placeholder={t("signup.confirmPasswordPlaceholder")}
            secureText={true}
            error={errors.confirmPassword?.message}
          />

          <AppButton
            title={t("signup.signUpButton")}
            onPress={handleSubmit(handleSignup)}
            loading={signupPending}
            style={{ marginTop: verticalScale(12) }}
          />

          <View style={styles.dividerContainer}>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <Text
              medium
              FONT_12
              style={[styles.dividerText, { color: colors.textSecondary }]}
            >
              {t("signup.or")}
            </Text>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignup}
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
              {googleLoginPending
                ? t("signup.loading")
                : t("signup.continueWithGoogle")}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: colors.textSecondary }}>
              {t("signup.haveAccount")}{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text bold FONT_14 style={{ color: colors.primary }}>
                {t("signup.loginLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareContainer>
    </ScreenWrapper>
  );
};

export default SignupScreen;

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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: scale(16) },
  googleButton: {
    flexDirection: "row",
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
    marginRight: scale(12),
  },
  googleText: {},
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
});
