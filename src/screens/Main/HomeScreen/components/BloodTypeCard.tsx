import React from "react";
import { View, StyleSheet, I18nManager } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

interface BloodTypeCardProps {
  bloodType?: string;
  subtitle?: string;
  donations?: number;
  livesSaved?: number;
  lastDonated?: string;
}

const BloodTypeCard: React.FC<BloodTypeCardProps> = ({
  bloodType = "O+",
  subtitle = "Universal Donor",
  donations = 0,
  livesSaved = 0,
  lastDonated = "N/A",
}) => {
  const isRtl = I18nManager.isRTL;
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View
        style={[
          styles.topRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.infoContainer,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text
            medium
            FONT_12
            style={{ color: withOpacity(colors.white, 0.75) }}
          >
            {t("home.yourBloodType")}
          </Text>
          <Text extraBold FONT_34 style={{ color: colors.white }}>
            {bloodType}
          </Text>
          <Text
            medium
            FONT_12
            style={{
              color: withOpacity(colors.white, 0.65),
              marginTop: verticalScale(2),
            }}
          >
            {subtitle === "Universal Donor"
              ? t("home.universalDonor")
              : subtitle}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <AnyIcon
            type={Icons.FontAwesome5}
            name="hand-holding-heart"
            size={moderateScale(38)}
            color={withOpacity(colors.white, 0.2)}
          />
        </View>
      </View>

      <View
        style={[
          styles.statsRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <StatItem value={String(donations)} label={t("home.donations")} />
        <View style={styles.divider} />
        <StatItem value={String(livesSaved)} label={t("home.livesSaved")} />
        <View style={styles.divider} />
        <StatItem value={lastDonated} label={t("home.lastDonated")} />
      </View>
    </View>
  );
};

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem}>
    <Text bold FONT_16 style={{ color: colors.white }}>
      {value}
    </Text>
    <Text
      medium
      FONT_9
      style={{
        color: withOpacity(colors.white, 0.65),
        marginTop: verticalScale(2),
        textAlign: "center",
      }}
    >
      {label}
    </Text>
  </View>
);

export default BloodTypeCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(16),
    backgroundColor: colors.primary,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -moderateScale(30),
    right: -moderateScale(30),
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: withOpacity(colors.white, 0.06),
  },
  decorCircle2: {
    position: "absolute",
    bottom: -moderateScale(20),
    left: -moderateScale(20),
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: withOpacity(colors.white, 0.04),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  iconContainer: {
    opacity: 0.8,
  },
  statsRow: {
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "center",
  },
});
