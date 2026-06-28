import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { ROUTES } from "@utils/Routes";
import HomeScreen from "@screens/Main/HomeScreen";
import FeedScreen from "@screens/Main/FeedScreen";
import RequestScreen from "@screens/Main/RequestScreen";
import NotificationsScreen from "@screens/Main/NotificationsScreen";
import ProfileScreen from "@screens/Main/ProfileScreen";
import AnyIcon, { Icons } from "@components/AnyIcon";
import AnimatedTabBar from "./AnimatedTabBar";
import type { MainTabParamList } from "@shared/interfaces/navigation/navigation-params.interface";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON_SIZE = moderateScale(21);

const MainFlow = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <AnimatedTabBar {...props} />}
  >
    <Tab.Screen
      name={ROUTES.HOME}
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
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
        tabBarLabel: "Feed",
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
        tabBarLabel: "Request",
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
      name={ROUTES.NOTIFICATIONS}
      component={NotificationsScreen}
      options={{
        tabBarLabel: "Alerts",
        tabBarIcon: ({ color, size }) => (
          <AnyIcon
            type={Icons.Feather}
            name="bell"
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
        tabBarLabel: "Profile",
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

export default MainFlow;
