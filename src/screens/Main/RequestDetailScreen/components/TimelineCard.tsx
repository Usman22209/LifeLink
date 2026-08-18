import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface TimelineCardProps {
  request: any;
  cityName: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  request,
  cityName,
}) => {
  const renderTimelineStep = (
    icon: string,
    title: string,
    desc: string,
    isActive: boolean,
    isLast = false,
  ) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineStep}>
        <View
          style={[
            styles.timelineCircle,
            isActive && styles.timelineCircleActive,
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name={icon}
            size={moderateScale(10)}
            color={isActive ? colors.white : colors.gray600}
          />
        </View>
        {!isLast && (
          <View
            style={[styles.timelineLine, isActive && styles.timelineLineActive]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <AppText semiBold FONT_12 style={styles.stepTitle}>
          {title}
        </AppText>
        <AppText regular FONT_10 style={styles.stepDesc}>
          {desc}
        </AppText>
      </View>
    </View>
  );

  const isEmergency =
    request?.urgency === "critical" || request?.urgency === "emergency";
  const unitsTotal = request?.units || request?.units_required || 1;

  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timelineHeader}>
        <AnyIcon
          type={Icons.Feather}
          name="clock"
          size={moderateScale(14)}
          color={colors.primary}
        />
        <AppText bold FONT_13 style={styles.timelineTitle}>
          Request Schedule & Timeline
        </AppText>
      </View>
      {renderTimelineStep(
        "calendar",
        "Request Broadcasted",
        `Created & broadcasted to ${cityName || "local"} donors (${request?.time || "Recently"})`,
        true,
      )}
      {renderTimelineStep(
        "clock",
        "Urgency & Expiry Window",
        request?.time_left
          ? `Active countdown: ${request.time_left}`
          : isEmergency
          ? "Emergency Request — Expires in 48 hours"
          : "Standard Emergency — Active for 7 days",
        true,
      )}
      {renderTimelineStep(
        "heart",
        "Donation Match Progress",
        request?.fulfilled_units !== undefined
          ? `${request.fulfilled_units} of ${unitsTotal} Units Received`
          : "Live Matchmaking Active — Donors being notified",
        false,
        true,
      )}
    </View>
  );
};
