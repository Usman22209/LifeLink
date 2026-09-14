import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
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
    requester_id?: string;
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
  const user = useSelector(selectUser);
  const { isUserOnline } = usePresence();
  const isUnread = (item?.unreadCount ?? 0) > 0;
  const request = item?.request;
  const participant = (item as any)?.participant;
  const isValidAvatar = (url?: string | null) =>
    Boolean(
      url &&
        typeof url === "string" &&
        url.trim().length > 0 &&
        !url.includes("cdn.lifelink.org") &&
        (url.startsWith("http://") || url.startsWith("https://"))
    );

  const rawImage =
    participant?.avatar ||
    participant?.profile_image ||
    participant?.avatar_url ||
    (request as any)?.requester?.profile_image ||
    request?.patientImage;
  const patientImage = isValidAvatar(rawImage) ? rawImage : null;
  const isGeneric = (name?: string | null) =>
    !name || !name.trim() || name.trim().toLowerCase() === "user";

  const patientName =
    (!isGeneric(participant?.name) && participant?.name) ||
    (!isGeneric(request?.patientName) && request?.patientName) ||
    (!isGeneric((request as any)?.requester?.full_name) && (request as any)?.requester?.full_name) ||
    "User";
  const bloodType = request?.bloodType || "";

  const participantId = useMemo(() => {
    if (participant?.id && participant.id !== "usr_unknown" && String(participant.id).toLowerCase() !== String(user?.id).toLowerCase()) {
      return String(participant.id);
    }
    const donorId = (item as any)?.donor_id;
    if (donorId && donorId !== "usr_unknown" && String(donorId).toLowerCase() !== String(user?.id).toLowerCase()) {
      return String(donorId);
    }
    const requesterId = (item as any)?.requester_id || (request as any)?.requester_id || (request as any)?.user?.id;
    if (requesterId && requesterId !== "usr_unknown" && String(requesterId).toLowerCase() !== String(user?.id).toLowerCase()) {
      return String(requesterId);
    }
    return participant?.id && participant.id !== "usr_unknown" ? participant.id : null;
  }, [participant?.id, (item as any)?.donor_id, (item as any)?.requester_id, (request as any)?.requester_id, (request as any)?.user?.id, user?.id]);

  const isOnline = Boolean(
    participantId ? isUserOnline(participantId) : item?.isOnline
  );

  const defaultAvatarNode = (
    <View style={[styles.avatar, styles.defaultAvatar]}>
      <AnyIcon
        type={Icons.Feather}
        name="user"
        size={moderateScale(22)}
        color={colors.textSecondary}
      />
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={styles.avatarContainer}>
        {patientImage ? (
          <AppImage
            source={{ uri: patientImage }}
            style={styles.avatar}
            placeholder={defaultAvatarNode}
            fallbackComponent={defaultAvatarNode}
          />
        ) : (
          defaultAvatarNode
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
