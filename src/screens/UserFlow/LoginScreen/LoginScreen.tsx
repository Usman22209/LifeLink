import React, { useContext, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { ThemeContext } from "@providers/ThemeProvider";
import AppImage from "@components/AppImage";
import { AppImages } from "@assets/images";
import { Icons } from "@components/AnyIcon";
import AnySvg from "@components/AnySvg";
import KeyboardAwareContainer from "@components/KeyboardAwareContainer";
import AppInput from "@components/AppInput";
import AppButton from "@components/AppButton";
import { selectIsLightMode } from "@store/slices/themeSlice";
import { useSelector } from "react-redux";
import { ROUTES } from "@utils/Routes";
import type { AuthStackParamList } from "types/navigation";
import { useLogin } from "@shared/query/auth/useLogin";
import { useGoogleLogin } from "@shared/query/auth/useGoogleLogin";
import useGoogleSignIn from "@shared/hooks/auth/useGoogleSignin";

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.LOGIN
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const theme = useContext(ThemeContext);
  const isLightMode = useSelector(selectIsLightMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();
  const { signIn } = useGoogleSignIn();

  const handleLogin = () => {
    if (!email || !password) {
      // Perhaps show toast for validation
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn();
      const idToken = result.data?.idToken;
      console.log("Google ID Token:", idToken);
      googleLoginMutation.mutate({ idToken });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
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
          <AppInput
            label="Email"
            iconType={Icons.Feather}
            iconName="mail"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AppInput
            label="Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureText={true}
          />

          <TouchableOpacity
            style={styles.forgotContainer}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
          >
            <Text medium FONT_14 style={{ color: theme.primary }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Login"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            style={{ marginTop: verticalScale(12) }}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text
              medium
              FONT_12
              style={[styles.dividerText, { color: theme.textSecondary }]}
            >
              OR
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.85}
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
              style={[styles.googleText, { color: theme.text }]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: theme.textSecondary }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(ROUTES.SIGNUP)}
            >
              <Text bold FONT_14 style={{ color: theme.primary }}>
                Sign Up
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
