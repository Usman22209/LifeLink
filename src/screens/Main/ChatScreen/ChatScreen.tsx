import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
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
import {
  useChatMessages,
  useSendMessage,
  useMarkThreadAsRead,
  useChatThreads,
  chatKeys,
} from "@shared/query/chat/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@shared/config/supabase";
import { usePresence } from "@shared/providers/PresenceProvider";
import { PROFILE_SERVICE } from "@shared/api/service/profile.service";
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
  const { isUserOnline, formatLastSeen, isNetworkConnected } = usePresence();

  const request = route.params?.request;
  const participant = (route.params as any)?.participant;

  const initialThreadId = (route.params as any)?.threadId || null;
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    initialThreadId,
  );
  const [recipientProfile, setRecipientProfile] = useState<{
    name?: string;
    avatar?: string;
    lastSeen?: string | null;
  } | null>(null);

  const bloodType = request?.bloodType || (request as any)?.blood_group || "";
  const hospital = request?.hospital || (request as any)?.hospital_name || "";

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isInRoomOnline, setIsInRoomOnline] = useState(false);
  const [otherUserLastSeen, setOtherUserLastSeen] = useState<string | null>(
    participant?.last_seen_at || participant?.updated_at || null,
  );
  const otherUserIdRef = useRef<string | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTypingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const realtimeChannelRef = useRef<any>(null);

  const { data: chatThreadsData } = useChatThreads();
  const { data: remoteMessagesData, isLoading } = useChatMessages(
    activeThreadId || "",
    Boolean(activeThreadId),
  );
  const { mutate: sendMessageMutate } = useSendMessage();
  const { mutate: markReadMutate } = useMarkThreadAsRead();

  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [receivedRealtimeMessages, setReceivedRealtimeMessages] = useState<
    any[]
  >([]);

  useEffect(() => {
    if (activeThreadId) {
      markReadMutate(activeThreadId);
    }
  }, [activeThreadId, markReadMutate]);

  useEffect(() => {
    if (!isNetworkConnected) {
      setIsInRoomOnline(false);
      setIsOtherUserTyping(false);
    }
  }, [isNetworkConnected]);

  const channelIds = useMemo(() => {
    const ids = new Set<string>();
    if (activeThreadId) ids.add(activeThreadId);
    if (request?.id) ids.add(request.id);
    const remoteThreadId =
      (remoteMessagesData as any)?.data?.thread_id ||
      (remoteMessagesData as any)?.thread_id ||
      (remoteMessagesData as any)?.thread?.id;
    if (remoteThreadId) ids.add(remoteThreadId);
    return Array.from(ids);
  }, [activeThreadId, request?.id, remoteMessagesData]);

  useEffect(() => {
    if (channelIds.length === 0) return;

    const channels = channelIds.map((id) => {
      const channel = supabase.channel(`chat_room_${id}`, {
        config: {
          broadcast: { self: false },
          presence: { key: user?.id ? String(user.id) : undefined },
        },
      });

      const checkInRoomPresence = () => {
        const state = channel.presenceState();
        const targetId = otherUserIdRef.current;
        if (!targetId) return;
        const present = Object.values(state)
          .flat()
          .some(
            (p: any) =>
              String(p?.user_id || "").toLowerCase() ===
              String(targetId).toLowerCase(),
          );
        setIsInRoomOnline(present);
      };

      channel
        .on("presence", { event: "sync" }, checkInRoomPresence)
        .on("presence", { event: "join" }, ({ newPresences }) => {
          const targetId = otherUserIdRef.current;
          if (
            targetId &&
            newPresences?.some(
              (p: any) =>
                String(p?.user_id || "").toLowerCase() ===
                String(targetId).toLowerCase(),
            )
          ) {
            setIsInRoomOnline(true);
          }
        })
        .on("presence", { event: "leave" }, ({ leftPresences }) => {
          const targetId = otherUserIdRef.current;
          if (
            targetId &&
            leftPresences?.some(
              (p: any) =>
                String(p?.user_id || "").toLowerCase() ===
                String(targetId).toLowerCase(),
            )
          ) {
            checkInRoomPresence();
          }
        })
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
                if (prev.some((m) => String(m.id) === String(newMsg.id)))
                  return prev;
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
                      rawList.some(
                        (m: any) => String(m.id) === String(newMsg.id),
                      )
                    ) {
                      return oldData;
                    }
                    const updatedList = [...rawList, newMsg];
                    return oldData?.data?.messages
                      ? {
                          ...oldData,
                          data: { ...oldData.data, messages: updatedList },
                        }
                      : oldData?.messages
                        ? { ...oldData, messages: updatedList }
                        : updatedList;
                  },
                );
              });
              setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
              }, 1200);
            }
          },
        )
        .on("broadcast", { event: "message" }, ({ payload: newMsg }) => {
          if (newMsg) {
            setReceivedRealtimeMessages((prev) => {
              if (
                prev.some(
                  (m) =>
                    String(m.id) === String(newMsg.id) ||
                    (m.text === newMsg.text &&
                      String(m.sender_id) === String(newMsg.sender_id)),
                )
              )
                return prev;
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
                    ? {
                        ...oldData,
                        data: { ...oldData.data, messages: updatedList },
                      }
                    : oldData?.messages
                      ? { ...oldData, messages: updatedList }
                      : updatedList;
                },
              );
            });
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
            }, 1200);
          }
        })
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (
            payload?.senderId &&
            String(payload.senderId) !== String(user?.id)
          ) {
            setIsOtherUserTyping(Boolean(payload.isTyping));
            if (payload.isTyping) {
              if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                setIsOtherUserTyping(false);
              }, 3500);
            }
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && user?.id) {
            try {
              await channel.track({
                user_id: String(user.id),
                online_at: new Date().toISOString(),
              });
            } catch {}
          }
        });

      return channel;
    });

    realtimeChannelRef.current = channels;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      channels.forEach(async (ch) => {
        try {
          await ch.untrack();
        } catch {}
        supabase.removeChannel(ch);
      });
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
        String(m.sender_id || m.senderId).toLowerCase() ===
        String(user?.id).toLowerCase()
          ? "me"
          : "them",
    }));

    const serverIds = new Set(serverFormatted.map((m) => m.id));
    const serverTexts = new Set(
      serverFormatted.map((m) => `${m.text}_${m.senderId}`),
    );

    const pendingLocal = localMessages.filter(
      (m) => !serverTexts.has(`${m.text}_me`),
    );

    const pendingRealtime: Message[] = receivedRealtimeMessages
      .filter((m) => {
        if (serverIds.has(String(m.id))) return false;
        const sender =
          String(m.sender_id || m.senderId).toLowerCase() ===
          String(user?.id).toLowerCase()
            ? "me"
            : "them";
        return !serverTexts.has(`${m.text}_${sender}`);
      })
      .map((m) => ({
        id: String(m.id),
        text: m.text,
        createdAt: new Date(m.sent_at || m.created_at || Date.now()),
        senderId:
          String(m.sender_id || m.senderId).toLowerCase() ===
          String(user?.id).toLowerCase()
            ? "me"
            : "them",
      }));

    return [...serverFormatted, ...pendingLocal, ...pendingRealtime].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }, [remoteMessagesData, localMessages, receivedRealtimeMessages, user?.id]);

  const rawThreads: any[] = useMemo(() => {
    return Array.isArray(chatThreadsData?.data)
      ? chatThreadsData.data
      : Array.isArray(chatThreadsData)
        ? chatThreadsData
        : [];
  }, [chatThreadsData]);

  const isValidUserId = (id?: string | null): id is string =>
    Boolean(
      id &&
      typeof id === "string" &&
      id.trim().length > 0 &&
      id !== "usr_unknown" &&
      id !== "null" &&
      id !== "undefined",
    );

  const initialOtherUserId = useMemo<string | null>(() => {
    if (
      isValidUserId(participant?.id) &&
      String(participant.id).toLowerCase() !== String(user?.id).toLowerCase()
    ) {
      return String(participant.id);
    }

    const reqRequesterId =
      (request as any)?.requester_id ||
      (request as any)?.requester?.id ||
      (request as any)?.user?.id;
    if (
      isValidUserId(reqRequesterId) &&
      String(reqRequesterId).toLowerCase() !== String(user?.id).toLowerCase()
    ) {
      return String(reqRequesterId);
    }

    const rawMsgs =
      remoteMessagesData?.data?.messages ||
      remoteMessagesData?.messages ||
      (Array.isArray(remoteMessagesData) ? remoteMessagesData : []);

    const otherMsg = rawMsgs.find(
      (m: any) =>
        isValidUserId(m.sender_id) &&
        user?.id &&
        String(m.sender_id).toLowerCase() !== String(user.id).toLowerCase(),
    );
    if (otherMsg?.sender_id) return String(otherMsg.sender_id);

    return null;
  }, [participant?.id, request, remoteMessagesData, user?.id]);

  const matchedThread = useMemo<any>(() => {
    if (activeThreadId) {
      const byId = rawThreads.find(
        (t: any) => String(t.id) === String(activeThreadId),
      );
      if (byId) return byId;
    }
    if (request?.id) {
      const byReq = rawThreads.find(
        (t: any) =>
          String(t.request_id || t.request?.id) === String(request.id) &&
          (!initialOtherUserId ||
            String(t.participant?.id || t.recipient?.id).toLowerCase() ===
              String(initialOtherUserId).toLowerCase()),
      );
      if (byReq) return byReq;
    }
    return null;
  }, [rawThreads, activeThreadId, request?.id, initialOtherUserId]);

  const otherUserId = useMemo<string | null>(() => {
    if (isValidUserId(initialOtherUserId)) return initialOtherUserId;
    const threadPId = matchedThread?.participant?.id;
    if (
      isValidUserId(threadPId) &&
      String(threadPId).toLowerCase() !== String(user?.id).toLowerCase()
    ) {
      return String(threadPId);
    }
    const donorId = (matchedThread as any)?.donor_id;
    if (
      isValidUserId(donorId) &&
      String(donorId).toLowerCase() !== String(user?.id).toLowerCase()
    ) {
      return String(donorId);
    }
    const requesterId = (matchedThread as any)?.requester_id;
    if (
      isValidUserId(requesterId) &&
      String(requesterId).toLowerCase() !== String(user?.id).toLowerCase()
    ) {
      return String(requesterId);
    }
    return null;
  }, [initialOtherUserId, matchedThread, user?.id]);

  useEffect(() => {
    otherUserIdRef.current = otherUserId;
  }, [otherUserId]);

  useEffect(() => {
    if (!activeThreadId && matchedThread?.id) {
      setActiveThreadId(matchedThread.id);
    }
  }, [activeThreadId, matchedThread]);

  useEffect(() => {
    const targetUserId = otherUserId;
    if (!isValidUserId(targetUserId)) return;
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await PROFILE_SERVICE.getPublicProfile(targetUserId);
        const data = res?.data?.data || res?.data;
        if (isMounted && data) {
          setRecipientProfile((prev) => ({
            name: data.full_name || data.name || prev?.name,
            avatar: data.profile_image || prev?.avatar,
            lastSeen: data.last_seen_at || prev?.lastSeen || null,
          }));
          if (data.last_seen_at) {
            setOtherUserLastSeen(data.last_seen_at);
          }
          return;
        }
      } catch {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("id, full_name, profile_image, updated_at, last_seen_at")
            .eq("id", targetUserId)
            .maybeSingle();

          if (isMounted && data) {
            setRecipientProfile((prev) => ({
              name:
                (data as any)?.full_name || (data as any)?.name || prev?.name,
              avatar: (data as any)?.profile_image || prev?.avatar,
              lastSeen:
                (data as any)?.last_seen_at ||
                data.updated_at ||
                prev?.lastSeen ||
                null,
            }));
            setOtherUserLastSeen(
              (data as any)?.last_seen_at || data.updated_at || null,
            );
          }
        } catch {}
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [otherUserId]);

  const remoteParticipant =
    (remoteMessagesData as any)?.data?.participant ||
    (remoteMessagesData as any)?.participant;

  const isGeneric = (name?: string | null) =>
    !name || !name.trim() || name.trim().toLowerCase() === "user";

  const displayName = useMemo(() => {
    const pName = participant?.name || (participant as any)?.full_name;
    if (!isGeneric(pName)) return pName;

    const remotePName = remoteParticipant?.name || remoteParticipant?.full_name;
    if (!isGeneric(remotePName)) return remotePName;

    const threadPName =
      matchedThread?.participant?.name || matchedThread?.participant?.full_name;
    if (!isGeneric(threadPName)) return threadPName;

    const recName =
      recipientProfile?.name || (recipientProfile as any)?.full_name;
    if (!isGeneric(recName)) return recName;

    const reqFullName =
      (request as any)?.requester?.full_name ||
      (request as any)?.requester?.name ||
      (request as any)?.user?.full_name ||
      (request as any)?.user?.name;
    if (!isGeneric(reqFullName)) return reqFullName;

    const patName = request?.patientName || matchedThread?.request?.patientName;
    if (!isGeneric(patName)) return patName;

    return "User";
  }, [
    participant,
    remoteParticipant,
    matchedThread,
    recipientProfile,
    request,
  ]);

  const isValidAvatar = (url?: string | null) =>
    Boolean(
      url &&
      typeof url === "string" &&
      url.trim().length > 0 &&
      !url.includes("cdn.lifelink.org") &&
      (url.startsWith("http://") || url.startsWith("https://")),
    );

  const displayAvatar = useMemo(() => {
    const candidates = [
      recipientProfile?.avatar,
      (recipientProfile as any)?.profile_image,
      remoteParticipant?.avatar,
      (remoteParticipant as any)?.profile_image,
      matchedThread?.participant?.avatar,
      (matchedThread?.participant as any)?.profile_image,
      participant?.avatar,
      (participant as any)?.profile_image,
      (request as any)?.requester?.profile_image,
      request?.patientImage,
    ];
    for (const c of candidates) {
      if (isValidAvatar(c)) return c;
    }
    return undefined;
  }, [
    recipientProfile,
    remoteParticipant,
    matchedThread,
    participant,
    request,
  ]);

  const isRecipientOnline = Boolean(
    isNetworkConnected &&
    (isInRoomOnline || (otherUserId && isUserOnline(otherUserId))),
  );

  const headerStatusText = useMemo(() => {
    if (!isNetworkConnected) return "Waiting for network...";
    if (isOtherUserTyping) return "Typing...";
    if (isRecipientOnline) return "Online";
    return formatLastSeen(otherUserLastSeen, false);
  }, [
    isNetworkConnected,
    isOtherUserTyping,
    isRecipientOnline,
    otherUserLastSeen,
    formatLastSeen,
  ]);

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

        if (userTypingDebounceRef.current)
          clearTimeout(userTypingDebounceRef.current);
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

    if (userTypingDebounceRef.current)
      clearTimeout(userTypingDebounceRef.current);
    broadcastToChannels("typing", { senderId: user?.id, isTyping: false });

    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      text: textToSend,
      createdAt: new Date(),
      senderId: "me",
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);

    broadcastToChannels("message", {
      id: `bc_${Date.now()}`,
      text: textToSend,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      thread_id: activeThreadId || undefined,
      request_id: request?.id,
    });

    const payload = {
      ...(activeThreadId ? { thread_id: activeThreadId } : {}),
      ...(request?.id ? { request_id: request.id } : {}),
      text: textToSend,
    };

    sendMessageMutate(payload, {
      onSuccess: (resData: any) => {
        const newThreadId =
          resData?.thread_id || resData?.thread?.id || resData?.data?.thread_id;
        if (newThreadId && !activeThreadId) {
          setActiveThreadId(newThreadId);
        }
      },
    });
    scrollToBottom(true);
  };

  const contactPhone = useMemo(() => {
    return (
      remoteParticipant?.phone ||
      (participant as any)?.phone ||
      (participant as any)?.contact_number ||
      (request as any)?.contact_number ||
      (request as any)?.contactNumber ||
      (request as any)?.requester?.phone ||
      null
    );
  }, [remoteParticipant, participant, request]);

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea={true}
      scrollable={false}
      style={styles.wrapper}
      header={
        <ChatHeader
          patientName={displayName}
          patientImage={displayAvatar}
          isOnline={isRecipientOnline}
          isTyping={isOtherUserTyping}
          statusText={headerStatusText}
          phoneNumber={contactPhone}
          onBackPress={() => navigation.goBack()}
          onReportPress={
            otherUserId ? () => setReportModalVisible(true) : undefined
          }
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? verticalScale(40) : 0}
      >
        <ChatContextBanner bloodType={bloodType} hospital={hospital} />

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
              <MessageItem item={item} patientImage={displayAvatar} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollToBottom(true)}
            onLayout={() => scrollToBottom(false)}
            ListFooterComponent={
              <TypingBubble
                isTyping={isOtherUserTyping}
                patientImage={displayAvatar}
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
        targetId={otherUserId || ""}
        targetTitle={`User: ${displayName}`}
      />
    </ScreenWrapper>
  );
};

export default ChatScreen;
