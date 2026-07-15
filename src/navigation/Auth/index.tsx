import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "@utils/Routes";
import WelcomeScreen from "@screens/UserFlow/WelcomeScreen";
import LoginScreen from "@screens/UserFlow/LoginScreen";
import SignupScreen from "@screens/UserFlow/SignupScreen";
import ForgotPasswordScreen from "@screens/UserFlow/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "@screens/UserFlow/ResetPasswordScreen";
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthFlow = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} />
    <Stack.Screen
      name={ROUTES.FORGOT_PASSWORD}
      component={ForgotPasswordScreen}
    />
    <Stack.Screen
      name={ROUTES.RESET_PASSWORD}
      component={ResetPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthFlow;
