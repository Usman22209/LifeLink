import React from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
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
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const urgencyKey = (request.urgency || "normal").toLowerCase();
  const urgencyColor =
    urgencyKey === "critical"
      ? colors.danger
      : urgencyKey === "high" || urgencyKey === "urgent"
        ? colors.warning
        : colors.info;

  const urgencyLabel =
    urgencyKey === "critical"
      ? t("feed.critical") || "Critical"
      : urgencyKey === "high" || urgencyKey === "urgent"
        ? t("feed.high") || t("feed.urgent") || "High"
        : t("feed.normal") || "Normal";

  const isCancelled = request.status === "cancelled";

  const statusLabel = isFulfilled
    ? t("myRequests.fulfilled") || "Fulfilled"
    : isCancelled
      ? t("myRequests.cancelled") || "Cancelled"
      : isExpired
        ? t("myRequests.expired") || "Expired"
        : t("myRequests.active") || "Active";

  const statusColor = isFulfilled
    ? colors.success
    : isCancelled || isExpired
      ? colors.textSecondary
      : colors.success;

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.patientRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.bloodBadge}>
          <Text extraBold FONT_16 style={{ color: colors.primary }}>
            {request.blood_group || request.bloodType || "O+"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: scale(10),
            alignItems: isRtl ? "flex-end" : "flex-start",
          }}
        >
          <Text
            semiBold
            FONT_14
            style={{ color: colors.text, textAlign: isRtl ? "right" : "left" }}
            numberOfLines={1}
          >
            {request.patient_name || request.patientName || "Blood Request"}
          </Text>
          <Text
            regular
            FONT_11
            style={{
              color: colors.textSecondary,
              marginTop: 2,
              textAlign: isRtl ? "right" : "left",
            }}
            numberOfLines={1}
          >
            {request.hospital_name || request.hospital || "Hospital"}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: withOpacity(statusColor, 0.1),
              flexDirection: isRtl ? "row-reverse" : "row",
            },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text
            bold
            FONT_10
            style={{ color: statusColor, marginHorizontal: scale(3) }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />
      <View
        style={[
          styles.infoRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.infoChip,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="alert-circle"
            size={moderateScale(12)}
            color={urgencyColor}
          />
          <Text
            semiBold
            FONT_11
            style={{ color: urgencyColor, marginHorizontal: scale(4) }}
          >
            {urgencyLabel}
          </Text>
        </View>
        {request.time_left && !isExpired ? (
          <View
            style={[
              styles.infoChip,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name="clock"
              size={moderateScale(12)}
              color={colors.textSecondary}
            />
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginHorizontal: scale(4),
              }}
            >
              {request.time_left}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.infoChip,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="droplet"
            size={moderateScale(12)}
            color={colors.primary}
          />
          <Text
            regular
            FONT_11
            style={{ color: colors.textSecondary, marginHorizontal: scale(4) }}
          >
            {unitsRequired}{" "}
            {unitsRequired === 1
              ? t("feed.unit") || "unit"
              : t("feed.units") || "units"}
          </Text>
        </View>
      </View>
    </View>
  );
};
