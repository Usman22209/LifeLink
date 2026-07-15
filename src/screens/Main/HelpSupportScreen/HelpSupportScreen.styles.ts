import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
  },
  contactSection: {
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: colors.border + "30",
  },
  contactIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border + "30",
  },
  contactTitle: {
    color: colors.text,
    marginBottom: verticalScale(6),
  },
  contactText: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(16),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(10),
  },
  contactButton: {
    width: "100%",
    height: verticalScale(40),
    borderRadius: moderateScale(8),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border + "50",
    marginVertical: verticalScale(12),
  },
  faqSectionTitle: {
    color: colors.text,
    marginBottom: verticalScale(16),
  },
  faqList: {
    gap: verticalScale(10),
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "50",
    padding: scale(12),
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scale(12),
  },
  faqQuestion: {
    color: colors.text,
    flex: 1,
  },
  faqAnswer: {
    color: colors.textSecondary,
    lineHeight: verticalScale(16),
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border + "30",
  },
});
