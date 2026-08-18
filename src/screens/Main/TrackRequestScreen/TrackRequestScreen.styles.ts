import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors, withOpacity } from "@theme/colors";

const PAD = scale(16);

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(30),
  },

  /* ── Shared Card ── */
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.gray300,
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(10),
  },

  /* ── Patient Summary ── */
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodBadge: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: withOpacity(colors.primary, 0.09),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    gap: scale(4),
  },
  statusDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(3),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* ── Progress ── */
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  progressTrack: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.gray100,
    overflow: "hidden",
    marginBottom: verticalScale(14),
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(4),
  },
  statsGrid: {
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  statsGridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: verticalScale(4),
  },
  statVerticalDivider: {
    width: 1,
    height: verticalScale(28),
    backgroundColor: colors.gray300,
  },
  statsHorizontalDivider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginHorizontal: scale(20),
    marginVertical: verticalScale(8),
  },

  /* ── Section Header ── */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(4),
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: "center",
    paddingVertical: verticalScale(16),
  },
  emptyIconWrap: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Donor Card ── */
  donorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  donorAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: withOpacity(colors.primary, 0.09),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  donorBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(20),
  },
  donorActions: {
    flexDirection: "row",
    gap: scale(8),
  },
  actionBtnOutline: {
    flex: 1,
    height: verticalScale(34),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.gray300,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  actionBtnPrimary: {
    flex: 1.3,
    height: verticalScale(34),
    borderRadius: moderateScale(10),
    backgroundColor: colors.success,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Close Button ── */
  closeBtn: {
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: withOpacity(colors.danger, 0.25),
    backgroundColor: withOpacity(colors.danger, 0.04),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(4),
  },
});
