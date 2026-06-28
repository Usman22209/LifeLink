import React from "react";
import { View, StyleSheet, TouchableOpacity, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";

interface DonationEligibilityCardProps {
  daysUntilEligible?: number;
  totalDaysCycle?: number;
  onDonatePress?: () => void;
}

const DonationEligibilityCard: React.FC<DonationEligibilityCardProps> = ({
  daysUntilEligible = 0,
  totalDaysCycle = 56,
  onDonatePress,
}) => {
  const isRtl = I18nManager.isRTL;
  const isEligible = daysUntilEligible <= 0;
  const progress = isEligible
    ? 1
    : Math.max(0, (totalDaysCycle - daysUntilEligible) / totalDaysCycle);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.topSection,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >

        <View style={styles.ringContainer}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              {isEligible ? (
                <AnyIcon
                  type={Icons.Feather}
                  name="check"
                  size={moderateScale(22)}
                  color={colors.success}
                />
              ) : (
                <Text bold FONT_16 style={{ color: colors.primary }}>
                  {daysUntilEligible}d
                </Text>
              )}
            </View>
          </View>
        </View>


        <View
          style={[
            styles.infoContainer,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text semiBold FONT_14 style={{ color: colors.text }}>
            {isEligible ? "You're Eligible to Donate!" : "Next Donation"}
          </Text>
          <Text
            medium
            FONT_12
            style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}
          >
            {isEligible
              ? "Your body is ready for the next donation"
              : `${daysUntilEligible} days until you can donate again`}
          </Text>
        </View>
      </View>


      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isEligible ? colors.success : colors.primary,
            },
          ]}
        />
      </View>


      {isEligible && (
        <TouchableOpacity
          style={styles.donateButton}
          activeOpacity={0.8}
          onPress={onDonatePress}
        >
          <AnyIcon
            type={Icons.Ionicons}
            name="water"
            size={moderateScale(16)}
            color={colors.white}
          />
          <Text semiBold FONT_12 style={{ color: colors.white, marginLeft: scale(6) }}>
            Donate Now
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DonationEligibilityCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
  },
  topSection: {
    alignItems: "center",
    gap: scale(14),
    marginBottom: verticalScale(14),
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    borderWidth: 3,
    borderColor: withOpacity(colors.primary, 0.15),
    alignItems: "center",
    justifyContent: "center",
  },
  ringInner: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: withOpacity(colors.primary, 0.06),
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  progressTrack: {
    height: verticalScale(4),
    borderRadius: verticalScale(2),
    backgroundColor: withOpacity(colors.border, 0.4),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: verticalScale(2),
  },
  donateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(12),
  },
});
