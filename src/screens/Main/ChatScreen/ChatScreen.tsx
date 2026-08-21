import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, View } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import { colors } from "@theme/colors";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatScreen.styles";

import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import useTranslation from "@shared/hooks/useTranslation";
import { useChatMessages, useSendMessage } from "@shared/query/chat/useChat";
import ChatHeader from "./components/ChatHeader";
import ChatContextBanner from "./components/ChatContextBanner";
import MessageItem, { Message } from "./components/MessageItem";
import MessageInput from "./components/MessageInput";
import TypingBubble from "./components/TypingBubble";

type ChatScreenRouteProp = RouteProp<UserStackParamList, typeof ROUTES.CHAT>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const { request } = route.params;
  const threadId = (route.params as any)?.threadId || request?.id || "";

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");

  const { data: remoteMessagesData, isLoading } = useChatMessages(threadId);
  const { mutate: sendMessageMutate } = useSendMessage();

  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const messages: Message[] = useMemo(() => {
    const rawMsgs =
      remoteMessagesData?.messages ||
      (Array.isArray(remoteMessagesData) ? remoteMessagesData : []);

    const serverFormatted: Message[] = rawMsgs.map((m: any) => ({
      id: String(m.id),
      text: m.text,
      createdAt: new Date(m.sent_at || m.created_at || Date.now()),
      senderId: m.sender_id === user?.id ? "me" : "them",
    }));

    // Merge server messages with unsynced local optimistic messages for instant 0ms UI feedback
    const serverTexts = new Set(serverFormatted.map((m) => m.text));
    const pendingLocal = localMessages.filter((m) => !serverTexts.has(m.text));

    return [...serverFormatted, ...pendingLocal];
  }, [remoteMessagesData, localMessages, user]);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 100);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length, scrollToBottom]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    // 1. Optimistic Message (0ms latency UI update)
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      text: textToSend,
      createdAt: new Date(),
      senderId: "me",
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);

    // 2. Background API Call
    const payload = {
      ...(threadId ? { thread_id: threadId } : {}),
      ...(request?.id ? { request_id: request.id } : {}),
      text: textToSend,
    };

    sendMessageMutate(payload);
    scrollToBottom(true);
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea={true}
      scrollable={false}
      style={styles.wrapper}
      header={
        <ChatHeader
          patientName={request.patientName}
          patientImage={request.patientImage}
          onBackPress={() => navigation.goBack()}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? verticalScale(40) : 0}
      >
        <ChatContextBanner
          bloodType={request.bloodType}
          hospital={request.hospital}
        />

        {isLoading && messages.length === 0 ? (
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
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageItem item={item} patientImage={request.patientImage} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToBottom(true)}
            onLayout={() => scrollToBottom(false)}
          />
        )}

        <MessageInput
          inputText={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatScreen;
