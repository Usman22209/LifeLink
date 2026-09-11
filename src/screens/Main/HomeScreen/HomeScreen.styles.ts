import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  sectionGap: {
    marginTop: verticalScale(12),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  urgentScrollWrapper: {
    marginHorizontal: -moderateScale(16),
    marginVertical: -verticalScale(6),
  },
  urgentScroll: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(6),
    gap: scale(6),
  },
});

export const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: colors.background,
  },
  profileSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    borderWidth: 2,
    borderColor: "rgba(229, 57, 53, 0.25)",
    backgroundColor: "rgba(229, 57, 53, 0.08)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(22),
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: colors.primary,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(11),
    height: moderateScale(11),
    borderRadius: moderateScale(6),
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  greetingContainer: {
    marginHorizontal: scale(10),
    flex: 1,
  },
  notificationButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: moderateScale(6),
    right: moderateScale(6),
    minWidth: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(3),
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.gray300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accentBar: {
    width: moderateScale(4),
  },
  inner: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(12),
  },
  topRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  bloodPill: {
    borderWidth: 1.5,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },
  badge: {
    alignItems: "center",
  },
  hospitalContainer: {
    height: verticalScale(36),
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  hospital: {
    color: colors.text,
    lineHeight: verticalScale(17),
  },
  metaRow: {
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(8),
  },
  footer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerItem: {
    alignItems: "center",
  },
});
