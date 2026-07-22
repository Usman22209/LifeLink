import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppImage from "@components/AppImage";
import { AppImages } from "@assets/images";
import { Icons } from "@components/AnyIcon";
import KeyboardAwareContainer from "@components/KeyboardAwareContainer";
import AppInput from "@components/AppInput";
import AppButton from "@components/AppButton";
import { useSelector } from "react-redux";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useForgotPasswordForm } from "@shared/forms/hooks/useForgotPasswordForm";
import { useForgotPassword } from "@query/auth/useForgotPassword";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.FORGOT_PASSWORD
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForgotPasswordForm();

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleResetPassword = (data: any) => {
    forgotPassword(data);
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
          <Text bold FONT_18 style={[styles.title, { color: colors.text }]}>
            {t("forgotPassword.title")}
          </Text>
          <Text
            FONT_14
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {t("forgotPassword.subtitle")}
          </Text>

          <AppInput
            name="email"
            control={control}
            label={t("forgotPassword.email")}
            iconType={Icons.Feather}
            iconName="mail"
            placeholder={t("forgotPassword.emailPlaceholder")}
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <AppButton
            title={t("forgotPassword.sendLink")}
            onPress={handleSubmit(handleResetPassword)}
            loading={isPending}
            style={{ marginTop: verticalScale(12) }}
          />

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: colors.textSecondary }}>
              {t("forgotPassword.rememberPassword")}{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text bold FONT_14 style={{ color: colors.primary }}>
                {t("forgotPassword.login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareContainer>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  keyboardContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(40),
  },
  logoContainer: { alignItems: "center" },
  logo: { width: scale(250), height: verticalScale(180) },
  formContainer: { width: "100%", paddingHorizontal: 0 },
  title: {
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(20),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
});
