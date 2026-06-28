import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { ROUTES } from "@utils/Routes";
import HomeScreen from "@screens/Main/HomeScreen";
import FeedScreen from "@screens/Main/FeedScreen";
import RequestScreen from "@screens/Main/RequestScreen";
import ProfileScreen from "@screens/Main/ProfileScreen";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import type { MainTabParamList } from "@shared/interfaces/navigation/navigation-params.interface";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON_SIZE = moderateScale(22);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 0.5,
    height: Platform.OS === "ios" ? verticalScale(80) : verticalScale(60),
    paddingTop: verticalScale(6),
    paddingBottom: Platform.OS === "ios" ? verticalScale(22) : verticalScale(8),
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(10),
    marginTop: verticalScale(2),
  },
});

const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.gray600,
  tabBarStyle: styles.tabBar,
  tabBarLabelStyle: styles.tabBarLabel,
};

const MainFlow = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name={ROUTES.HOME}
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          <AnyIcon
            type={Icons.Feather}
            name="home"
            size={TAB_ICON_SIZE}
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
        tabBarIcon: ({ color }) => (
          <AnyIcon
            type={Icons.Ionicons}
            name="newspaper-outline"
            size={TAB_ICON_SIZE}
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
        tabBarIcon: ({ color }) => (
          <AnyIcon
            type={Icons.MaterialCommunityIcons}
            name="water-plus-outline"
            size={TAB_ICON_SIZE}
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
        tabBarIcon: ({ color }) => (
          <AnyIcon
            type={Icons.Feather}
            name="user"
            size={TAB_ICON_SIZE}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainFlow;
