import React from "react";
import { View, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { colors } from "@theme/colors";

const NotificationsScreen = () => {
  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text bold FONT_24 style={{ color: colors.text }}>
          Notifications
        </Text>
        <Text
          FONT_14
          style={{ color: colors.textSecondary, marginTop: verticalScale(8) }}
        >
          Your alerts and updates will appear here
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },
});
