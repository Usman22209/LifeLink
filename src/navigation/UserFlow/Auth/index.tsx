import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "@utils/Routes";
import LoginScreen from "@screens/UserFlow/LoginScreen";
import SignupScreen from "@screens/UserFlow/SignupScreen";
import ForgotPasswordScreen from "@screens/UserFlow/ForgotPasswordScreen/ForgotPasswordScreen";
import type { AuthStackParamList } from "types/navigation";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthFlow = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.SIGNUP} component={SignupScreen} />
    <Stack.Screen
      name={ROUTES.FORGOT_PASSWORD}
      component={ForgotPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthFlow;
