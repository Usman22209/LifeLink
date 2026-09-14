import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderCardProps {
  user: any;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user }) => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const actualUser = user?.user || user?.profile || user;

  const avatarUri =
    actualUser?.avatar_url ||
    actualUser?.profile_image ||
    actualUser?.avatar ||
    actualUser?.profileImage;
  const userBloodType = actualUser?.blood_type || actualUser?.blood_group || "O+";

  const userName =
    actualUser?.full_name ||
    actualUser?.name ||
    actualUser?.fullName ||
    (actualUser?.email ? actualUser.email.split("@")[0] : null) ||
    t("profile.guestDonor");

  const userSubtext =
    actualUser?.email ||
    actualUser?.phone ||
    actualUser?.contact_number ||
    "";

  const defaultAvatarNode = (
    <View style={[styles.avatar, styles.defaultAvatar]}>
      <AnyIcon
        type={Icons.Feather}
        name="user"
        size={scale(24)}
        color={colors.textSecondary}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.profileHeaderCard,
        { flexDirection: isRtl ? "row-reverse" : "row" },
      ]}
    >
      <View
        style={[
          styles.avatarContainer,
          {
            marginRight: isRtl ? 0 : scale(16),
            marginLeft: isRtl ? scale(16) : 0,
          },
        ]}
      >
        {avatarUri ? (
          <AppImage
            source={{ uri: avatarUri }}
            style={styles.avatar}
            placeholder={defaultAvatarNode}
            fallbackComponent={defaultAvatarNode}
          />
        ) : (
          defaultAvatarNode
        )}
        <View style={styles.badge}>
          <Text bold FONT_9 style={styles.badgeText}>
            {userBloodType}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.profileInfo,
          { alignItems: isRtl ? "flex-end" : "flex-start" },
        ]}
      >
        <Text
          bold
          FONT_16
          style={[styles.name, { textAlign: isRtl ? "right" : "left" }]}
        >
          {userName}
        </Text>
        {Boolean(userSubtext) && (
          <Text
            regular
            FONT_12
            style={[styles.email, { textAlign: isRtl ? "right" : "left" }]}
          >
            {userSubtext}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ProfileHeaderCard;
