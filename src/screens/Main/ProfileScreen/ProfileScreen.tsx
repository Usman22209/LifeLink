import React from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppButton from "@components/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@store/slices/authSlice";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import { useLogout } from "@shared/query/auth/useLogout";
import type { MainStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

type ProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  typeof ROUTES.PROFILE
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();

  const handleLogout = async () => {
    logoutMutate();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text
          bold
          FONT_24
          style={{ color: colors.text, marginBottom: verticalScale(20) }}
        >
          Profile
        </Text>
        {user && (
          <View
            style={{ alignItems: "center", marginBottom: verticalScale(20) }}
          >
            <Text FONT_16 style={{ color: colors.textSecondary }}>
              Name: {user.full_name}
            </Text>
            <Text FONT_16 style={{ color: colors.textSecondary }}>
              Email: {user.email}
            </Text>
          </View>
        )}
        <AppButton
          title="Go Back"
          onPress={handleGoBack}
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

export default ProfileScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },
});
