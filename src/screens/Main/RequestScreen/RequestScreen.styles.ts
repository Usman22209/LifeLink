import { StyleSheet, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors, withOpacity } from "@theme/colors";

const isRtl = I18nManager.isRTL;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white, // clean white canvas
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(32),
  },
  headerIntroContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "0A", // very soft primary red tint
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(20),
    gap: scale(10),
    borderWidth: 1,
    borderColor: colors.primary + "1A",
  },
  headerSubtitle: {
    color: colors.textSecondary,
    lineHeight: verticalScale(15),
    flex: 1,
  },
  section: {
    marginBottom: verticalScale(28), // separated by spacing, no cards/shadows
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border + "40",
    paddingBottom: verticalScale(8),
  },
  sectionIconWrap: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(6),
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: colors.text,
  },
  inputLabel: {
    color: colors.text,
    marginBottom: verticalScale(8),
    opacity: 0.8,
  },

  // Blood Group Grid
  bloodGroupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  bloodGroupButton: {
    width: "22%",
    height: verticalScale(40),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "60",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  bloodGroupButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bloodGroupText: {
    color: colors.text,
  },
  bloodGroupTextActive: {
    color: colors.white,
  },

  // Units Stepper Selector
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "60",
    height: verticalScale(48),
    paddingHorizontal: scale(4),
  },
  stepperButton: {
    width: scale(44),
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  stepperValueContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  stepperValueText: {
    color: colors.text,
  },

  // Picker selection buttons (State/City)
  pickerButton: {
    height: verticalScale(48),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "60",
    paddingHorizontal: scale(12),
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  pickerValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Urgency Cards Selector
  urgencyContainer: {
    flexDirection: "row",
    gap: scale(8),
  },
  urgencyCard: {
    flex: 1,
    height: verticalScale(50),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "60",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: scale(6),
  },
  urgencyText: {
    marginTop: verticalScale(2),
    color: colors.textSecondary,
  },

  // Required Date & Time Styles
  dateTimePickersRow: {
    flexDirection: "row",
    gap: scale(10),
    marginBottom: verticalScale(12),
  },
  dateTimePickerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "70",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    gap: scale(8),
  },
  dateTimePickerBtnIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(6),
    backgroundColor: withOpacity(colors.primary, 0.08),
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimePickerBtnTextWrap: {
    flex: 1,
  },
  dateTimePickerBtnLabel: {
    color: colors.textSecondary,
    marginBottom: verticalScale(2),
  },
  dateTimePickerBtnVal: {
    color: colors.text,
  },
  dateTimeSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: withOpacity(colors.primary, 0.04),
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.2),
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    gap: scale(10),
  },
  dateTimeSummaryTextWrap: {
    flex: 1,
  },
  dateTimeCountdownBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    backgroundColor: colors.primary,
  },
  dateTimeCountdownText: {
    color: colors.white,
  },

  // Description / Case notes multi-line input
  descriptionContainer: {
    height: verticalScale(110),
    alignItems: "flex-start",
    paddingTop: verticalScale(8),
  },
  descriptionInput: {
    height: "100%",
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
  },

  submitButton: {
    marginTop: verticalScale(16),
    height: verticalScale(48),
    borderRadius: moderateScale(8),
  },

  // Map Modal & Trigger Styles
  mapSelectButton: {
    height: verticalScale(48),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: colors.border + "60",
    paddingHorizontal: scale(12),
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  mapSelectValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centerMarkerContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -verticalScale(30),
    marginLeft: -scale(15),
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  floatingLocateButton: {
    position: "absolute",
    bottom: verticalScale(90),
    right: scale(16),
    backgroundColor: colors.white,
    borderRadius: moderateScale(25),
    width: moderateScale(46),
    height: moderateScale(46),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  floatingConfirmContainer: {
    position: "absolute",
    bottom: verticalScale(20),
    left: scale(16),
    right: scale(16),
  },
  confirmButton: {
    height: verticalScale(48),
    borderRadius: moderateScale(8),
  },
  mapHeaderCloseButton: {
    padding: scale(4),
  },

  // Search bar inside map modal
  searchBarContainer: {
    position: "absolute",
    top: verticalScale(8),
    left: scale(16),
    right: scale(16),
    zIndex: 10,
  },
  searchBarInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    height: verticalScale(44),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: scale(8),
  },
  searchBarInput: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: "Montserrat-Regular",
    color: colors.text,
    padding: 0,
  },
  predictionsContainer: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(8),
    marginTop: verticalScale(4),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
