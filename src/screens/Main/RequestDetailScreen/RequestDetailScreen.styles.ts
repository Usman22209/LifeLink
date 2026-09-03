import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

const PAD = scale(16);

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(90), // Space for bottom CTA row
  },

  // Premium Hero Banner Section
  heroSection: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.gray300,
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    alignItems: "center",
    marginBottom: verticalScale(14),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  avatarContainer: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    position: "relative",
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  patientAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(45),
    borderWidth: 3,
    borderColor: colors.white,
  },
  defaultHeroAvatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },
  gradientBadge: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  heroBadgeText: {
    fontSize: moderateScale(26),
    color: colors.white,
  },
  overlappingBadge: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    position: "absolute",
    bottom: -scale(2),
    right: -scale(2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  badgeTextSmall: {
    fontSize: moderateScale(11),
    color: colors.white,
    fontWeight: "bold",
  },
  patientName: {
    color: colors.text,
    textAlign: "center",
    marginBottom: verticalScale(4),
  },
  subtitleText: {
    color: colors.textSecondary,
    fontSize: moderateScale(12),
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginTop: verticalScale(10),
  },
  urgencyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  urgencyDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  distancePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  distanceText: {
    color: colors.textSecondary,
  },

  // Medical Case Notes Card
  caseNotesCard: {
    backgroundColor: "rgba(229,57,53,0.02)",
    borderColor: "rgba(229,57,53,0.12)",
    borderWidth: 1.5,
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    flexDirection: "row",
    gap: scale(10),
    marginBottom: verticalScale(14),
  },
  caseNotesTitle: {
    color: colors.text,
    marginBottom: verticalScale(2),
  },
  caseNotesText: {
    color: colors.textSecondary,
    lineHeight: verticalScale(16),
  },

  // Donation Steps Timeline
  timelineContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.gray300,
    padding: moderateScale(16),
    marginBottom: verticalScale(14),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(16),
  },
  timelineTitle: {
    color: colors.text,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: scale(4),
  },
  timelineStep: {
    alignItems: "center",
    marginRight: scale(14),
  },
  timelineCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  timelineCircleActive: {
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    height: verticalScale(34),
    backgroundColor: colors.gray300,
    zIndex: 1,
  },
  timelineLineActive: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingTop: verticalScale(1),
  },
  stepTitle: {
    color: colors.text,
  },
  stepDesc: {
    color: colors.textSecondary,
    marginTop: verticalScale(1),
  },

  // Details List Section (Unified Cardless Sheet)
  infoContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.gray300,
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(14),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  infoRow: {
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  infoRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: verticalScale(4),
  },
  infoLabel: {
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  infoValue: {
    color: colors.text,
    paddingLeft: scale(18),
    lineHeight: verticalScale(18),
  },

  // Interactive Map Preview
  mapCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: colors.gray300,
    overflow: "hidden",
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  mapTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  mapTitle: {
    color: colors.text,
  },
  mapSubtitle: {
    color: colors.textSecondary,
    fontSize: moderateScale(10),
    marginTop: verticalScale(1),
  },
  mapCanvas: {
    height: verticalScale(140),
    width: "100%",
    backgroundColor: "#F2F4F7",
    position: "relative",
  },
  mapOverlay: {
    position: "absolute",
    bottom: scale(10),
    left: scale(10),
    right: scale(10),
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.gray300,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  mapOverlayLeft: {
    flex: 1,
  },
  mapOverlayHospital: {
    color: colors.text,
  },
  mapOverlayDistance: {
    color: colors.textSecondary,
    fontSize: moderateScale(10),
    marginTop: verticalScale(1),
  },
  navigateBtn: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  navigateBtnText: {
    color: colors.white,
  },

  // Action Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    flexDirection: "row",
    gap: scale(10),
    alignItems: "center",
  },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  callBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(4),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  contactText: {
    color: colors.text,
  },
  donateBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
  },
  manageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
  },
  pledgedBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    backgroundColor: "#2E7D32",
  },
  donateText: {
    color: colors.white,
  },

  // Custom Match Sheet Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    padding: moderateScale(20),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  sheetTitle: {
    color: colors.text,
  },
  sheetSubText: {
    color: colors.textSecondary,
    marginBottom: verticalScale(18),
    lineHeight: verticalScale(16),
  },
  checklist: {
    gap: verticalScale(8),
    marginBottom: verticalScale(22),
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  checkRowChecked: {
    borderColor: "rgba(229,57,53,0.15)",
    backgroundColor: "rgba(229,57,53,0.02)",
  },
  checkBox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(5),
    borderWidth: 1.5,
    borderColor: colors.gray600,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkText: {
    color: colors.text,
    flex: 1,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: scale(8),
  },
  confirmBtnDisabled: {
    backgroundColor: colors.gray300,
  },
  confirmBtnText: {
    color: colors.white,
  },
});
