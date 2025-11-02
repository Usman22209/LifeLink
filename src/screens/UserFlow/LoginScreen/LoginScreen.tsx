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

const LoginScreen = () => {
  const theme = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    // Handle login logic
    console.log("Login with:", email, password);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic
    console.log("Google login");
  };

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.background}
      safeArea
      style={styles.wrapper}
    >
      <View style={styles.logoContainer}>
        <AppImage
          source={AppImages.AppLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.headerContainer}>
        <Text
          light
          FONT_14
          style={{ color: theme.textSecondary }}
        >
          Sign in to continue to your account
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <Text semiBold FONT_14 style={[styles.label, { color: theme.text }]}>
            Email
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: emailFocused ? theme.primary : theme.border,
                backgroundColor: theme.card,
                borderWidth: emailFocused ? 1.5 : 1,
              },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name="mail"
              size={moderateScale(20)}
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

        {/* Password Input */}
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
                borderWidth: passwordFocused ? 1.5 : 1,
              },
            ]}
          >
            <AnyIcon
              type={Icons.MaterialCommunityIcons}
              name="lock-outline"
              size={moderateScale(20)}
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
            >
              <AnyIcon
                type={Icons.MaterialCommunityIcons}
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={moderateScale(20)}
                color={theme.textSecondary}
              />

            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text medium FONT_14 style={{ color: theme.primary }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, { backgroundColor: theme.primary }]}
          activeOpacity={0.8}
        >
          <Text bold FONT_16 style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>

        {/* Divider */}
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

        {/* Google Login Button */}
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={[
            styles.googleButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          activeOpacity={0.8}
        >
          <AnySvg
            name="google"
            width={moderateScale(20)}
            height={moderateScale(20)}
            style={{ marginRight: scale(10) }}
          />
          <Text semiBold FONT_14 style={{ color: theme.text }}>
            Continue with Google
          </Text>
        </TouchableOpacity>


        {/* Footer */}
        <View style={styles.footer}>
          <Text FONT_14 style={{ color: theme.textSecondary }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text bold FONT_14 style={{ color: theme.primary }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: scale(24),
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: scale(180),
    height: verticalScale(150),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: verticalScale(20),
  },
  label: {
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(15),
  },
  eyeIcon: {
    padding: scale(4),
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(8),
  },
  button: {
    marginTop: verticalScale(16),
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: verticalScale(24),
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: scale(16),
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(28),
  },
});