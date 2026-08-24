import React from "react";
import { View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import { colors } from "@theme/colors";
import { styles } from "../MyRequestsScreen.styles";

interface SummaryStatsCardProps {
  totalCreated: number;
  activeCount: number;
  totalFulfilled: number;
}

export const SummaryStatsCard: React.FC<SummaryStatsCardProps> = ({
  totalCreated,
  activeCount,
  totalFulfilled,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.primary }}>
            {totalCreated}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            Posted
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.warning }}>
            {activeCount}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            Active
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.success }}>
            {totalFulfilled}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            Received
          </Text>
        </View>
      </View>
    </View>
  );
};
