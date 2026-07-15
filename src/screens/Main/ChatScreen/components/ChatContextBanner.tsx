import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatScreen.styles";

interface ChatContextBannerProps {
  bloodType: string;
  hospital: string;
}

const ChatContextBanner: React.FC<ChatContextBannerProps> = ({
  bloodType,
  hospital,
}) => {
  return (
    <View style={styles.contextBanner}>
      <AnyIcon
        type={Icons.Feather}
        name="droplet"
        size={moderateScale(12)}
        color={colors.primary}
        style={styles.contextIcon}
      />
      <AppText regular style={styles.contextText}>
        Regarding{" "}
        <AppText bold style={styles.contextBold}>
          {bloodType}
        </AppText>{" "}
        blood request at{" "}
        <AppText bold style={styles.contextBold}>
          {hospital}
        </AppText>
      </AppText>
    </View>
  );
};

export default ChatContextBanner;
