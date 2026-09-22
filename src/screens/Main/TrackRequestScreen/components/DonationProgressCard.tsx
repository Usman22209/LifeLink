import React from "react";
import { View } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
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
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.progressHeader,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <Text semiBold FONT_13 style={{ color: colors.text }}>
          {t("trackRequest.donationProgress") || "Donation Progress"}
        </Text>
        <Text
          bold
          FONT_14
          style={{
            color: progressPercent >= 100 ? colors.success : colors.primary,
          }}
        >
          {progressPercent}%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercent}%`,
              backgroundColor:
                progressPercent >= 100 ? colors.success : colors.primary,
            },
          ]}
        />
      </View>

      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statsGridRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.success }}>
              {fulfilledUnits}
            </Text>
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginTop: verticalScale(2),
              }}
            >
              {t("trackRequest.received") || "Received"}
            </Text>
          </View>
          <View style={styles.statVerticalDivider} />
          <View style={styles.statItem}>
            <Text
              bold
              FONT_18
              style={{
                color: unitsRemaining > 0 ? colors.danger : colors.success,
              }}
            >
              {unitsRemaining}
            </Text>
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginTop: verticalScale(2),
              }}
            >
              {t("trackRequest.remaining") || "Remaining"}
            </Text>
          </View>
        </View>
        <View style={styles.statsHorizontalDivider} />
        <View
          style={[
            styles.statsGridRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.text }}>
              {unitsRequired}
            </Text>
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginTop: verticalScale(2),
              }}
            >
              {t("trackRequest.totalNeeded") || "Total Needed"}
            </Text>
          </View>
          <View style={styles.statVerticalDivider} />
          <View style={styles.statItem}>
            <Text bold FONT_18 style={{ color: colors.info }}>
              {donationsCount}
            </Text>
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginTop: verticalScale(2),
              }}
            >
              {t("trackRequest.pledged") || "Pledged"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
