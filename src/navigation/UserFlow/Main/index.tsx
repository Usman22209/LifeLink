import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ROUTES } from "@utils/Routes";
import HomeScreen from "@screens/Main/HomeScreen";
import ProfileScreen from "@screens/Main/ProfileScreen";
import type { MainStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

const Stack = createStackNavigator<MainStackParamList>();

const MainFlow = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
    <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
  </Stack.Navigator>
);

export default MainFlow;
