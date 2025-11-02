import React, { useContext, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { ThemeContext } from "@providers/ThemeProvider";
import { colors } from "@theme/colors";
import AppImage from "@components/AppImage";
import { AppImages } from "@assets/images";
import AnyIcon, { Icons } from "@components/AnyIcon";
import AnySvg from "@components/AnySvg";
import KeyboardAwareContainer from "@components/KeyboardAwareContainer";

const LoginScreen = () => {
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    console.log("Login with:", email, password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
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
            source={AppImages.AppLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text
              semiBold
              FONT_14
              style={[styles.label, { color: theme.text }]}
            >
              Email
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: emailFocused ? theme.primary : theme.border,
                  backgroundColor: theme.card,
                  borderWidth: 1,
                },
              ]}
            >
              <AnyIcon
                type={Icons.Feather}
                name="mail"
                size={moderateScale(18)}
                color={emailFocused ? theme.primary : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={theme.placeholder}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={[styles.input, { color: theme.text }]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text
              semiBold
              FONT_14
              style={[styles.label, { color: theme.text }]}
            >
              Password
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: passwordFocused ? theme.primary : theme.border,
                  backgroundColor: theme.card,
                  borderWidth: 1,
                },
              ]}
            >
              <AnyIcon
                type={Icons.MaterialCommunityIcons}
                name="lock-outline"
                size={moderateScale(18)}
                color={passwordFocused ? theme.primary : theme.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={theme.placeholder}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                style={[styles.input, { color: theme.text }]}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <AnyIcon
                  type={Icons.MaterialCommunityIcons}
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={moderateScale(18)}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotContainer} activeOpacity={0.7}>
            <Text medium FONT_14 style={{ color: theme.primary }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
          >
            <Text bold FONT_16 style={styles.buttonText}>
              Login
            </Text>
          </TouchableOpacity>

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
                backgroundColor:
                  theme.mode === "dark" ? theme.card : colors.white,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.googleIconWrapper,
                { backgroundColor: colors.white, borderColor: theme.border },
              ]}
            >
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
            <TouchableOpacity activeOpacity={0.7}>
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
  logo: { width: scale(200), height: verticalScale(120) },
  formContainer: { width: "100%", paddingHorizontal: 0 },
  inputWrapper: { marginBottom: verticalScale(12) },
  label: { marginBottom: verticalScale(6) },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
  },
  inputIcon: { marginRight: scale(10) },
  input: { flex: 1, paddingVertical: verticalScale(8) },
  eyeIcon: { padding: scale(6) },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: verticalScale(-6),
    marginBottom: verticalScale(8),
  },
  button: {
    marginTop: verticalScale(12),
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: colors.white, textAlign: "center", letterSpacing: 0.3 },
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
