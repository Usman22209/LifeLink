import React, { useCallback } from "react";
import { FlatList, View, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import {
  useChatThreads,
  useMarkThreadAsRead,
} from "@shared/query/chat/useChat";
import { styles } from "./ChatsListScreen.styles";

import ChatItem, { ChatThread } from "./components/ChatItem";
import EmptyChats from "./components/EmptyChats";

const ChatsListScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const { data: chatThreadsData, isLoading, refetch } = useChatThreads();
  const { mutate: markReadMutate } = useMarkThreadAsRead();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const rawThreads: any[] = Array.isArray(chatThreadsData?.data)
    ? chatThreadsData.data
    : Array.isArray(chatThreadsData)
      ? chatThreadsData
      : [];

  const threads: ChatThread[] = React.useMemo(() => {
    const seen = new Set<string>();
    return rawThreads.filter((t: any) => {
      const key = `${t.request_id || t.request?.id}_${t.participant?.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawThreads]);

  const handleThreadPress = (item: ChatThread) => {
    markReadMutate(item.id);
    (navigation as any).navigate(ROUTES.CHAT, {
      request: item.request,
      threadId: item.id,
      participant: (item as any)?.participant,
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
          onBackPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate(ROUTES.HOME as any)
          }
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
