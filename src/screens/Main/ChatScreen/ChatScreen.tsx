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
import { useChatMessages, useSendMessage, useMarkThreadAsRead, chatKeys } from "@shared/query/chat/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@shared/config/supabase";
import ChatHeader from "./components/ChatHeader";
import ChatContextBanner from "./components/ChatContextBanner";
import MessageItem, { Message } from "./components/MessageItem";
import MessageInput from "./components/MessageInput";
import TypingBubble from "./components/TypingBubble";

type ChatScreenRouteProp = RouteProp<UserStackParamList, typeof ROUTES.CHAT>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const user = useSelector(selectUser);
  const request = route.params?.request;
  const patientName =
    request?.patientName ||
    (request as any)?.patient_name ||
    (request as any)?.user?.full_name ||
    "User";
  const patientImage =
    request?.patientImage ||
    (request as any)?.patient_image ||
    (request as any)?.user?.profile_image;
  const bloodType = request?.bloodType || (request as any)?.blood_group || "";
  const hospital = request?.hospital || (request as any)?.hospital_name || "";
  const threadId = (route.params as any)?.threadId || request?.id || "";

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const realtimeChannelRef = useRef<any>(null);

  const { data: remoteMessagesData, isLoading } = useChatMessages(threadId);
  const { mutate: sendMessageMutate } = useSendMessage();
  const { mutate: markReadMutate } = useMarkThreadAsRead();

  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Mark thread as read on mount / when threadId is available
  useEffect(() => {
    if (threadId) {
      markReadMutate(threadId);
    }
  }, [threadId, markReadMutate]);

  // Realtime Broadcast Channel for 0ms typing indicators and instant message delivery
  useEffect(() => {
    if (!threadId) return;

    const channelName = `chat_room_${threadId}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new;
          if (
            newMsg &&
            (newMsg.thread_id === threadId ||
              String(newMsg.request_id) === String(threadId))
          ) {
            queryClient.setQueryData(
              chatKeys.messages(threadId),
              (oldData: any) => {
                const rawList =
                  oldData?.messages || (Array.isArray(oldData) ? oldData : []);
                if (rawList.some((m: any) => String(m.id) === String(newMsg.id))) {
                  return oldData;
                }
                const updatedList = [...rawList, newMsg];
                return oldData?.messages
                  ? { ...oldData, messages: updatedList }
                  : updatedList;
              }
            );
            queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
          }
        }
      )
      .on("broadcast", { event: "message" }, ({ payload: newMsg }) => {
        if (newMsg) {
          queryClient.setQueryData(
            chatKeys.messages(threadId),
            (oldData: any) => {
              const rawList =
                oldData?.messages || (Array.isArray(oldData) ? oldData : []);
              if (rawList.some((m: any) => String(m.id) === String(newMsg.id))) {
                return oldData;
              }
              const updatedList = [...rawList, newMsg];
              return oldData?.messages
                ? { ...oldData, messages: updatedList }
                : updatedList;
            }
          );
          queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
        }
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload?.senderId && String(payload.senderId) !== String(user?.id)) {
          setIsOtherUserTyping(Boolean(payload.isTyping));
          if (payload.isTyping) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherUserTyping(false);
            }, 3500);
          }
        }
      })
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [threadId, user?.id, queryClient]);

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

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (realtimeChannelRef.current && user?.id) {
      if (text.trim().length > 0) {
        realtimeChannelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: { senderId: user.id, isTyping: true },
        });

        if (userTypingDebounceRef.current) clearTimeout(userTypingDebounceRef.current);
        userTypingDebounceRef.current = setTimeout(() => {
          realtimeChannelRef.current?.send({
            type: "broadcast",
            event: "typing",
            payload: { senderId: user.id, isTyping: false },
          });
        }, 2000);
      } else {
        realtimeChannelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: { senderId: user.id, isTyping: false },
        });
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    // Cancel typing broadcast immediately
    if (userTypingDebounceRef.current) clearTimeout(userTypingDebounceRef.current);
    realtimeChannelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { senderId: user?.id, isTyping: false },
    });

    // 1. Optimistic Message (0ms latency UI update)
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      text: textToSend,
      createdAt: new Date(),
      senderId: "me",
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);

    // 2. Broadcast for 0ms delivery to recipient
    realtimeChannelRef.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: `bc_${Date.now()}`,
        text: textToSend,
        sender_id: user?.id,
        created_at: new Date().toISOString(),
        thread_id: threadId,
        request_id: request?.id,
      },
    });

    // 3. Background API Call
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
          patientName={patientName}
          patientImage={patientImage}
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
          bloodType={bloodType}
          hospital={hospital}
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
              <MessageItem item={item} patientImage={patientImage} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToBottom(true)}
            onLayout={() => scrollToBottom(false)}
            ListFooterComponent={
              <TypingBubble
                isTyping={isOtherUserTyping}
                patientImage={patientImage}
              />
            }
          />
        )}

        <MessageInput
          inputText={inputText}
          onChangeText={handleInputChange}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatScreen;
