import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors, withOpacity } from "@theme/colors";

export const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: verticalScale(32),
  },

  // === Summary Stats Cards ===
  summarySection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(4),
  },
  summaryRow: {
    flexDirection: "row",
    gap: scale(10),
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: colors.gray300,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  summaryIconWrap: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
  },
  summaryValue: {
    color: colors.text,
    marginBottom: verticalScale(1),
  },
  summaryLabel: {
    color: colors.textSecondary,
  },

  // === Eligibility Banner ===
  eligibilityBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(12),
    gap: scale(10),
    borderWidth: 1,
  },
  eligibilityTextWrap: {
    flex: 1,
  },
  eligibilityTitle: {
    marginBottom: verticalScale(1),
  },
  eligibilityDesc: {
    color: colors.textSecondary,
  },

  // === Section Header ===
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  sectionIconWrap: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(8),
    backgroundColor: withOpacity(colors.primary, 0.08),
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: colors.text,
  },

  // === Donation History Card ===
  donationCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  cardAccent: {
    width: moderateScale(4),
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(14),
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardInfoSection: {
    flex: 1,
    marginRight: scale(8),
  },
  patientName: {
    color: colors.text,
    marginBottom: verticalScale(2),
  },
  hospitalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginBottom: verticalScale(1),
  },
  hospitalName: {
    color: colors.textSecondary,
  },
  bloodBadge: {
    alignItems: "center",
    justifyContent: "center",
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(10),
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    backgroundColor: colors.gray100,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  metaText: {
    color: colors.textSecondary,
  },
  viewDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(3),
  },
  viewDetailText: {
    color: colors.primary,
  },

  // === Empty State ===
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
    paddingHorizontal: scale(32),
  },
  emptyIconWrap: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: withOpacity(colors.primary, 0.06),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    color: colors.text,
    marginBottom: verticalScale(6),
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(17),
  },
});
