import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatScreen.styles";

interface TypingBubbleProps {
  patientImage?: string;
  isTyping: boolean;
}

const TypingBubble: React.FC<TypingBubbleProps> = ({
  patientImage,
  isTyping,
}) => {
  if (!isTyping) return null;
  return (
    <View style={[styles.messageRow, styles.otherMessageRow]}>
      {patientImage ? (
        <AppImage source={{ uri: patientImage }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.defaultMessageAvatar]}>
          <AnyIcon
            type={Icons.Feather}
            name="user"
            size={moderateScale(14)}
            color={colors.textSecondary}
          />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          styles.otherMessageBubble,
          styles.typingBubble,
        ]}
      >
        <View style={styles.typingDotContainer}>
          <View style={[styles.typingDot, { opacity: 0.4 }]} />
          <View style={[styles.typingDot, { opacity: 0.7 }]} />
          <View style={[styles.typingDot, { opacity: 1 }]} />
        </View>
      </View>
    </View>
  );
};

export default TypingBubble;
