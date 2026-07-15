import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatsListScreen.styles";

interface ChatThread {
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

const MOCK_THREADS: ChatThread[] = [
  {
    id: "thread_1",
    request: {
      id: "1",
      bloodType: "B+",
      patientName: "Ahmed Khan",
      hospital: "Mayo Hospital",
      city: "Lahore",
      patientImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      units: 3,
      urgency: "critical",
      time: "2h ago",
      distance: "3.2 km",
      latitude: 31.5723,
      longitude: 74.3213,
    },
    lastMessage: "We urgently need 3 units at Mayo Hospital. Are you available?",
    time: "2h ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "thread_2",
    request: {
      id: "4",
      bloodType: "AB-",
      patientName: "Bilal Raza",
      hospital: "Shaukat Khanum",
      city: "Lahore",
      patientImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      units: 4,
      urgency: "critical",
      time: "30m ago",
      distance: "7.0 km",
      latitude: 31.4285,
      longitude: 74.2796,
    },
    lastMessage: "Bless you! What time are you planning to visit?",
    time: "30m ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "thread_3",
    request: {
      id: "2",
      bloodType: "A-",
      patientName: "Sara Malik",
      hospital: "Jinnah Hospital",
      city: "Lahore",
      patientImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      units: 2,
      urgency: "urgent",
      time: "4h ago",
      distance: "5.1 km",
      latitude: 31.4806,
      longitude: 74.303,
    },
    lastMessage: "Thank you so much! Please coordinate with the receptionist.",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: false,
  },
];

const ChatsListScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);

  const handleThreadPress = (item: ChatThread) => {
    // Clear unread badge locally on press
    setThreads((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, unreadCount: 0 } : t)),
    );

    // Navigate directly to the ChatScreen
    (navigation as any).navigate(ROUTES.CHAT, { request: item.request });
  };

  const renderChatItem = ({ item }: { item: ChatThread }) => {
    const isUnread = item.unreadCount > 0;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        activeOpacity={0.7}
        onPress={() => handleThreadPress(item)}
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <AnyIcon
        type={Icons.Feather}
        name="message-square"
        size={moderateScale(48)}
        color={colors.gray300}
      />
      <AppText bold FONT_15 style={styles.emptyTitle}>
        No Chats Yet
      </AppText>
      <AppText regular FONT_12 style={styles.emptySubtitle}>
        Browse requests in Feed and message requesters to start coordinates and saving lives.
      </AppText>
    </View>
  );

  const renderCustomHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: scale(16),
          paddingTop: Math.max(insets.top, verticalScale(12)),
          paddingBottom: verticalScale(12),
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0, 0, 0, 0.05)",
          backgroundColor: colors.white,
        }}
      >
        <AppText bold FONT_18 style={{ color: colors.text }}>
          Messages
        </AppText>
      </View>
    );
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      scrollable={false}
      style={styles.wrapper}
      header={
        <AppHeader
          title="Messages"
          showBackButton={true}
          titleSize={15}
          hasBorder={true}
        />
      }
    >
      <FlatList
        data={threads}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </ScreenWrapper>
  );
};

export default ChatsListScreen;
