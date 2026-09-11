import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { usePresence } from "@shared/providers/PresenceProvider";
import { styles } from "../ChatsListScreen.styles";

export interface ChatThread {
  id: string;
  request_id?: string;
  participant?: {
    id: string;
    name: string;
    avatar?: string;
    last_seen_at?: string;
    is_online?: boolean;
  };
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
  const { isUserOnline } = usePresence();
  const isUnread = (item?.unreadCount ?? 0) > 0;
  const request = item?.request;
  const participant = (item as any)?.participant;
  const patientImage = participant?.avatar || request?.patientImage;
  const patientName = participant?.name || request?.patientName || "User";
  const bloodType = request?.bloodType || "";

  const participantId =
    participant?.id ||
    (item as any)?.requester_id ||
    (item as any)?.donor_id ||
    (request as any)?.requester_id ||
    (request as any)?.user?.id;

  const isOnline = Boolean(
    (participantId && isUserOnline(participantId)) || item?.isOnline
  );

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
        {isOnline && <View style={styles.onlineIndicator} />}
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
