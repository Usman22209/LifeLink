import React, { useContext } from "react";
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
import { useSignupForm } from "@shared/forms/hooks/useSignupForm";
import type { SignupFormValues } from "@shared/forms/schemas/signup.schema";
import { useSignup } from "@shared/query/auth/useSignup";
import { useGoogleLogin } from "@shared/query/auth/useGoogleLogin";
import useGoogleSignIn from "@shared/hooks/auth/useGoogleSignin";

type SignupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.SIGNUP
>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const theme = useContext(ThemeContext);
  const isLightMode = useSelector(selectIsLightMode);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useSignupForm();
  const { mutate: signupMutate, isPending: signupPending } = useSignup();
  const { mutate: googleLoginMutate, isPending: googleLoginPending } = useGoogleLogin();
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
            name="email"
            control={control}
            label="Email"
            iconType={Icons.Feather}
            iconName="mail"
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email?.message}
          />

          <AppInput
            name="password"
            control={control}
            label="Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Enter your password"
            secureText={true}
            error={errors.password?.message}
          />

          <AppInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            iconType={Icons.MaterialCommunityIcons}
            iconName="lock-outline"
            placeholder="Confirm your password"
            secureText={true}
            error={errors.confirmPassword?.message}
          />

          <AppButton
            title="Sign Up"
            onPress={handleSubmit(handleSignup)}
            loading={signupPending}
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
            onPress={handleGoogleSignup}
            style={[
              styles.googleButton,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
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
              style={[styles.googleText, { color: theme.text }]}
            >
              {googleLoginPending ? "Loading..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text FONT_14 style={{ color: theme.textSecondary }}>
              Already have an account?{" "}
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
