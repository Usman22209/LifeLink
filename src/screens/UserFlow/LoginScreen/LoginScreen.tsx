import React, { useContext } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { ThemeContext } from "@providers/ThemeProvider";
import { colors } from "@theme/colors";

const LoginScreen = () => {
  const theme = useContext(ThemeContext);

  return (
    <ScreenWrapper
      scrollable
      backgroundColor={theme.background}
      showNetworkBanner={true}
      safeArea
      style={styles.wrapper}
      centerContent
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text bold FONT_32 style={{ color: theme.primary }}>
          Welcome Back 👋
        </Text>
        <Text
          light
          FONT_16
          style={{ color: theme.textSecondary, marginTop: 6 }}
        >
          Sign in to continue to your account
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text semiBold FONT_14 style={styles.label}>
          Email
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={theme.placeholder}
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          keyboardType="email-address"
        />

        <Text semiBold FONT_14 style={[styles.label, { marginTop: 20 }]}>
          Password
        </Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={theme.placeholder}
          secureTextEntry
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotContainer}>
          <Text medium FONT_14 style={{ color: theme.primary }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <Text
            bold
            FONT_18
            style={{ color: colors.white, textAlign: "center" }}
          >
            Login
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text FONT_14 style={{ color: theme.textSecondary }}>
            Don’t have an account?{" "}
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
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers horizontally
    // paddingHorizontal: 24,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  button: {
    marginTop: 30,
    borderRadius: 12,
    paddingVertical: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
