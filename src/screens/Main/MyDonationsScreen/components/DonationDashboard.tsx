import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { ROUTES } from "@utils/Routes";
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
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const isRtl = useSelector(selectIsRtl);
  const statusColor = isEligible ? colors.success : colors.warning;

  return (
    <>
      <View style={styles.summarySection}>
        <View
          style={[
            styles.summaryRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <StatCard
            icon="droplet"
            value={totalDonations}
            label={t("myDonations.donations") || "Donations"}
            iconBg={withOpacity(colors.primary, 0.08)}
            iconColor={colors.primary}
          />
          <StatCard
            icon="heart"
            value={livesSaved}
            label={t("myDonations.livesSaved") || "Lives Saved"}
            iconBg={withOpacity(colors.success, 0.08)}
            iconColor={colors.success}
          />
          <StatCard
            icon="calendar"
            value={`${totalDonations > 0 ? Math.round((totalDonations / 5) * 12) : 0}mo`}
            label={t("myDonations.activeSince") || "Active Since"}
            iconBg={withOpacity(colors.info, 0.08)}
            iconColor={colors.info}
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() =>
          (navigation as any).navigate(ROUTES.DONOR_QUESTIONNAIRE, {
            isEditing: true,
          })
        }
        style={[
          styles.eligibilityBanner,
          {
            backgroundColor: withOpacity(statusColor, 0.04),
            borderColor: withOpacity(statusColor, 0.15),
            flexDirection: isRtl ? "row-reverse" : "row",
          },
        ]}
      >
        <AnyIcon
          type={Icons.Feather}
          name={
            isEligible
              ? "check-circle"
              : nextEligibleDateStr
                ? "clock"
                : "alert-circle"
          }
          size={moderateScale(18)}
          color={statusColor}
        />
        <View
          style={[
            styles.eligibilityTextWrap,
            {
              alignItems: isRtl ? "flex-end" : "flex-start",
              marginHorizontal: moderateScale(10),
              flex: 1,
            },
          ]}
        >
          <AppText
            semiBold
            FONT_12
            style={[
              styles.eligibilityTitle,
              { color: statusColor, textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {isEligible
              ? t("myDonations.eligibleToDonate") || "Eligible to Donate"
              : nextEligibleDateStr
                ? t("myDonations.cooldownPeriod") || "Cooldown Period"
                : t("myDonations.deferred") || "Currently Deferred"}
          </AppText>
          <AppText
            regular
            FONT_10
            style={[
              styles.eligibilityDesc,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {isEligible
              ? t("myDonations.eligibleDesc") ||
                "You are eligible to donate blood. Tap to review questionnaire."
              : nextEligibleDateStr
                ? t("myDonations.nextEligibleOn", {
                    date: nextEligibleDateStr,
                  }) ||
                  `Next eligible on ${nextEligibleDateStr}. Tap to review status.`
                : t("myDonations.deferredDesc") ||
                  "Based on your health screening, you are currently deferred from donating."}
          </AppText>
        </View>
        <AnyIcon
          type={Icons.Feather}
          name="chevron-right"
          size={moderateScale(14)}
          color={statusColor}
        />
      </TouchableOpacity>
    </>
  );
};

export default DonationDashboard;
