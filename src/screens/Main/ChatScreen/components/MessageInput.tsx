import React from "react";
import { View, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatScreen.styles";

interface MessageInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputText,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={onChangeText}
          placeholder="Type a message..."
          placeholderTextColor={colors.placeholder}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={styles.sendButton}
          disabled={!inputText.trim()}
          onPress={onSend}
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
  );
};

export default MessageInput;
