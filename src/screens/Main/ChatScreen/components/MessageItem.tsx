import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
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

  const defaultAvatarNode = (
    <View style={[styles.avatar, styles.defaultMessageAvatar]}>
      <AnyIcon
        type={Icons.Feather}
        name="user"
        size={moderateScale(14)}
        color={colors.textSecondary}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.messageRow,
        isMe ? styles.myMessageRow : styles.otherMessageRow,
      ]}
    >
      {!isMe &&
        (patientImage ? (
          <AppImage
            source={{ uri: patientImage }}
            style={styles.avatar}
            placeholder={defaultAvatarNode}
            fallbackComponent={defaultAvatarNode}
          />
        ) : (
          defaultAvatarNode
        ))}
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
