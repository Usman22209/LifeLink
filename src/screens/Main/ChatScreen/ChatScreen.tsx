import React, { useState, useEffect, useRef, useCallback } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import { colors } from "@theme/colors";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
import { styles } from "./ChatScreen.styles";

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

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initialMessages: Message[] = [
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
          ListFooterComponent={
            <TypingBubble
              patientImage={request.patientImage}
              isTyping={isTyping}
            />
          }
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
