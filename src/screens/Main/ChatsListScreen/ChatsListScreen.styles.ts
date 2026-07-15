import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: colors.gray300,
  },
  onlineIndicator: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  content: {
    flex: 1,
    marginLeft: scale(12),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(3),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  nameText: {
    color: colors.text,
  },
  bloodBadge: {
    backgroundColor: "rgba(229, 57, 53, 0.06)",
    borderColor: "rgba(229, 57, 53, 0.15)",
    borderWidth: 1,
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(1),
  },
  bloodText: {
    fontSize: moderateScale(9),
    color: colors.primary,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: moderateScale(10.5),
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    color: colors.textSecondary,
    fontSize: moderateScale(12),
    flex: 1,
    marginRight: scale(12),
  },
  unreadText: {
    color: colors.text,
    fontWeight: "600",
  },
  badge: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: moderateScale(9),
    color: colors.white,
    fontWeight: "bold",
  },
  
  // Empty State Styles
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(40),
  },
  emptyTitle: {
    color: colors.text,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(6),
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(16),
  },
});
