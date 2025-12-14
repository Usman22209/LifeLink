import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { ThemeContext } from "@providers/ThemeProvider";
import AppImage from "@components/AppImage";
import { AppImages } from "@assets/images";
import { Icons } from "@components/AnyIcon";
import KeyboardAwareContainer from "@components/KeyboardAwareContainer";
import AppInput from "@components/AppInput";
import AppButton from "@components/AppButton";
import { selectIsLightMode } from "@store/slices/themeSlice";
import { useSelector } from "react-redux";
import { ROUTES } from "@utils/Routes";
import type { AuthStackParamList } from "types/navigation";
import { useForgotPasswordForm } from "@shared/forms/hooks/useForgotPasswordForm";
import type { ForgotPasswordFormValues } from "@shared/forms/schemas/forgotPassword.schema";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.FORGOT_PASSWORD
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const theme = useContext(ThemeContext);
  const isLightMode = useSelector(selectIsLightMode);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForgotPasswordForm();

  const handleResetPassword = (data: ForgotPasswordFormValues) => {
    console.log("Reset password for:", data.email);
  };

  return (
    <ScreenWrapper
      scrollable={false}
      backgroundColor={theme.background}
      safeArea
      style={styles.wrapper}
    >
      <KeyboardAwareContainer contentContainerStyle={styles.keyboardContent}>
        <View style={styles.logoContainer}>
          <AppImage
            source={
              isLightMode
                ? AppImages.AppLogoHorizontal
                : AppImages.DarkAppLogoHorizontal
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text bold FONT_18 style={[styles.title, { color: theme.text }]}>
            Forgot Password?
          </Text>
          <Text
            FONT_14
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <AppInput
            name="email"
            control={control}
            label="Email"
            iconType={Icons.Feather}
            iconName="mail"
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <AppButton
            title="Send Reset Link"
            onPress={handleSubmit(handleResetPassword)}
            loading={isSubmitting}
            style={{ marginTop: verticalScale(12) }}
          />

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: theme.textSecondary }}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
            >
              <Text bold FONT_14 style={{ color: theme.primary }}>
                Login
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
  logoContainer: { alignItems: "center", marginBottom: verticalScale(20) },
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
