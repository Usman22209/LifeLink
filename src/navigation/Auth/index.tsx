import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthFlow from "./Auth";
import MainFlow from "./Main";
import CompleteProfileScreen from "@screens/UserFlow/Onboarding/CompleteProfileScreen";
import RequestDetailScreen from "@screens/Main/RequestDetailScreen";
import { ROUTES } from "@utils/Routes";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "@store/slices/authSlice";

const Stack = createStackNavigator<UserStackParamList>();

export default function UserNavigation() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const isOnboarded = user?.is_onboarded || false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name={ROUTES.AUTH_FLOW} component={AuthFlow} />
      ) : !isOnboarded ? (
        <Stack.Screen
          name={ROUTES.ONBOARDING}
          component={CompleteProfileScreen}
        />
      ) : (
        <>
          <Stack.Screen name={ROUTES.MAIN_FLOW} component={MainFlow} />
          <Stack.Screen
            name={ROUTES.REQUEST_DETAIL}
            component={RequestDetailScreen}
          />
          <Stack.Screen
            name={ROUTES.EDIT_PROFILE}
            component={CompleteProfileScreen}
            initialParams={{ isEditing: true }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

