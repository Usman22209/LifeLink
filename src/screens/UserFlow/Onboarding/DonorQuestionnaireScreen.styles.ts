import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(40),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(4),
  },
  title: {
    color: colors.text,
  },
  langButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
  },
  langButtonText: {
    color: colors.white,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: verticalScale(16),
    lineHeight: verticalScale(18),
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(229, 57, 53, 0.35)",
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  questionText: {
    color: colors.text,
    lineHeight: verticalScale(19),
    marginBottom: verticalScale(12),
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: verticalScale(4),
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
  },
  radioCircle: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(8),
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInnerDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: colors.primary,
  },
  radioLabel: {
    color: colors.text,
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    lineHeight: verticalScale(16),
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(13),
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: colors.white,
  },
  skipButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(14),
    paddingVertical: verticalScale(8),
  },
  skipButtonText: {
    color: colors.textSecondary,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(22),
    width: "100%",
    maxWidth: scale(380),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  modalIconWrap: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(14),
  },
  modalTitle: {
    color: colors.text,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  modalSubtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: verticalScale(14),
    lineHeight: verticalScale(18),
  },
  reasonsBox: {
    width: "100%",
    backgroundColor: "rgba(229, 57, 53, 0.05)",
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: "rgba(229, 57, 53, 0.2)",
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: verticalScale(6),
  },
  reasonBullet: {
    color: colors.primary,
    marginRight: scale(6),
    lineHeight: verticalScale(16),
  },
  reasonText: {
    color: colors.text,
    flex: 1,
    lineHeight: verticalScale(16),
  },
  modalPrimaryBtn: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryBtnText: {
    color: colors.white,
  },
});
