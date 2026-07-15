import React from "react";
import { View } from "react-native";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import { styles } from "../ChatScreen.styles";

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  senderId: "me" | "them";
}

interface MessageItemProps {
  item: Message;
  patientImage?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ item, patientImage }) => {
  const isMe = item.senderId === "me";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.myMessageRow : styles.otherMessageRow,
      ]}
    >
      {!isMe && (
        <AppImage
          source={{
            uri:
              patientImage ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
          }}
          style={styles.avatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <AppText
          style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </AppText>
        <AppText
          style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.otherMessageTime,
          ]}
        >
          {formatTime(item.createdAt)}
        </AppText>
      </View>
    </View>
  );
};

export default MessageItem;
