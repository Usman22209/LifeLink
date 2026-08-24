import React from "react";
import { View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import { colors } from "@theme/colors";
import { styles } from "../TrackRequestScreen.styles";

interface DonationProgressCardProps {
  progressPercent: number;
  fulfilledUnits: number;
  unitsRemaining: number;
  unitsRequired: number;
  donationsCount: number;
}

export const DonationProgressCard: React.FC<DonationProgressCardProps> = ({
  progressPercent,
  fulfilledUnits,
  unitsRemaining,
  unitsRequired,
  donationsCount,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.progressHeader}>
        <Text semiBold FONT_13 style={{ color: colors.text }}>
          Donation Progress
        </Text>
        <Text bold FONT_14 style={{ color: progressPercent >= 100 ? colors.success : colors.primary }}>
          {progressPercent}%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercent}%`,
              backgroundColor: progressPercent >= 100 ? colors.success : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsGridRow}>
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.success }}>
              {fulfilledUnits}
            </Text>
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
              Received
            </Text>
          </View>
          <View style={styles.statVerticalDivider} />
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: unitsRemaining > 0 ? colors.danger : colors.success }}>
              {unitsRemaining}
            </Text>
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
              Remaining
            </Text>
          </View>
        </View>
        <View style={styles.statsHorizontalDivider} />
        <View style={styles.statsGridRow}>
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.text }}>
              {unitsRequired}
            </Text>
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
              Total Needed
            </Text>
          </View>
          <View style={styles.statVerticalDivider} />
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.info }}>
              {donationsCount}
            </Text>
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
              Pledged
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
