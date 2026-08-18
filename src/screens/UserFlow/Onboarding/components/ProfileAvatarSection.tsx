import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../styles/CompleteProfile.styles";

interface ProfileAvatarSectionProps {
  profileImage?: string;
  localImage: string | null;
  isUploading: boolean;
  onOpenModal: () => void;
}

export const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  profileImage,
  localImage,
  isUploading,
  onOpenModal,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.imageSection}>
      <TouchableOpacity
        onPress={onOpenModal}
        style={styles.imageContainer}
        activeOpacity={0.8}
      >
        {profileImage || localImage ? (
          <View style={styles.profileImage}>
            <Image
              source={{ uri: profileImage || localImage || "" }}
              style={styles.profileImage}
            />
            {isUploading && (
              <View
                style={[
                  styles.profileImage,
                  {
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <AnyIcon
                  type={Icons.MaterialIcons}
                  name="cloud-upload"
                  size={moderateScale(32)}
                  color={colors.white}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <AnyIcon
              type={Icons.MaterialIcons}
              name="person"
              size={moderateScale(45)}
              color={colors.placeholder}
            />
          </View>
        )}
        <View style={styles.cameraIconContainer}>
          <AnyIcon
            type={Icons.MaterialIcons}
            name="camera-alt"
            size={moderateScale(14)}
            color={colors.white}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenModal}>
        <Text semiBold style={styles.uploadText}>
          {profileImage
            ? t("onboarding.changePhoto")
            : t("onboarding.uploadPhoto")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
