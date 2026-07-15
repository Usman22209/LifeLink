import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatsListScreen.styles";

const EmptyChats = () => {
  return (
    <View style={styles.emptyState}>
      <AnyIcon
        type={Icons.Feather}
        name="message-square"
        size={moderateScale(48)}
        color={colors.gray300}
      />
      <AppText bold FONT_15 style={styles.emptyTitle}>
        No Chats Yet
      </AppText>
      <AppText regular FONT_12 style={styles.emptySubtitle}>
        Browse requests in Feed and message requesters to start coordinates and saving lives.
      </AppText>
    </View>
  );
};

export default EmptyChats;
