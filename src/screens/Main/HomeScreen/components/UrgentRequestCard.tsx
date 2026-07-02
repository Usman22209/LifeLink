import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  useWindowDimensions,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";


export interface UrgentRequestData {
  id: string;
  bloodType: string;
  hospital: string;
  city: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance?: string;
}

interface UrgentRequestCardProps extends UrgentRequestData {
  onPress?: () => void;
}

const URGENCY_CONFIG = {
  critical: { color: colors.danger,  icon: "alert-circle"  },
  urgent:   { color: colors.warning, icon: "alert-triangle" },
  normal:   { color: colors.success, icon: "clock"          },
};

const UrgentRequestCard: React.FC<UrgentRequestCardProps> = ({
  bloodType,
  hospital,
  city,
  units,
  urgency,
  time,
  distance,
  onPress,
}) => {
  const config = URGENCY_CONFIG[urgency];
  const isRtl = I18nManager.isRTL;
  const { t } = useTranslation();

  // Compute true usable width: screen minus safe area insets (applied by ScreenWrapper)
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableWidth = windowWidth - insets.left - insets.right;
  // Subtract only the LEFT padding + gap: card 2's right edge lands at screen edge,
  // card 3 starts off-screen. The right scroll padding sits naturally beyond view.
  const cardWidth = (usableWidth - moderateScale(20) - scale(12)) / 2;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Left accent bar — clipped cleanly by overflow:hidden on the card */}
      <View style={[styles.accentBar, { backgroundColor: config.color }]} />

      <View style={styles.inner}>
        {/* Blood type + urgency badge row */}
        <View style={[styles.topRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          <View style={[styles.bloodPill, { borderColor: withOpacity(config.color, 0.35) }]}>
            <Text extraBold FONT_16 style={{ color: config.color }}>
              {bloodType}
            </Text>
          </View>

          <View style={[styles.badge, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
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
              {t(`home.${urgency}`)}
            </Text>
          </View>
        </View>

        {/* Hospital name */}
        <Text
          semiBold
          FONT_12
          numberOfLines={2}
          style={[styles.hospital, { textAlign: isRtl ? "right" : "left" }]}
        >
          {hospital}
        </Text>

        {/* City + distance */}
        <View style={[styles.metaRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
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
            style={{ color: colors.textSecondary, marginLeft: scale(3), flex: 1 }}
          >
            {city}
            {distance ? ` · ${distance}` : ""}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <View style={[styles.footer, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          <View style={[styles.footerItem, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <AnyIcon
              type={Icons.Ionicons}
              name="water-outline"
              size={moderateScale(10)}
              color={colors.textSecondary}
            />
            <Text medium FONT_10 style={{ color: colors.textSecondary, marginLeft: scale(3) }}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.gray300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accentBar: {
    width: moderateScale(4),
  },
  inner: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(12),
  },
  topRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  bloodPill: {
    borderWidth: 1.5,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },
  badge: {
    alignItems: "center",
  },
  hospital: {
    color: colors.text,
    marginBottom: verticalScale(4),
    lineHeight: verticalScale(17),
  },
  metaRow: {
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(8),
  },
  footer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItem: {
    alignItems: "center",
  },
});
