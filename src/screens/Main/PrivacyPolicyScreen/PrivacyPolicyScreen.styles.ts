import { StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
  },
  lastUpdated: {
    color: colors.textSecondary,
    marginBottom: verticalScale(20),
    fontStyle: "italic",
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  sectionBody: {
    color: colors.textSecondary,
    lineHeight: verticalScale(18),
  },
});
