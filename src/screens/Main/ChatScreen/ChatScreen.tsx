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
import ReportModal from "@shared/components/ReportModal";

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
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const realtimeChannelRef = useRef<any>(null);

  const { data: remoteMessagesData, isLoading } = useChatMessages(threadId);
  const { mutate: sendMessageMutate } = useSendMessage();
  const { mutate: markReadMutate } = useMarkThreadAsRead();

  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [receivedRealtimeMessages, setReceivedRealtimeMessages] = useState<any[]>([]);

  // Mark thread as read on mount / when threadId is available
  useEffect(() => {
    if (threadId) {
      markReadMutate(threadId);
    }
  }, [threadId, markReadMutate]);

  const channelIds = useMemo(() => {
    const ids = new Set<string>();
    if (threadId) ids.add(threadId);
    if (request?.id) ids.add(request.id);
    const remoteThreadId =
      (remoteMessagesData as any)?.data?.thread_id ||
      (remoteMessagesData as any)?.thread_id ||
      (remoteMessagesData as any)?.thread?.id;
    if (remoteThreadId) ids.add(remoteThreadId);
    return Array.from(ids);
  }, [threadId, request?.id, remoteMessagesData]);

  // Realtime Broadcast Channel for 0ms typing indicators and instant message delivery
  useEffect(() => {
    if (channelIds.length === 0) return;

    const channels = channelIds.map((id) => {
      const channel = supabase.channel(`chat_room_${id}`, {
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
            if (newMsg) {
              setReceivedRealtimeMessages((prev) => {
                if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
                return [...prev, newMsg];
              });
              channelIds.forEach((targetId) => {
                queryClient.setQueryData(
                  chatKeys.messages(targetId),
                  (oldData: any) => {
                    const rawList =
                      oldData?.data?.messages ||
                      oldData?.messages ||
                      (Array.isArray(oldData) ? oldData : []);
                    if (
                      rawList.some((m: any) => String(m.id) === String(newMsg.id))
                    ) {
                      return oldData;
                    }
                    const updatedList = [...rawList, newMsg];
                    return oldData?.data?.messages
                      ? { ...oldData, data: { ...oldData.data, messages: updatedList } }
                      : oldData?.messages
                      ? { ...oldData, messages: updatedList }
                      : updatedList;
                  }
                );
              });
              setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
              }, 1200);
            }
          }
        )
        .on("broadcast", { event: "message" }, ({ payload: newMsg }) => {
          if (newMsg) {
            setReceivedRealtimeMessages((prev) => {
              if (prev.some((m) => String(m.id) === String(newMsg.id) || (m.text === newMsg.text && String(m.sender_id) === String(newMsg.sender_id)))) return prev;
              return [...prev, newMsg];
            });
            channelIds.forEach((targetId) => {
              queryClient.setQueryData(
                chatKeys.messages(targetId),
                (oldData: any) => {
                  const rawList =
                    oldData?.data?.messages ||
                    oldData?.messages ||
                    (Array.isArray(oldData) ? oldData : []);
                  if (
                    rawList.some((m: any) => String(m.id) === String(newMsg.id))
                  ) {
                    return oldData;
                  }
                  const updatedList = [...rawList, newMsg];
                  return oldData?.data?.messages
                    ? { ...oldData, data: { ...oldData.data, messages: updatedList } }
                    : oldData?.messages
                    ? { ...oldData, messages: updatedList }
                    : updatedList;
                }
              );
            });
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
            }, 1200);
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

      return channel;
    });

    realtimeChannelRef.current = channels;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [channelIds, user?.id, queryClient]);

  const messages: Message[] = useMemo(() => {
    const rawMsgs =
      remoteMessagesData?.data?.messages ||
      remoteMessagesData?.messages ||
      (Array.isArray(remoteMessagesData) ? remoteMessagesData : []);

    const serverFormatted: Message[] = rawMsgs.map((m: any) => ({
      id: String(m.id),
      text: m.text,
      createdAt: new Date(m.sent_at || m.created_at || Date.now()),
      senderId:
        String(m.sender_id || m.senderId).toLowerCase() === String(user?.id).toLowerCase()
          ? "me"
          : "them",
    }));

    const serverIds = new Set(serverFormatted.map((m) => m.id));
    const serverTexts = new Set(serverFormatted.map((m) => `${m.text}_${m.senderId}`));

    // Pending local optimistic messages
    const pendingLocal = localMessages.filter(
      (m) => !serverTexts.has(`${m.text}_me`)
    );

    // Realtime broadcast messages from others that aren't in server list yet
    const pendingRealtime: Message[] = receivedRealtimeMessages
      .filter((m) => {
        if (serverIds.has(String(m.id))) return false;
        const sender =
          String(m.sender_id || m.senderId).toLowerCase() === String(user?.id).toLowerCase()
            ? "me"
            : "them";
        return !serverTexts.has(`${m.text}_${sender}`);
      })
      .map((m) => ({
        id: String(m.id),
        text: m.text,
        createdAt: new Date(m.sent_at || m.created_at || Date.now()),
        senderId:
          String(m.sender_id || m.senderId).toLowerCase() === String(user?.id).toLowerCase()
            ? "me"
            : "them",
      }));

    return [...serverFormatted, ...pendingLocal, ...pendingRealtime].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }, [remoteMessagesData, localMessages, receivedRealtimeMessages, user?.id]);

  const otherUserId = useMemo(() => {
    if ((request as any)?.requester_id) return String((request as any).requester_id);
    if ((request as any)?.requester?.id) return String((request as any).requester.id);
    if ((request as any)?.user?.id) return String((request as any).user.id);

    const rawMsgs =
      remoteMessagesData?.data?.messages ||
      remoteMessagesData?.messages ||
      (Array.isArray(remoteMessagesData) ? remoteMessagesData : []);

    const otherMsg = rawMsgs.find(
      (m: any) =>
        m.sender_id && user?.id && String(m.sender_id).toLowerCase() !== String(user.id).toLowerCase()
    );
    if (otherMsg?.sender_id) return String(otherMsg.sender_id);

    return String(threadId || "unknown");
  }, [request, remoteMessagesData, user?.id, threadId]);

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

  const broadcastToChannels = (event: string, payload: any) => {
    if (Array.isArray(realtimeChannelRef.current)) {
      realtimeChannelRef.current.forEach((ch) => {
        ch.send({ type: "broadcast", event, payload });
      });
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (user?.id) {
      if (text.trim().length > 0) {
        broadcastToChannels("typing", { senderId: user.id, isTyping: true });

        if (userTypingDebounceRef.current) clearTimeout(userTypingDebounceRef.current);
        userTypingDebounceRef.current = setTimeout(() => {
          broadcastToChannels("typing", { senderId: user.id, isTyping: false });
        }, 2000);
      } else {
        broadcastToChannels("typing", { senderId: user.id, isTyping: false });
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    // Cancel typing broadcast immediately
    if (userTypingDebounceRef.current) clearTimeout(userTypingDebounceRef.current);
    broadcastToChannels("typing", { senderId: user?.id, isTyping: false });

    // 1. Optimistic Message (0ms latency UI update)
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      text: textToSend,
      createdAt: new Date(),
      senderId: "me",
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);

    // 2. Broadcast for 0ms delivery to recipient
    broadcastToChannels("message", {
      id: `bc_${Date.now()}`,
      text: textToSend,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      thread_id: threadId,
      request_id: request?.id,
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
          onReportPress={() => setReportModalVisible(true)}
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

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        targetType="user"
        targetId={otherUserId}
        targetTitle={`User: ${patientName}`}
      />
    </ScreenWrapper>
  );
};

export default ChatScreen;
