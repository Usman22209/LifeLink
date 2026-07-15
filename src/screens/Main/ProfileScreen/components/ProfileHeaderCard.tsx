import React from "react";
import { View } from "react-native";
import Text from "@components/AppText";
import AppImage from "@components/AppImage";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderCardProps {
  user: any;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user }) => {
  const avatarUri =
    user?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";
  const userBloodType = user?.blood_type || "O+";

  return (
    <View style={styles.profileHeaderCard}>
      <View style={styles.avatarContainer}>
        <AppImage source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.badge}>
          <Text bold FONT_9 style={styles.badgeText}>
            {userBloodType}
          </Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text bold FONT_16 style={styles.name}>
          {user?.full_name || "Guest Donor"}
        </Text>
        <Text regular FONT_12 style={styles.email}>
          {user?.email || "guest@lifelink.com"}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeaderCard;
