import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ChatScreen.styles";

interface ChatHeaderProps {
  patientName: string;
  patientImage?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  statusText?: string;
  onBackPress: () => void;
  onReportPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  patientName,
  patientImage,
  isOnline = false,
  isTyping = false,
  statusText,
  onBackPress,
  onReportPress,
}) => {
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    const phone = "+9242111222333";
    Alert.alert("Call Recipient", `Calling request contact at ${phone}...`);
  };

  const dotColor = isTyping
    ? colors.primary
    : isOnline
    ? colors.success
    : colors.gray300;

  const displayStatus = isTyping
    ? "Typing..."
    : statusText || (isOnline ? "Online" : "Offline");

  return (
    <View
      style={[
        styles.headerRow,
        { paddingTop: Math.max(insets.top, verticalScale(10)) },
      ]}
    >
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.headerChevron}
          onPress={onBackPress}
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
          {patientImage ? (
            <AppImage
              source={{ uri: patientImage }}
              style={styles.headerAvatar}
            />
          ) : (
            <View style={[styles.headerAvatar, styles.defaultHeaderAvatar]}>
              <AnyIcon
                type={Icons.Feather}
                name="user"
                size={moderateScale(18)}
                color={colors.textSecondary}
              />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <AppText bold style={styles.headerName}>
              {patientName || "User"}
            </AppText>
            <View style={styles.headerStatus}>
              <View
                style={[
                  styles.headerStatusDot,
                  { backgroundColor: dotColor },
                ]}
              />
              <AppText
                style={[
                  styles.headerStatusText,
                  isTyping && { color: colors.primary, fontWeight: "600" },
                  isOnline && !isTyping && { color: colors.success, fontWeight: "500" },
                ]}
              >
                {displayStatus}
              </AppText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.headerRight}>
        {onReportPress && (
          <TouchableOpacity
            style={[
              styles.headerAction,
              {
                marginRight: scale(6),
                paddingHorizontal: scale(8),
                paddingVertical: verticalScale(4),
                borderRadius: moderateScale(10),
                backgroundColor: "rgba(229, 57, 53, 0.08)",
                flexDirection: "row",
                alignItems: "center",
                gap: scale(3),
              },
            ]}
            onPress={onReportPress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AnyIcon
              type={Icons.Feather}
              name="shield"
              size={moderateScale(13)}
              color={colors.error}
            />
            <AppText bold FONT_10 style={{ color: colors.error }}>
              Report
            </AppText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.headerAction}
          onPress={handleCall}
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

export default ChatHeader;
