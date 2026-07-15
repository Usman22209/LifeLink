import React from "react";
import { View } from "react-native";
import AppImage from "@components/AppImage";
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
      <AppImage
        source={{
          uri:
            patientImage ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
        }}
        style={styles.avatar}
      />
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
