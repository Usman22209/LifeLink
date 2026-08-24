import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface HeroBannerProps {
  request: any;
  cfg: any;
  displayDistance: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  request,
  cfg,
  displayDistance,
}) => {
  const isCritical =
    request?.urgency === "critical" || request?.urgency === "emergency";
  const cfgColor = cfg?.color || (isCritical ? colors.danger : colors.info);
  const cfgLabel = cfg?.label || (isCritical ? "Critical" : "Normal");

  return (
    <View style={styles.heroSection}>
      <View style={styles.avatarContainer}>
        {request?.patientImage ? (
          <AppImage
            source={{ uri: request.patientImage }}
            style={styles.patientAvatar}
          />
        ) : (
          <View style={[styles.patientAvatar, styles.defaultHeroAvatar]}>
            <AnyIcon
              type={Icons.Feather}
              name="user"
              size={moderateScale(36)}
              color={colors.textSecondary}
            />
          </View>
        )}
        <LinearGradient
          colors={
            isCritical
              ? ["#E53935", "#FF8A80"]
              : ["#F57C00", "#FFB74D"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overlappingBadge}
        >
          <AppText extraBold style={styles.badgeTextSmall}>
            {request?.bloodType || "O+"}
          </AppText>
        </LinearGradient>
      </View>
      <AppText bold FONT_18 style={styles.patientName}>
        {request?.patientName || "Anonymous Patient"}
      </AppText>
      <AppText regular style={styles.subtitleText}>
        Needs emergency blood donation
      </AppText>

      <View style={styles.urgencyRow}>
        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor: withOpacity(cfgColor, 0.06),
              borderColor: withOpacity(cfgColor, 0.2),
            },
          ]}
        >
          <View style={[styles.urgencyDot, { backgroundColor: cfgColor }]} />
          <AppText semiBold FONT_10 style={{ color: cfgColor }}>
            {cfgLabel}
          </AppText>
        </View>
        <View style={styles.distancePill}>
          <AnyIcon
            type={Icons.Feather}
            name="map-pin"
            size={moderateScale(9)}
            color={colors.textSecondary}
          />
          <AppText semiBold FONT_10 style={styles.distanceText}>
            {displayDistance || "Nearby"}
          </AppText>
        </View>
      </View>
    </View>
  );
};
