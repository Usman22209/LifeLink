import React from "react";
import { View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
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
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  return (
    <View style={styles.card}>
      <View style={[styles.statsRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.primary }}>
            {totalCreated}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            {t("myRequests.posted") || "Posted"}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.warning }}>
            {activeCount}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            {t("myRequests.active") || "Active"}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text bold FONT_20 style={{ color: colors.success }}>
            {totalFulfilled}
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
            {t("myRequests.received") || "Received"}
          </Text>
        </View>
      </View>
    </View>
  );
};
