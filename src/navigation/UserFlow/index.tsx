import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "@screens/Common/SplashScreen";
import AuthFlow from "./Auth";
import MainFlow from "./Main";
import { ROUTES } from "@utils/Routes";
import { UserStackParamList } from "types/navigation";

const Stack = createStackNavigator<UserStackParamList>();

export default function UserNavigation() {
  const token = null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      {token ? (
        <Stack.Screen name={ROUTES.MAIN_FLOW} component={MainFlow} />
      ) : (
        <Stack.Screen name={ROUTES.AUTH_FLOW} component={AuthFlow} />
      )}
    </Stack.Navigator>
  );
}
