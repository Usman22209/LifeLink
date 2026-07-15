import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { ROUTES } from "@utils/Routes";
import HomeScreen from "@screens/Main/HomeScreen";
import FeedScreen from "@screens/Main/FeedScreen";
import RequestScreen from "@screens/Main/RequestScreen";
import ChatsListScreen from "@screens/Main/ChatsListScreen";
import ProfileScreen from "@screens/Main/ProfileScreen";
import AnyIcon, { Icons } from "@components/AnyIcon";
import AnimatedTabBar from "./AnimatedTabBar";
import useTranslation from "@shared/hooks/useTranslation";
import type { MainTabParamList } from "@shared/interfaces/navigation/navigation-params.interface";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON_SIZE = moderateScale(21);

const MainFlow = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <AnyIcon
              type={Icons.Feather}
              name="home"
              size={size || TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.FEED}
        component={FeedScreen}
        options={{
          tabBarLabel: t("tabs.feed"),
          tabBarIcon: ({ color, size }) => (
            <AnyIcon
              type={Icons.Ionicons}
              name="newspaper-outline"
              size={size || TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.REQUEST}
        component={RequestScreen}
        options={{
          tabBarLabel: t("tabs.request"),
          tabBarIcon: ({ color, size }) => (
            <AnyIcon
              type={Icons.Feather}
              name="plus"
              size={size || moderateScale(26)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CHATS_LIST}
        component={ChatsListScreen}
        options={{
          tabBarLabel: t("tabs.chats"),
          tabBarIcon: ({ color, size }) => (
            <AnyIcon
              type={Icons.Feather}
              name="message-square"
              size={size || TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <AnyIcon
              type={Icons.Feather}
              name="user"
              size={size || TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainFlow;
