import React from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AppImage from "@components/AppImage";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderCardProps {
  user: any;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user }) => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const avatarUri =
    user?.avatar_url ||
    user?.profile_image ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";
  const userBloodType = user?.blood_type || user?.blood_group || "O+";

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
        <AppImage source={{ uri: avatarUri }} style={styles.avatar} />
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
          {user?.full_name || t("profile.guestDonor")}
        </Text>
        <Text
          regular
          FONT_12
          style={[styles.email, { textAlign: isRtl ? "right" : "left" }]}
        >
          {user?.email || "guest@lifelink.com"}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeaderCard;
