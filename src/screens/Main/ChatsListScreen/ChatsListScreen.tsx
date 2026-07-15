import React, { useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatsListScreen.styles";

import ChatItem, { ChatThread } from "./components/ChatItem";
import EmptyChats from "./components/EmptyChats";

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
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);

  const handleThreadPress = (item: ChatThread) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, unreadCount: 0 } : t)),
    );
    (navigation as any).navigate(ROUTES.CHAT, { request: item.request });
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
        renderItem={({ item }) => (
          <ChatItem item={item} onPress={handleThreadPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyChats />}
      />
    </ScreenWrapper>
  );
};

export default ChatsListScreen;
