import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
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
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useChangePasswordForm } from "@shared/forms/hooks/useChangePasswordForm";
import type { ChangePasswordFormValues } from "@shared/forms/schemas/changePassword.schema";

type ChangePasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.CHANGE_PASSWORD
>;

type ChangePasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  typeof ROUTES.CHANGE_PASSWORD
>;

const ChangePasswordScreen = ({ route }: ChangePasswordScreenProps) => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const theme = useContext(ThemeContext);

  const isLightMode = useSelector(selectIsLightMode);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useChangePasswordForm();
  const { accessToken } = route.params;

  const handleChangePassword = (data: ChangePasswordFormValues) => {
    // TODO: Make API call to change password with data.newPassword
    console.log("Change password:", data);

    navigation.navigate(ROUTES.LOGIN);
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
            Change Password
          </Text>
          <Text
            FONT_14
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Enter your new password below.
          </Text>

          <AppInput
            name="newPassword"
            control={control}
            label="New Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Enter your new password"
            secureText={true}
            error={errors.newPassword?.message}
          />

          <AppInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Confirm your new password"
            secureText={true}
            error={errors.confirmPassword?.message}
          />

          <AppButton
            title="Change Password"
            onPress={handleSubmit(handleChangePassword)}
            loading={isSubmitting}
            style={{ marginTop: verticalScale(12) }}
          />
        </View>
      </KeyboardAwareContainer>
    </ScreenWrapper>
  );
};

export default ChangePasswordScreen;

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
