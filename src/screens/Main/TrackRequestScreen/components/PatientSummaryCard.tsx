import React from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { styles } from "../TrackRequestScreen.styles";

interface PatientSummaryCardProps {
  request: any;
  unitsRequired: number;
  isExpired: boolean;
  isFulfilled: boolean;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  request,
  unitsRequired,
  isExpired,
  isFulfilled,
}) => {
  const urgencyKey = (request.urgency || "normal").toLowerCase();
  const urgencyColor =
    urgencyKey === "critical"
      ? colors.danger
      : urgencyKey === "high" || urgencyKey === "urgent"
      ? colors.warning
      : colors.info;

  const statusLabel = isFulfilled
    ? "Fulfilled"
    : isExpired
    ? "Expired"
    : "Active";
  const statusColor = isFulfilled
    ? colors.success
    : isExpired
    ? colors.textSecondary
    : colors.success;

  return (
    <View style={styles.card}>
      <View style={styles.patientRow}>
        <View style={styles.bloodBadge}>
          <Text extraBold FONT_16 style={{ color: colors.primary }}>
            {request.blood_group || request.bloodType || "O+"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text semiBold FONT_14 style={{ color: colors.text }} numberOfLines={1}>
            {request.patient_name || request.patientName || "Blood Request"}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>
            {request.hospital_name || request.hospital || "Hospital"}
          </Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: withOpacity(statusColor, 0.1) }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text bold FONT_10 style={{ color: statusColor }}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />
      <View style={styles.infoRow}>
        <View style={styles.infoChip}>
          <AnyIcon type={Icons.Feather} name="alert-circle" size={moderateScale(12)} color={urgencyColor} />
          <Text semiBold FONT_11 style={{ color: urgencyColor, marginLeft: scale(4) }}>
            {(request.urgency || "Normal").charAt(0).toUpperCase() + (request.urgency || "normal").slice(1)}
          </Text>
        </View>
        {request.time_left && !isExpired ? (
          <View style={styles.infoChip}>
            <AnyIcon type={Icons.Feather} name="clock" size={moderateScale(12)} color={colors.textSecondary} />
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(4) }}>
              {request.time_left}
            </Text>
          </View>
        ) : null}
        <View style={styles.infoChip}>
          <AnyIcon type={Icons.Feather} name="droplet" size={moderateScale(12)} color={colors.primary} />
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(4) }}>
            {unitsRequired} unit{unitsRequired > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </View>
  );
};
