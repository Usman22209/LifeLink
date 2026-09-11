import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import AppImage from "@components/AppImage";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { headerStyles as styles } from "../HomeScreen.styles";

interface HomeHeaderProps {
  userName?: string;
  profileImage?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const getGreetingKey = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "goodMorning";
  if (hour < 17) return "goodAfternoon";
  return "goodEvening";
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName = "User",
  profileImage,
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const firstName = userName ? userName.split(" ")[0] : "User";
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [profileImage]);

  const hasImage = Boolean(
    profileImage &&
    typeof profileImage === "string" &&
    profileImage.trim().length > 0 &&
    !imageError
  );

  const initial = firstName && firstName !== "User" ? firstName.charAt(0).toUpperCase() : "";

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
          <View style={styles.avatarWrapper}>
            {hasImage ? (
              <AppImage
                source={{ uri: profileImage!.trim() }}
                style={styles.avatar}
                resizeMode="cover"
                onError={() => setImageError(true)}
                placeholder={
                  <View style={styles.avatarPlaceholder}>
                    {initial ? (
                      <Text bold FONT_16 style={styles.avatarInitial}>
                        {initial}
                      </Text>
                    ) : (
                      <AnyIcon
                        type={Icons.Feather}
                        name="user"
                        size={moderateScale(20)}
                        color={colors.primary}
                      />
                    )}
                  </View>
                }
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                {initial ? (
                  <Text bold FONT_16 style={styles.avatarInitial}>
                    {initial}
                  </Text>
                ) : (
                  <AnyIcon
                    type={Icons.Feather}
                    name="user"
                    size={moderateScale(20)}
                    color={colors.primary}
                  />
                )}
              </View>
            )}
          </View>
          <View
            style={[
              styles.onlineDot,
              { [isRtl ? "left" : "right"]: moderateScale(1) },
            ]}
          />
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
            style={{
              color: colors.textSecondary,
              textAlign: isRtl ? "right" : "left",
            }}
          >
            {t(`home.${getGreetingKey()}`)} 👋
          </Text>
          <Text
            bold
            FONT_16
            style={{
              color: colors.text,
              textAlign: isRtl ? "right" : "left",
            }}
            numberOfLines={1}
          >
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

export default HomeHeader;
