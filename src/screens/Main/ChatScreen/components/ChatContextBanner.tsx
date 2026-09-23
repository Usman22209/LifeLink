import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatScreen.styles";

interface ChatContextBannerProps {
  bloodType: string;
  hospital: string;
  onPress?: () => void;
}

const ChatContextBanner: React.FC<ChatContextBannerProps> = ({
  bloodType,
  hospital,
  onPress,
}) => {
  const content = (
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
      {Boolean(onPress) && (
        <AnyIcon
          type={Icons.Feather}
          name="chevron-right"
          size={moderateScale(13)}
          color={colors.primary}
          style={{ marginStart: 4 }}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default ChatContextBanner;
