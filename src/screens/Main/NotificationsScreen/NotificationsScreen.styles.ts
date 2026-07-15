import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

const PAD = scale(16);

export const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },

  list: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(28),
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.gray300,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: moderateScale(14),
    gap: scale(12),
  },
  cardUnread: {
    backgroundColor: "#FFF8F8",
    borderColor: "#FFD1D1",
    borderRadius: moderateScale(14),
  },

  iconWrap: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardBody: {
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
    alignSelf: "stretch",
    paddingLeft: scale(8),
    position: "relative",
    minWidth: scale(52),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(3),
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(6),
  },
  cardTitle: {
    flex: 1,
    marginRight: scale(6),
  },
  timeText: {
    color: colors.textSecondary,
    flexShrink: 0,
  },
  cardMessage: {
    color: colors.textSecondary,
    lineHeight: verticalScale(18),
  },

  unreadInlineDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.primary,
    flexShrink: 0,
  },

  chevronWrap: {
    position: "absolute",
    right: 0,
    top: verticalScale(14),
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(80),
    paddingHorizontal: scale(32),
  },
  emptyIconWrap: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    color: colors.text,
    marginBottom: verticalScale(6),
  },
  emptyBody: {
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
});
