import React, { useMemo } from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../RequestDetailScreen.styles";

interface HeroBannerProps {
  request: any;
  cfg?: any;
  deadlineInfo?: {
    formattedDate: string;
    formattedTime: string;
    countdown: string;
    isEmergency: boolean;
    color: string;
  };
  displayDistance: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  request,
  cfg,
  deadlineInfo,
  displayDistance,
}) => {
  const { t } = useTranslation();

  const isCritical =
    deadlineInfo?.isEmergency ||
    request?.urgency === "critical" ||
    request?.urgency === "emergency";

  const pillColor =
    deadlineInfo?.color ||
    cfg?.color ||
    (isCritical ? colors.danger : colors.primary);

  const deadlineLabel = useMemo(() => {
    if (deadlineInfo?.formattedDate) {
      return `${deadlineInfo.formattedDate} · ${deadlineInfo.formattedTime}`;
    }
    if (request?.time_left) {
      return request.time_left;
    }
    return isCritical ? "Critical" : "Active";
  }, [deadlineInfo, request?.time_left, isCritical]);

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
          colors={isCritical ? ["#E53935", "#FF8A80"] : ["#F57C00", "#FFB74D"]}
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
        {t("requestDetail.needsBlood") || "Needs emergency blood donation"}
      </AppText>

      <View
        style={[
          styles.urgencyRow,
          { flexWrap: "wrap", justifyContent: "center" },
        ]}
      >
        <View
          style={[
            styles.urgencyPill,
            {
              backgroundColor: withOpacity(pillColor, 0.08),
              borderColor: withOpacity(pillColor, 0.25),
            },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="calendar"
            size={moderateScale(10)}
            color={pillColor}
          />
          <AppText semiBold FONT_10 style={{ color: pillColor }}>
            {deadlineLabel}
          </AppText>
        </View>

        {deadlineInfo?.countdown ? (
          <View
            style={[
              styles.urgencyPill,
              {
                backgroundColor: withOpacity(pillColor, 0.12),
                borderColor: withOpacity(pillColor, 0.3),
              },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name="clock"
              size={moderateScale(10)}
              color={pillColor}
            />
            <AppText bold FONT_10 style={{ color: pillColor }}>
              {deadlineInfo.countdown}
            </AppText>
          </View>
        ) : null}

        <View style={styles.distancePill}>
          <AnyIcon
            type={Icons.Feather}
            name="map-pin"
            size={moderateScale(9)}
            color={colors.textSecondary}
          />
          <AppText semiBold FONT_10 style={styles.distanceText}>
            {displayDistance || t("requestDetail.nearby") || "Nearby"}
          </AppText>
        </View>
      </View>
    </View>
  );
};
