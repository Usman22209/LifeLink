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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginEnd: scale(16),
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
    bottom: -scale(2),
    end: -scale(2),
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
    borderRadius: scale(14),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    paddingHorizontal: scale(6),
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
  // Modal Styles for Language Selector Picker (Minimalist & Clean)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    width: scale(36),
    height: verticalScale(4),
    backgroundColor: colors.border,
    borderRadius: scale(2),
    alignSelf: "center",
    marginBottom: verticalScale(14),
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: verticalScale(10),
  },
  modalTitle: {
    color: colors.text,
  },
  modalCloseBtn: {
    padding: scale(4),
  },
  cleanOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
  },
  cleanOptionRowSelected: {
    backgroundColor: withOpacity(colors.primary, 0.06),
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginHorizontal: scale(6),
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: verticalScale(12),
  },
});
