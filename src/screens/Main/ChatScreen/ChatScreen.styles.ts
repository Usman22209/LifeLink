import { StyleSheet, Platform } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  // Custom Premium Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(12),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerChevron: {
    padding: scale(6),
    marginRight: scale(4),
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    marginRight: scale(10),
    backgroundColor: colors.gray300,
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerName: {
    fontSize: moderateScale(14),
    color: colors.text,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(1),
  },
  headerStatusDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.success,
    marginRight: scale(4),
  },
  headerStatusText: {
    fontSize: moderateScale(10),
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  headerAction: {
    padding: scale(6),
  },

  chatContainer: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
    alignItems: "flex-end",
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    marginRight: scale(8),
    backgroundColor: colors.gray300,
  },
  messageBubble: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(16),
    maxWidth: "75%",
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: moderateScale(4),
  },
  otherMessageBubble: {
    backgroundColor: "#F0F0F2",
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(13),
    lineHeight: verticalScale(17),
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: moderateScale(8.5),
    marginTop: verticalScale(4),
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherMessageTime: {
    color: colors.textSecondary,
  },

  // Request Context Banner
  contextBanner: {
    backgroundColor: "rgba(229, 57, 53, 0.02)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  contextIcon: {
    marginRight: scale(2),
  },
  contextText: {
    color: colors.textSecondary,
    fontSize: moderateScale(11),
    flex: 1,
  },
  contextBold: {
    color: colors.primary,
    fontWeight: "bold",
  },

  // Simulated Typing Indicator
  typingBubble: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    minWidth: scale(44),
    alignItems: "center",
    justifyContent: "center",
  },
  typingDotContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  typingDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.textSecondary,
  },

  // Bottom Input Area
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.06)",
    backgroundColor: colors.white,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    paddingTop:verticalScale(8)

  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: moderateScale(14),
    maxHeight: verticalScale(80),
    paddingHorizontal: 0,
    paddingVertical: Platform.OS === "ios" ? verticalScale(8) : verticalScale(6),
  },
  sendButton: {
    padding: scale(6),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(10),
  },
});
