import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { ThemeContext } from "@providers/ThemeProvider";
import AppButton from "@components/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@store/slices/authSlice";
import { ROUTES } from "@utils/Routes";
import type { MainStackParamList } from "types/navigation";

type HomeScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  typeof ROUTES.HOME
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGoToProfile = () => {
    navigation.navigate(ROUTES.PROFILE);
  };

  return (
    <ScreenWrapper
      backgroundColor={theme.background}
      safeArea
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text bold FONT_24 style={{ color: theme.text, marginBottom: verticalScale(20) }}>
          Welcome Home
        </Text>
        {user && (
          <Text FONT_16 style={{ color: theme.textSecondary, marginBottom: verticalScale(20) }}>
            Hello, {user.name}!
          </Text>
        )}
        <AppButton
          title="Go to Profile"
          onPress={handleGoToProfile}
          style={{ marginTop: verticalScale(20) }}
        />
        <AppButton
          title="Logout"
          onPress={handleLogout}
          style={{ marginTop: verticalScale(20) }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },
});