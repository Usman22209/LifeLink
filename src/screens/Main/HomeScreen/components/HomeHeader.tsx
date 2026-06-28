import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import AppImage from "@components/AppImage";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

interface HomeHeaderProps {
  userName?: string;
  profileImage?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = "User",
  profileImage,
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isRtl = I18nManager.isRTL;
  const firstName = userName.split(" ")[0];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + verticalScale(8),
          flexDirection: isRtl ? "row-reverse" : "row",
        },
      ]}
    >

      <TouchableOpacity
        style={[
          styles.profileSection,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
        activeOpacity={0.7}
        onPress={onProfilePress}
      >
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <AppImage
              source={{ uri: profileImage }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text bold FONT_16 style={{ color: colors.white }}>
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={[styles.onlineDot, { [isRtl ? "left" : "right"]: moderateScale(1) }]} />
        </View>

        <View
          style={[
            styles.greetingContainer,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text
            medium
            FONT_12
            style={{ color: colors.textSecondary }}
          >
            {t(`home.${getGreetingKey()}`)} 👋
          </Text>
          <Text bold FONT_16 style={{ color: colors.text }} numberOfLines={1}>
            {firstName}
          </Text>
        </View>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.notificationButton}
        activeOpacity={0.7}
        onPress={onNotificationPress}
      >
        <AnyIcon
          type={Icons.Feather}
          name="bell"
          size={moderateScale(22)}
          color={colors.text}
        />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text bold FONT_8 style={{ color: colors.white }}>
              {notificationCount > 9 ? "9+" : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const getGreetingKey = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "goodMorning";
  if (hour < 17) return "goodAfternoon";
  return "goodEvening";
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: colors.background,
  },
  profileSection: {
    flex: 1,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
  },
  avatarPlaceholder: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: moderateScale(1),
    right: moderateScale(1),
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  greetingContainer: {
    marginHorizontal: scale(10),
    flex: 1,
  },
  notificationButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: moderateScale(6),
    right: moderateScale(6),
    minWidth: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(3),
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
