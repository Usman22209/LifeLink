import React from "react";
import { View, TouchableOpacity } from "react-native";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import { colors } from "@theme/colors";
import { styles } from "../ChatsListScreen.styles";

export interface ChatThread {
  id: string;
  request: {
    id: string;
    bloodType: string;
    patientName: string;
    hospital: string;
    city: string;
    patientImage?: string;
    units: number;
    urgency: "critical" | "urgent" | "normal";
    time: string;
    distance: string;
    latitude?: number;
    longitude?: number;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatItemProps {
  item: ChatThread;
  onPress: (item: ChatThread) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ item, onPress }) => {
  const isUnread = item.unreadCount > 0;
  return (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.avatarContainer}>
        <AppImage
          source={{
            uri:
              item.request.patientImage ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
          }}
          style={styles.avatar}
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <AppText bold FONT_14 style={styles.nameText}>
              {item.request.patientName}
            </AppText>
            <View style={styles.bloodBadge}>
              <AppText bold style={styles.bloodText}>
                {item.request.bloodType}
              </AppText>
            </View>
          </View>
          <AppText
            style={[
              styles.timeText,
              isUnread && { color: colors.primary, fontWeight: "600" },
            ]}
          >
            {item.time}
          </AppText>
        </View>

        <View style={styles.bottomRow}>
          <AppText
            numberOfLines={1}
            style={[styles.messageText, isUnread && styles.unreadText]}
          >
            {item.lastMessage}
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
