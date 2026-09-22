import React from "react";
import { View, TouchableOpacity, Alert, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../ChatScreen.styles";

interface ChatHeaderProps {
  patientName: string;
  patientImage?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  statusText?: string;
  phoneNumber?: string | null;
  onBackPress: () => void;
  onReportPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  patientName,
  patientImage,
  isOnline = false,
  isTyping = false,
  statusText,
  phoneNumber,
  onBackPress,
  onReportPress,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleCall = () => {
    if (!phoneNumber) {
      Alert.alert(
        "Phone Call",
        "No direct contact phone number is available for this recipient. Please message them directly in chat.",
      );
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Phone Call", `Could not initiate call to ${phoneNumber}.`);
    });
  };

  const dotColor = isTyping
    ? colors.primary
    : isOnline
      ? colors.success
      : colors.gray300;

  const displayStatus = isTyping
    ? "Typing..."
    : statusText || (isOnline ? "Online" : "Offline");

  const isValidAvatar = (url?: string | null) =>
    Boolean(
      url &&
      typeof url === "string" &&
      url.trim().length > 0 &&
      !url.includes("cdn.lifelink.org") &&
      (url.startsWith("http://") || url.startsWith("https://")),
    );

  const cleanPatientImage = isValidAvatar(patientImage) ? patientImage : null;

  const defaultAvatarNode = (
    <View style={[styles.headerAvatar, styles.defaultHeaderAvatar]}>
      <AnyIcon
        type={Icons.Feather}
        name="user"
        size={moderateScale(18)}
        color={colors.textSecondary}
      />
    </View>
  );

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
          {cleanPatientImage ? (
            <AppImage
              source={{ uri: cleanPatientImage }}
              style={styles.headerAvatar}
              placeholder={defaultAvatarNode}
              fallbackComponent={defaultAvatarNode}
            />
          ) : (
            defaultAvatarNode
          )}
          <View style={styles.headerTextContainer}>
            <AppText bold style={styles.headerName}>
              {patientName || "User"}
            </AppText>
            <View style={styles.headerStatus}>
              <View
                style={[styles.headerStatusDot, { backgroundColor: dotColor }]}
              />
              <AppText
                style={[
                  styles.headerStatusText,
                  isTyping && { color: colors.primary, fontWeight: "600" },
                  isOnline &&
                    !isTyping && { color: colors.success, fontWeight: "500" },
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
              {t("common.report") || "Report"}
            </AppText>
          </TouchableOpacity>
        )}
        {Boolean(phoneNumber) && (
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
        )}
      </View>
    </View>
  );
};

export default ChatHeader;
