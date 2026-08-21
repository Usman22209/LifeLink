import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

const PAD = scale(16);

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(30),
  },

  headerIconButton: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerDevButton: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    marginRight: scale(6),
  },

  devSeedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(20),
    backgroundColor: "rgba(229, 57, 53, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(229, 57, 53, 0.25)",
    borderStyle: "dashed",
  },

  // Minimal Clean Card
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  cardUnread: {
    backgroundColor: colors.white,
    borderColor: "rgba(229, 57, 53, 0.25)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: moderateScale(14),
    gap: scale(12),
  },

  // Soft Icon
  iconWrap: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardBody: {
    flex: 1,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(3),
    gap: scale(8),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(6),
  },
  cardTitle: {
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  timeText: {
    color: colors.textSecondary,
    flexShrink: 0,
  },
  cardMessage: {
    color: colors.textSecondary,
    lineHeight: verticalScale(17),
    marginTop: verticalScale(1),
  },

  chevronWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(2),
  },

  // Empty State
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(80),
    paddingHorizontal: scale(32),
  },
  emptyIconWrap: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(14),
  },
  emptyTitle: {
    color: colors.text,
    marginBottom: verticalScale(6),
    textAlign: "center",
  },
  emptyBody: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(19),
  },
});
