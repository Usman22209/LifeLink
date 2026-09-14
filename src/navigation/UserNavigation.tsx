import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthFlow from "./Auth";
import MainFlow from "./Main";
import CompleteProfileScreen from "@screens/UserFlow/Onboarding/CompleteProfileScreen";
import DonorQuestionnaireScreen from "@screens/UserFlow/Onboarding/DonorQuestionnaireScreen";
import RequestDetailScreen from "@screens/Main/RequestDetailScreen";
import ChatScreen from "@screens/Main/ChatScreen";
import NotificationsScreen from "@screens/Main/NotificationsScreen";
import MyDonationsScreen from "@screens/Main/MyDonationsScreen";
import MyRequestsScreen from "@screens/Main/MyRequestsScreen/MyRequestsScreen";
import TrackRequestScreen from "@screens/Main/TrackRequestScreen/TrackRequestScreen";
import HelpSupportScreen from "@screens/Main/HelpSupportScreen";
import PrivacyPolicyScreen from "@screens/Main/PrivacyPolicyScreen";
import { ROUTES } from "@utils/Routes";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "@store/slices/authSlice";

const Stack = createStackNavigator<UserStackParamList>();

export default function UserNavigation() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const isOnboarded =
    Boolean(user?.is_onboarded) ||
    Boolean(user?.phone && user?.blood_group);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name={ROUTES.AUTH_FLOW} component={AuthFlow} />
      ) : (
        <>
          {!isOnboarded ? (
            <Stack.Screen
              name={ROUTES.ONBOARDING}
              component={CompleteProfileScreen}
            />
          ) : (
            <Stack.Screen name={ROUTES.MAIN_FLOW} component={MainFlow} />
          )}
          <Stack.Screen
            name={ROUTES.REQUEST_DETAIL}
            component={RequestDetailScreen}
          />
          <Stack.Screen
            name={ROUTES.EDIT_PROFILE}
            component={CompleteProfileScreen}
            initialParams={{ isEditing: true }}
          />
          <Stack.Screen
            name={ROUTES.DONOR_QUESTIONNAIRE}
            component={DonorQuestionnaireScreen}
          />
          <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} />
          <Stack.Screen
            name={ROUTES.NOTIFICATIONS}
            component={NotificationsScreen}
          />
          <Stack.Screen
            name={ROUTES.MY_DONATIONS}
            component={MyDonationsScreen}
          />
          <Stack.Screen
            name={ROUTES.MY_REQUESTS}
            component={MyRequestsScreen}
          />
          <Stack.Screen
            name={ROUTES.TRACK_REQUEST}
            component={TrackRequestScreen}
          />
          <Stack.Screen
            name={ROUTES.HELP_SUPPORT}
            component={HelpSupportScreen}
          />
          <Stack.Screen
            name={ROUTES.PRIVACY_POLICY}
            component={PrivacyPolicyScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
