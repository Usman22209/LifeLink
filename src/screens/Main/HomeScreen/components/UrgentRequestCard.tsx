import React from "react";
import { View, StyleSheet, TouchableOpacity, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";

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
  critical: {
    color: colors.danger,
    label: "Critical",
    icon: "alert-circle",
  },
  urgent: {
    color: colors.warning,
    label: "Urgent",
    icon: "alert-triangle",
  },
  normal: {
    color: colors.success,
    label: "Normal",
    icon: "clock",
  },
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

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >

      <View
        style={[styles.accentLine, { backgroundColor: config.color }]}
      />


      <View
        style={[
          styles.urgencyBadge,
          { backgroundColor: withOpacity(config.color, 0.1) },
        ]}
      >
        <AnyIcon
          type={Icons.Feather}
          name={config.icon}
          size={moderateScale(10)}
          color={config.color}
        />
        <Text
          semiBold
          FONT_9
          style={{
            color: config.color,
            marginLeft: scale(3),
          }}
        >
          {config.label}
        </Text>
      </View>


      <View style={styles.bloodTypeContainer}>
        <View
          style={[
            styles.bloodTypeBg,
            { backgroundColor: withOpacity(config.color, 0.06) },
          ]}
        >
          <Text extraBold FONT_26 style={{ color: config.color }}>
            {bloodType}
          </Text>
        </View>
      </View>


      <Text
        semiBold
        FONT_12
        style={{ color: colors.text }}
        numberOfLines={1}
      >
        {hospital}
      </Text>


      <View
        style={[
          styles.metaRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <AnyIcon
          type={Icons.Feather}
          name="map-pin"
          size={moderateScale(10)}
          color={colors.textSecondary}
        />
        <Text
          medium
          FONT_10
          style={{ color: colors.textSecondary, marginLeft: scale(3), flex: 1 }}
          numberOfLines={1}
        >
          {city}
          {distance ? ` · ${distance}` : ""}
        </Text>
      </View>


      <View
        style={[
          styles.bottomRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.unitsTag}>
          <AnyIcon
            type={Icons.Ionicons}
            name="water"
            size={moderateScale(11)}
            color={colors.primary}
          />
          <Text semiBold FONT_10 style={{ color: colors.primary, marginLeft: scale(3) }}>
            {units} {units === 1 ? "unit" : "units"}
          </Text>
        </View>
        <Text medium FONT_9 style={{ color: colors.textSecondary }}>
          {time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UrgentRequestCard;

const styles = StyleSheet.create({
  card: {
    width: scale(160),
    backgroundColor: colors.white,
    borderRadius: moderateScale(18),
    padding: moderateScale(14),
    overflow: "hidden",

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: withOpacity(colors.border, 0.3),
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(3),
    borderTopLeftRadius: moderateScale(18),
    borderTopRightRadius: moderateScale(18),
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
  },
  bloodTypeContainer: {
    marginBottom: verticalScale(10),
  },
  bloodTypeBg: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
  },
  metaRow: {
    alignItems: "center",
    marginTop: verticalScale(4),
  },
  bottomRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: withOpacity(colors.border, 0.3),
  },
  unitsTag: {
    flexDirection: "row",
    alignItems: "center",
  },
});
