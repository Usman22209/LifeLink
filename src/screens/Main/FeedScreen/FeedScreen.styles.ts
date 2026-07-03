import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const PAD = scale(16);

export const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PAD,
    paddingBottom: verticalScale(12),
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  backBtn: {
    width: moderateScale(32),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerSubtitle: {
    color: colors.textSecondary,
    marginTop: verticalScale(1),
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  searchRow: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(2),
    backgroundColor: colors.background,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.gray300,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(9),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(13),
    color: colors.text,
    padding: 0,
    margin: 0,
  },

  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(10),
  },
  sortPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },

  list: {
    paddingHorizontal: PAD,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.gray300,
    overflow: "hidden",
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
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(12),
    padding: moderateScale(14),
  },
  bloodBadge: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    paddingTop: verticalScale(1),
  },
  hospitalText: {
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginTop: verticalScale(6),
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(3),
  },
  cardRight: {
    alignItems: "flex-end",
    gap: verticalScale(4),
    paddingTop: verticalScale(1),
  },
  urgencyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
  },
  urgencyDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(3),
  },
  timeText: {
    color: colors.textSecondary,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginHorizontal: moderateScale(14),
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
  },
  detailBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    height: verticalScale(18),
    backgroundColor: colors.gray300,
    marginHorizontal: scale(12),
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(2),
  },
});

export const sheetStyles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(6),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 10 },
    }),
  },
  handleWrap: {
    alignItems: "center",
    paddingVertical: verticalScale(10),
  },
  handle: {
    width: scale(40),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: colors.gray300,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  closeBtn: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginBottom: verticalScale(20),
  },
  group: {
    marginBottom: verticalScale(20),
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(10),
  },
  groupIconWrap: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(8),
    backgroundColor: "rgba(229,57,53,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(8),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  optionActive: {
    backgroundColor: "rgba(229,57,53,0.08)",
    borderColor: colors.primary,
  },
  optionDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.primary,
  },
  footer: {
    flexDirection: "row",
    gap: scale(10),
    paddingTop: verticalScale(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray300,
  },
  resetBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  applyBtn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
  },
});
