import React, { useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "./ChatsListScreen.styles";

import ChatItem, { ChatThread } from "./components/ChatItem";
import EmptyChats from "./components/EmptyChats";
import { MOCK_THREADS } from "@shared/constants/mockData";

const ChatsListScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
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
      disableBottomSafeArea={true}
      scrollable={false}
      style={styles.wrapper}
      header={
        <AppHeader
          title={t("chats.title")}
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
