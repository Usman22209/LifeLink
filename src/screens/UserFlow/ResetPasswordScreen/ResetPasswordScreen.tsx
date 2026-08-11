import React from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
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
import { useResetPasswordForm } from "@shared/forms/hooks/useResetPasswordForm";
import type { ResetPasswordFormValues } from "@shared/forms/schemas/resetPassword.schema";
import { AUTH_SERVICE } from "@shared/api/service/auth.service";
import Toast from "react-native-toast-message";

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.RESET_PASSWORD
>;

type ResetPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof ROUTES.RESET_PASSWORD
>;

const ResetPasswordScreen = ({ route }: ResetPasswordScreenProps) => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useResetPasswordForm();

  const accessToken =
    route.params?.accessToken ||
    route.params?.access_token ||
    route.params?.token;

  console.log("ResetPasswordScreen - accessToken:", accessToken);

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    if (!accessToken) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: "Invalid or missing recovery token.",
      });
      return;
    }

    try {
      console.log("Reset Password Request - Data:", {
        password: data.newPassword,
      });
      const response = await AUTH_SERVICE.resetPassword(
        { password: data.newPassword },
        accessToken,
      );
      console.log("Reset Password Response:", response.data);

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: t("common.success"),
          text2:
            response.data.message || "Password has been reset successfully.",
        });
        navigation.navigate(ROUTES.LOGIN);
      } else {
        Toast.show({
          type: "error",
          text1: t("common.error"),
          text2: response.data.message || "Failed to reset password.",
        });
      }
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2:
          error?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      });
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
          <Text bold FONT_18 style={[styles.title, { color: colors.text }]}>
            {t("resetPassword.title")}
          </Text>
          <Text
            FONT_14
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {t("resetPassword.subtitle")}
          </Text>

          <AppInput
            name="newPassword"
            control={control}
            label={t("resetPassword.newPassword")}
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder={t("resetPassword.newPasswordPlaceholder")}
            secureText={true}
            error={errors.newPassword?.message}
          />

          <AppInput
            name="confirmPassword"
            control={control}
            label={t("resetPassword.confirmPassword")}
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder={t("resetPassword.confirmPasswordPlaceholder")}
            secureText={true}
            error={errors.confirmPassword?.message}
          />

          <AppButton
            title={t("resetPassword.resetButton")}
            onPress={handleSubmit(handleResetPassword)}
            loading={isSubmitting}
            style={{ marginTop: verticalScale(12) }}
          />
        </View>
      </KeyboardAwareContainer>
    </ScreenWrapper>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  keyboardContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: scale(16),
    marginTop: verticalScale(-50),
  },
  logoContainer: { alignItems: "center", marginBottom: verticalScale(6) },
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
});
