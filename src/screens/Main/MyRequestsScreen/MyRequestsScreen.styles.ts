import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors, withOpacity } from "@theme/colors";

const PAD = scale(16);

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(28),
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
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(10),
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: verticalScale(28),
    backgroundColor: colors.gray300,
  },

  /* ── Tabs ── */
  tabsRow: {
    flexDirection: "row",
    marginBottom: verticalScale(14),
    gap: scale(8),
  },
  tabChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* ── Loading / Empty ── */
  loadingWrap: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyIconWrap: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Request Card ── */
  requestTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodBadge: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: withOpacity(colors.primary, 0.09),
    justifyContent: "center",
    alignItems: "center",
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

  /* ── Progress ── */
  progressSection: {},
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  progressTrack: {
    height: verticalScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.gray100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },

  /* ── Footer ── */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(2),
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    height: verticalScale(18),
    backgroundColor: colors.gray300,
    marginHorizontal: scale(8),
  },
});
