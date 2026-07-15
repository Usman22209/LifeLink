import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { colors, withOpacity } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: verticalScale(40),
  },
  // Profile Header Card (Clean & Elegant)
  profileHeaderCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    padding: scale(16),
    backgroundColor: colors.white,
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    position: "relative",
    marginRight: scale(16),
  },
  avatar: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    position: "absolute",
    bottom: -scale(4),
    right: -scale(4),
    backgroundColor: colors.primary,
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(1),
    borderRadius: scale(8),
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    color: colors.text,
  },
  email: {
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  // Stats Row (Compact & Minimal)
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: verticalScale(24),
    backgroundColor: colors.border,
  },
  statValue: {
    color: colors.primary,
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: verticalScale(1),
  },
  // Settings Sections
  section: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  sectionTitle: {
    color: colors.textSecondary,
    marginBottom: verticalScale(6),
    paddingLeft: scale(4),
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  // Setting Item Row
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(6),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  itemLabel: {
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: scale(16),
  },
  // Action Buttons
  logoutBtn: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(24),
    backgroundColor: withOpacity(colors.primary, 0.06),
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.15),
    width: "auto",
  },
  logoutTitle: {
    color: colors.primary,
  },
  versionText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: verticalScale(24),
  },
  // Modal Styles for Language Selector Picker
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 15, 15, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingTop: verticalScale(8),
    paddingHorizontal: scale(24),
  },
  modalHandle: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: colors.border,
    borderRadius: scale(2),
    alignSelf: "center",
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    color: colors.text,
    textAlign: "center",
    marginBottom: verticalScale(20),
  },
  languageOptions: {
    marginBottom: verticalScale(20),
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    backgroundColor: colors.card,
    marginBottom: verticalScale(10),
  },
  languageOptionSelected: {
    backgroundColor: withOpacity(colors.primary, 0.08),
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.2),
  },
  languageOptionText: {
    color: colors.text,
  },
  radioCircle: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: colors.primary,
  },
  modalButtons: {
    flexDirection: "row",
    gap: scale(12),
  },
  modalButton: {
    flex: 1,
  },
});
