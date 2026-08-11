import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { styles } from "../MyDonationsScreen.styles";

interface DonationDashboardProps {
  totalDonations: number;
  livesSaved: number;
  isEligible: boolean;
  nextEligibleDateStr: string;
}

const StatCard = ({
  icon,
  value,
  label,
  iconBg,
  iconColor,
}: {
  icon: string;
  value: string | number;
  label: string;
  iconBg: string;
  iconColor: string;
}) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, { backgroundColor: iconBg }]}>
      <AnyIcon
        type={Icons.Feather}
        name={icon}
        size={moderateScale(15)}
        color={iconColor}
      />
    </View>
    <AppText bold FONT_18 style={styles.summaryValue}>
      {value}
    </AppText>
    <AppText regular FONT_10 style={styles.summaryLabel}>
      {label}
    </AppText>
  </View>
);

const DonationDashboard: React.FC<DonationDashboardProps> = ({
  totalDonations,
  livesSaved,
  isEligible,
  nextEligibleDateStr,
}) => {
  const statusColor = isEligible ? colors.success : colors.warning;

  return (
    <>
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <StatCard
            icon="droplet"
            value={totalDonations}
            label="Donations"
            iconBg={withOpacity(colors.primary, 0.08)}
            iconColor={colors.primary}
          />
          <StatCard
            icon="heart"
            value={livesSaved}
            label="Lives Saved"
            iconBg={withOpacity(colors.success, 0.08)}
            iconColor={colors.success}
          />
          <StatCard
            icon="calendar"
            value={`${totalDonations > 0 ? Math.round((totalDonations / 5) * 12) : 0}mo`}
            label="Active Since"
            iconBg={withOpacity(colors.info, 0.08)}
            iconColor={colors.info}
          />
        </View>
      </View>

      <View
        style={[
          styles.eligibilityBanner,
          {
            backgroundColor: withOpacity(statusColor, 0.04),
            borderColor: withOpacity(statusColor, 0.15),
          },
        ]}
      >
        <AnyIcon
          type={Icons.Feather}
          name={isEligible ? "check-circle" : "clock"}
          size={moderateScale(18)}
          color={statusColor}
        />
        <View style={styles.eligibilityTextWrap}>
          <AppText
            semiBold
            FONT_12
            style={[styles.eligibilityTitle, { color: statusColor }]}
          >
            {isEligible ? "Eligible to Donate" : "Cooldown Period"}
          </AppText>
          <AppText regular FONT_10 style={styles.eligibilityDesc}>
            {isEligible
              ? "You are eligible to donate blood again."
              : `Next eligible on ${nextEligibleDateStr}`}
          </AppText>
        </View>
      </View>
    </>
  );
};

export default DonationDashboard;
