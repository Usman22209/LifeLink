import { StyleSheet, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

const isRtl = I18nManager.isRTL;

export const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    scrollContent: {
        paddingHorizontal: scale(16), // Matching Login Screen
        paddingBottom: verticalScale(40),
    },
    imageSection: {
        alignItems: "center",
        marginTop: verticalScale(10), // Reduced from 20
        marginBottom: verticalScale(25), // Reduced from 35
    },
    imageContainer: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: colors.card,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(50),
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        borderRadius: moderateScale(50),
        backgroundColor: colors.card,
        justifyContent: "center",
        alignItems: "center",
    },
    cameraIconContainer: {
        position: "absolute",
        bottom: -moderateScale(2),
        right: -moderateScale(2),
        backgroundColor: colors.primary,
        padding: moderateScale(7),
        borderRadius: moderateScale(18),
        borderWidth: 2,
        borderColor: colors.white,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    uploadText: {
        color: colors.primary,
        fontSize: moderateScale(14),
    },
    recognizeText: {
        color: colors.textSecondary,
        opacity: 0.6,
        marginTop: verticalScale(4),
    },
    removeButton: {
        marginTop: verticalScale(8),
    },
    removeText: {
        color: colors.error,
        fontSize: moderateScale(12),
        opacity: 0.7,
    },
    section: {
        marginBottom: verticalScale(12), // Reduced to match AppInput margin
    },
    sectionTitle: {
        color: colors.text,
        marginBottom: verticalScale(12), // Reduced from 18
        opacity: 0.9,
    },
    inputLabel: {
        color: colors.text,
        marginBottom: verticalScale(6), // Tightened
        opacity: 0.8,
    },
    genderContainer: {
        flexDirection: "row",
        gap: scale(10),
    },
    genderCard: {
        flex: 1,
        height: verticalScale(48), // Matching standard button heights
        flexDirection: 'row',
        borderRadius: moderateScale(12), // Matching Login Screen
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.card,
        paddingHorizontal: scale(12),
    },
    genderCardActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    genderText: {
        marginLeft: scale(8),
    },
    pickerButton: {
        height: verticalScale(48), // Matching Login button height
        borderRadius: moderateScale(12), // Matching Login rounding
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: scale(12),
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.card,
    },
    pickerValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagEmoji: {
        fontSize: moderateScale(18),
        marginRight: scale(10),
    },
    bloodGroupGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: moderateScale(8),
    },
    bloodGroupButton: {
        width: "23%",
        height: verticalScale(42),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: colors.primary + "10",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
    },
    bloodGroupButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    submitButton: {
        marginTop: verticalScale(12),
        height: verticalScale(48), // Standardized
        borderRadius: moderateScale(12),
    },
});
