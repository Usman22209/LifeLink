import React, { useContext, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
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

type ChangePasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof ROUTES.CHANGE_PASSWORD>;
type ChangePasswordScreenRouteProp = RouteProp<AuthStackParamList, typeof ROUTES.CHANGE_PASSWORD>;

const ChangePasswordScreen = () => {
  const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
  const route = useRoute<ChangePasswordScreenRouteProp>();
  const { accessToken } = route.params;
  const theme = useContext(ThemeContext);
  const isLightMode = useSelector(selectIsLightMode)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      // TODO: Show error message
      console.log("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      // TODO: Show error message
      console.log("Password too short");
      return;
    }
    console.log("Change password with token:", accessToken, "new password:", newPassword, "confirm:", confirmPassword);
    // TODO: Make API call to change password
    // After successful password change, navigate to login
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
            source={isLightMode ? AppImages.AppLogoHorizontal : AppImages.DarkAppLogoHorizontal}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text
            bold
            FONT_18
            style={[styles.title, { color: theme.text }]}
          >
            Change Password
          </Text>
          <Text
            FONT_14
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Enter your new password below.
          </Text>

          <AppInput
            label="New Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureText={true}
          />

          <AppInput
            label="Confirm Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureText={true}
          />

          <AppButton
            title="Change Password"
            onPress={handleChangePassword}
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