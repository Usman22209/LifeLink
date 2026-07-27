import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl, selectLanguage } from "@store/slices/appSlice";
import { getCityNameById } from "@shared/utils/cityUtils";
import { useUserLocation, formatDistance } from "@shared/utils/locationService";
import { UrgentRequest } from "../types";
import { cardStyles as styles } from "../HomeScreen.styles";

interface UrgentRequestCardProps extends UrgentRequest {
  onPress?: () => void;
}

const URGENCY_CONFIG = {
  critical: { color: colors.danger, icon: "alert-circle" },
  urgent: { color: colors.warning, icon: "alert-triangle" },
  high: { color: colors.warning, icon: "alert-triangle" },
  normal: { color: colors.success, icon: "clock" },
};

const UrgentRequestCard: React.FC<UrgentRequestCardProps> = ({
  bloodType,
  hospital,
  city,
  units,
  urgency,
  time,
  distance,
  latitude,
  longitude,
  onPress,
}) => {
  const urgencyKey = (urgency?.toLowerCase() || "normal") as keyof typeof URGENCY_CONFIG;
  const config = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;
  const isRtl = useSelector(selectIsRtl);
  const selectedLang = useSelector(selectLanguage);
  const { t } = useTranslation();
  const userLocation = useUserLocation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableWidth = windowWidth - insets.left - insets.right;
  const cardWidth = (usableWidth - moderateScale(20) - scale(12)) / 2;

  const cityName = getCityNameById(city, selectedLang);
  const computedDistance = formatDistance(userLocation, { latitude, longitude });
  const validDistance = computedDistance || (distance && distance !== "N/A" && distance !== "0 km" ? distance : "");
  const locationText = [cityName, validDistance].filter(Boolean).join(" · ");

  const getUrgencyText = (val?: string) => {
    switch (val?.toLowerCase()) {
      case "critical":
        return t("home.critical") || "Critical";
      case "urgent":
      case "high":
        return t("home.urgent") || "Urgent";
      case "normal":
      default:
        return t("home.normal") || "Normal";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.accentBar, { backgroundColor: config.color }]} />

      <View style={styles.inner}>
        <View
          style={[
            styles.topRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.bloodPill,
              { borderColor: withOpacity(config.color, 0.35) },
            ]}
          >
            <Text extraBold FONT_16 style={{ color: config.color }}>
              {bloodType}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name={config.icon}
              size={moderateScale(9)}
              color={config.color}
            />
            <Text
              semiBold
              FONT_9
              style={{ color: config.color, marginLeft: scale(3) }}
            >
              {getUrgencyText(urgency)}
            </Text>
          </View>
        </View>

        <View style={[styles.hospitalContainer, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
          <Text
            semiBold
            FONT_12
            numberOfLines={2}
            style={[styles.hospital, { textAlign: isRtl ? "right" : "left" }]}
          >
            {hospital}
          </Text>
        </View>

        <View
          style={[
            styles.metaRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="map-pin"
            size={moderateScale(9)}
            color={colors.textSecondary}
          />
          <Text
            medium
            FONT_10
            numberOfLines={1}
            style={{
              color: colors.textSecondary,
              marginLeft: scale(3),
              flex: 1,
            }}
          >
            {locationText}
          </Text>
        </View>

        <View style={styles.divider} />

        <View
          style={[
            styles.footer,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.footerItem,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Ionicons}
              name="water-outline"
              size={moderateScale(10)}
              color={colors.textSecondary}
            />
            <Text
              medium
              FONT_10
              style={{ color: colors.textSecondary, marginLeft: scale(3) }}
            >
              {units} {units === 1 ? t("home.unit") : t("home.units")}
            </Text>
          </View>
          <Text medium FONT_9 style={{ color: colors.textSecondary }}>
            {time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UrgentRequestCard;
