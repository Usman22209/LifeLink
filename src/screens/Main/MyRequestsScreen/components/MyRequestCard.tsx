import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { styles } from "../MyRequestsScreen.styles";

interface MyRequestCardProps {
  item: any;
  onDetails: () => void;
  onTrack: () => void;
}

export const MyRequestCard: React.FC<MyRequestCardProps> = ({
  item,
  onDetails,
  onTrack,
}) => {
  const fulfilled = item.fulfilled_units || 0;
  const required = item.units_required || item.units || 1;
  const progress = Math.min(100, Math.round((fulfilled / required) * 100));

  const isExpired = item.status === "expired" || item.is_expired;
  const isFulfilled = item.status === "fulfilled" || item.status === "completed";
  const statusLabel = isFulfilled ? "Fulfilled" : isExpired ? "Expired" : item.time_left || "Active";
  const statusColor = isFulfilled ? colors.success : isExpired ? colors.textSecondary : colors.success;

  return (
    <View style={styles.card}>
      <View style={styles.requestTopRow}>
        <View style={styles.bloodBadge}>
          <Text extraBold FONT_16 style={{ color: colors.primary }}>
            {item.blood_group || item.bloodType}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
            {item.patient_name || item.patientName || "Blood Needed"}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }} numberOfLines={1}>
            {item.hospital_name || item.hospital}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: withOpacity(statusColor, 0.1) }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text bold FONT_10 style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.hairline} />
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text regular FONT_11 style={{ color: colors.textSecondary }}>
            Progress
          </Text>
          <Text semiBold FONT_11 style={{ color: progress >= 100 ? colors.success : colors.primary }}>
            {fulfilled}/{required} units · {progress}%
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? colors.success : colors.primary,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.hairline} />
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.footerBtn}
          activeOpacity={0.7}
          onPress={onDetails}
        >
          <AnyIcon type={Icons.Feather} name="eye" size={moderateScale(13)} color={colors.textSecondary} />
          <Text semiBold FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(5) }}>
            Details
          </Text>
        </TouchableOpacity>

        <View style={styles.footerDivider} />

        <TouchableOpacity
          style={styles.footerBtn}
          activeOpacity={0.7}
          onPress={onTrack}
        >
          <AnyIcon type={Icons.Feather} name="activity" size={moderateScale(13)} color={colors.primary} />
          <Text semiBold FONT_11 style={{ color: colors.primary, marginLeft: scale(5) }}>
            Track
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
