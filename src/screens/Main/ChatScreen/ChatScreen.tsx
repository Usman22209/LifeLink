import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import { colors } from "@theme/colors";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatScreen.styles";

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
  const { request } = route.params;
  const threadId = (route.params as any)?.threadId || request?.id || "thread_1";

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");

  const { data: remoteMessagesData } = useChatMessages(threadId);
  const { mutate: sendMessageMutate } = useSendMessage();

  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const messages: Message[] = useMemo(() => {
    if (remoteMessagesData?.messages && Array.isArray(remoteMessagesData.messages) && remoteMessagesData.messages.length > 0) {
      return remoteMessagesData.messages.map((m: any) => ({
        id: m.id,
        text: m.text,
        createdAt: new Date(m.sent_at || m.created_at || Date.now()),
        senderId: m.sender_id === "me" || m.sender_id === request.id ? "me" : "them",
      }));
    }

    if (localMessages.length > 0) {
      return localMessages;
    }

    return [
      {
        id: "1",
        text: `Hi, thank you for reaching out regarding the ${request.bloodType} blood request for ${request.patientName}.`,
        createdAt: new Date(Date.now() - 3600000),
        senderId: "them",
      },
      {
        id: "2",
        text: `We urgently need ${request.units} units at ${request.hospital}. Are you eligible and available to donate?`,
        createdAt: new Date(Date.now() - 3500000),
        senderId: "them",
      },
    ];
  }, [remoteMessagesData, localMessages, request]);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 150);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMessage: Message = {
      id: Math.random().toString(),
      text: textToSend,
      createdAt: new Date(),
      senderId: "me",
    };

    setLocalMessages((prev) => [...prev, newMessage]);
    sendMessageMutate({ thread_id: threadId, text: textToSend });
    scrollToBottom();
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
