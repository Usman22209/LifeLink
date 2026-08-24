import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatsListScreen.styles";

export interface ChatThread {
  id: string;
  request?: {
    id?: string;
    bloodType?: string;
    patientName?: string;
    hospital?: string;
    city?: string;
    patientImage?: string;
    units?: number;
    urgency?: "critical" | "urgent" | "normal";
    time?: string;
    distance?: string;
    latitude?: number;
    longitude?: number;
  };
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ChatItemProps {
  item: ChatThread;
  onPress: (item: ChatThread) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onPress }) => {
  const isUnread = (item?.unreadCount ?? 0) > 0;
  const request = item?.request;
  const patientImage = request?.patientImage;
  const patientName = request?.patientName || "User";
  const bloodType = request?.bloodType || "";

  return (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.avatarContainer}>
        {patientImage ? (
          <AppImage source={{ uri: patientImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <AnyIcon
              type={Icons.Feather}
              name="user"
              size={moderateScale(22)}
              color={colors.textSecondary}
            />
          </View>
        )}
        {item?.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <AppText bold FONT_14 style={styles.nameText}>
              {patientName}
            </AppText>
            {bloodType ? (
              <View style={styles.bloodBadge}>
                <AppText bold style={styles.bloodText}>
                  {bloodType}
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText
            style={[
              styles.timeText,
              isUnread && { color: colors.primary, fontWeight: "600" },
            ]}
          >
            {item?.time || ""}
          </AppText>
        </View>

        <View style={styles.bottomRow}>
          <AppText
            numberOfLines={1}
            style={[styles.messageText, isUnread && styles.unreadText]}
          >
            {item?.lastMessage || ""}
          </AppText>
          {isUnread && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>{item.unreadCount}</AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;
