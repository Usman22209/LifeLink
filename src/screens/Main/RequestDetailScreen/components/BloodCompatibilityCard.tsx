import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { selectIsRtl, selectLanguage } from "@store/slices/appSlice";
import useTranslation from "@shared/hooks/useTranslation";
import {
  getCompatibilityNotice,
  normalizeBloodGroup,
} from "@shared/utils/bloodCompatibility";

interface BloodCompatibilityCardProps {
  donorBloodGroup?: string | null;
  patientBloodGroup?: string | null;
  onShare?: () => void;
}

export const BloodCompatibilityCard: React.FC<BloodCompatibilityCardProps> = ({
  donorBloodGroup,
  patientBloodGroup,
  onShare,
}) => {
  const isRtl = useSelector(selectIsRtl);
  const selectedLang = useSelector(selectLanguage);
  const isUrdu = selectedLang === "ur";

  const notice = getCompatibilityNotice(donorBloodGroup, patientBloodGroup, isUrdu);
  const donor = normalizeBloodGroup(donorBloodGroup) || "Unknown";
  const patient = normalizeBloodGroup(patientBloodGroup) || "Patient";

  const isCompatible = notice.isCompatible;

  return (
    <View
      style={[
        styles.card,
        isCompatible ? styles.compatibleCard : styles.incompatibleCard,
      ]}
    >
      <View
        style={[
          styles.headerRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isCompatible
                ? "rgba(46, 204, 113, 0.14)"
                : "rgba(245, 166, 35, 0.16)",
            },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name={isCompatible ? "check-circle" : "alert-triangle"}
            size={moderateScale(18)}
            color={isCompatible ? colors.success : colors.warning}
          />
        </View>

        <View style={styles.headerTextWrap}>
          <AppText
            bold
            FONT_13
            style={[
              styles.title,
              {
                color: isCompatible ? colors.success : "#D97706",
                textAlign: isRtl ? "right" : "left",
              },
            ]}
          >
            {notice.title}
          </AppText>
          <View
            style={[
              styles.badgeRow,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.typePill,
                { backgroundColor: withOpacity(colors.primary, 0.08) },
              ]}
            >
              <AppText bold FONT_10 style={{ color: colors.primary }}>
                {isUrdu ? `آپ: ${donor}` : `You: ${donor}`}
              </AppText>
            </View>
            <AnyIcon
              type={Icons.Feather}
              name={isRtl ? "arrow-left" : "arrow-right"}
              size={moderateScale(10)}
              color={colors.textSecondary}
            />
            <View
              style={[
                styles.typePill,
                { backgroundColor: withOpacity(colors.gray800, 0.08) },
              ]}
            >
              <AppText bold FONT_10 style={{ color: colors.text }}>
                {isUrdu ? `مریض: ${patient}` : `Patient: ${patient}`}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      <AppText
        regular
        FONT_11
        style={[
          styles.message,
          { textAlign: isRtl ? "right" : "left" },
        ]}
      >
        {notice.message}
      </AppText>

      {!isCompatible && onShare && (
        <TouchableOpacity
          style={[
            styles.shareActionBtn,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
          activeOpacity={0.8}
          onPress={onShare}
        >
          <AnyIcon
            type={Icons.Feather}
            name="share-2"
            size={moderateScale(14)}
            color={colors.white}
          />
          <AppText bold FONT_12 style={styles.shareActionText}>
            {isUrdu
              ? "موزوں ڈونرز تلاش کرنے کے لیے شیئر کریں"
              : "Share to Help Find Compatible Donors"}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    borderWidth: 1.2,
  },
  compatibleCard: {
    backgroundColor: "rgba(46, 204, 113, 0.06)",
    borderColor: "rgba(46, 204, 113, 0.35)",
  },
  incompatibleCard: {
    backgroundColor: "rgba(245, 166, 35, 0.06)",
    borderColor: "rgba(245, 166, 35, 0.4)",
  },
  headerRow: {
    alignItems: "center",
    marginBottom: verticalScale(8),
    gap: scale(10),
  },
  iconContainer: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    marginBottom: verticalScale(3),
  },
  badgeRow: {
    alignItems: "center",
    gap: scale(6),
  },
  typePill: {
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(6),
  },
  message: {
    color: colors.textSecondary,
    lineHeight: moderateScale(16),
  },
  shareActionBtn: {
    marginTop: verticalScale(10),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(9),
    paddingHorizontal: scale(14),
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
  },
  shareActionText: {
    color: colors.white,
  },
});

export default BloodCompatibilityCard;
