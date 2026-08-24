import React, { useCallback } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { useChatThreads, useMarkThreadAsRead } from "@shared/query/chat/useChat";
import { styles } from "./ChatsListScreen.styles";

import ChatItem, { ChatThread } from "./components/ChatItem";
import EmptyChats from "./components/EmptyChats";

const ChatsListScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { data: chatThreadsData, isLoading, refetch } = useChatThreads();
  const { mutate: markReadMutate } = useMarkThreadAsRead();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const threads: ChatThread[] = Array.isArray(chatThreadsData?.data)
    ? chatThreadsData.data
    : Array.isArray(chatThreadsData)
    ? chatThreadsData
    : [];

  const handleThreadPress = (item: ChatThread) => {
    markReadMutate(item.id);
    (navigation as any).navigate(ROUTES.CHAT, {
      request: item.request,
      threadId: item.id,
    });
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
      {isLoading && threads.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={threads}
          renderItem={({ item }) => (
            <ChatItem item={item} onPress={handleThreadPress} />
          )}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyChats />}
        />
      )}
    </ScreenWrapper>
  );
};

export default ChatsListScreen;
