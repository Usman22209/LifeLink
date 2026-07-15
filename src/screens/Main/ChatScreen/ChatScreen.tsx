import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatScreen.styles";

type ChatScreenRouteProp = RouteProp<UserStackParamList, typeof ROUTES.CHAT>;

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  senderId: "me" | "them";
}

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { request } = route.params;

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Initialize with some realistic conversation starters
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        text: `Hi, thank you for reaching out regarding the ${request.bloodType} blood request for ${request.patientName}.`,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        senderId: "them",
      },
      {
        id: "2",
        text: `We urgently need ${request.units} units at ${request.hospital}. Are you eligible and available to donate?`,
        createdAt: new Date(Date.now() - 3500000), // 58 minutes ago
        senderId: "them",
      },
    ];
    setMessages(initialMessages);
  }, [request]);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 150);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      senderId: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    scrollToBottom();

    // Trigger typing and reply simulation
    simulateReply();
  };

  const simulateReply = () => {
    setTimeout(() => {
      setIsTyping(true);
      scrollToBottom();

      setTimeout(() => {
        setIsTyping(false);
        
        const replies = [
          `Thank you so much! The patient's family is at ${request.hospital} right now. Please coordinate with the receptionist or call us when you are nearby.`,
          `That is wonderful news! Let me know if you need any directions to ${request.hospital}. They are expecting donors at the Emergency Ward.`,
          `Bless you! Your compatibility match looks perfect. Please let me know what time you can visit so we can notify the duty coordinator.`,
          `Thank you for saving a life. When you reach ${request.hospital}, please mention the request ID #${request.id} at the blood bank reception.`,
        ];

        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const responseMessage: Message = {
          id: Math.random().toString(),
          text: randomReply,
          createdAt: new Date(),
          senderId: "them",
        };

        setMessages((prev) => [...prev, responseMessage]);
        scrollToBottom();
      }, 2000);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === "me";
    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        {!isMe && (
          <AppImage
            source={{
              uri:
                request.patientImage ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
            }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <AppText
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </AppText>
          <AppText
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {formatTime(item.createdAt)}
          </AppText>
        </View>
      </View>
    );
  };

  const renderCustomHeader = () => {
    return (
      <View style={[styles.headerRow, { paddingTop: Math.max(insets.top, verticalScale(10)) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerChevron}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
          >
            <AnyIcon
              type={Icons.Ionicons}
              name="chevron-back"
              size={moderateScale(22)}
              color={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <AppImage
              source={{
                uri:
                  request.patientImage ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
              }}
              style={styles.headerAvatar}
            />
            <View style={styles.headerTextContainer}>
              <AppText bold style={styles.headerName}>
                {request.patientName}
              </AppText>
              <View style={styles.headerStatus}>
                <View style={styles.headerStatusDot} />
                <AppText style={styles.headerStatusText}>Online</AppText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => {
              const phone = "+9242111222333";
              Alert.alert("Call Recipient", `Calling request contact at ${phone}...`);
            }}
            activeOpacity={0.7}
          >
            <AnyIcon
              type={Icons.Feather}
              name="phone"
              size={moderateScale(18)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isTyping) return null;
    return (
      <View style={[styles.messageRow, styles.otherMessageRow]}>
        <AppImage
          source={{
            uri:
              request.patientImage ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
          }}
          style={styles.avatar}
        />
        <View style={[styles.messageBubble, styles.otherMessageBubble, styles.typingBubble]}>
          <View style={styles.typingDotContainer}>
            <View style={[styles.typingDot, { opacity: 0.4 }]} />
            <View style={[styles.typingDot, { opacity: 0.7 }]} />
            <View style={[styles.typingDot, { opacity: 1 }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea={true}
      scrollable={false}
      style={styles.wrapper}
      header={renderCustomHeader()}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? verticalScale(40) : 0}
      >
        {/* Request Context Banner */}
        <View style={styles.contextBanner}>
          <AnyIcon
            type={Icons.Feather}
            name="droplet"
            size={moderateScale(12)}
            color={colors.primary}
            style={styles.contextIcon}
          />
          <AppText regular style={styles.contextText}>
            Regarding <AppText bold style={styles.contextBold}>{request.bloodType}</AppText> blood request at <AppText bold style={styles.contextBold}>{request.hospital}</AppText>
          </AppText>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollToBottom(true)}
          onLayout={() => scrollToBottom(false)}
          ListFooterComponent={renderFooter}
        />

        {/* Message Input Box */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.placeholder}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              style={styles.sendButton}
              disabled={!inputText.trim()}
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="send"
                size={moderateScale(18)}
                color={!inputText.trim() ? colors.placeholder : colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ChatScreen;
