import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "@utils/Routes";
import LoginScreen from "@screens/UserFlow/LoginScreen/LoginScreen";
import RegisterScreen from "@screens/UserFlow/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "@screens/UserFlow/ForgotPasswordScreen/ForgotPasswordScreen";
import type { AuthStackParamList } from "types/navigation";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthFlow = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
    <Stack.Screen
      name={ROUTES.FORGOT_PASSWORD}
      component={ForgotPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthFlow;
