import React from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppButton from "@components/AppButton";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import { useLogout } from "@shared/query/auth/useLogout";
import type { MainStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

type HomeScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  typeof ROUTES.HOME
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useSelector(selectUser);
  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();

  const handleLogout = async () => {
    logoutMutate();
  };

  const handleGoToProfile = () => {
    navigation.navigate(ROUTES.PROFILE);
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text bold FONT_24 style={{ color: colors.text, marginBottom: verticalScale(20) }}>
          Welcome Home
        </Text>
        {user && (
          <Text
            FONT_16
            style={{ color: colors.textSecondary, marginBottom: verticalScale(20) }}
          >
            Hello, {user.full_name || user.email}!
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
          loading={logoutPending}
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