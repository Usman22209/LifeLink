import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, I18nManager, Alert } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation as useI18NextTranslation } from "react-i18next"; // Temporarily kept if needed by other parts, but better to remove if unused
import useTranslation from "@shared/hooks/useTranslation";
import useLanguage from "@shared/hooks/useLanguage";
import RNRestart from "react-native-restart";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppImage from "@components/AppImage";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { AppImages } from "@assets/images";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { RTL_LANGUAGES } from "@shared/i18n";
import type { AuthStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

type WelcomeScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    typeof ROUTES.WELCOME
>;

const WelcomeScreen = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const { t } = useTranslation();
    const { language, changeLanguage } = useLanguage();

    // Local state for modal selection before confirming
    const [tempLanguage, setTempLanguage] = useState<"en" | "ur">(language);
    const [modalVisible, setModalVisible] = useState(false);

    const openLanguageModal = () => {
        setTempLanguage(language);
        setModalVisible(true);
    };

    const confirmLanguageSelection = () => {
        changeLanguage(tempLanguage);
        setModalVisible(false);
    };



    return (
        <ScreenWrapper
            scrollable={false}
            safeArea
            backgroundColor={colors.background}
            style={styles.wrapper}
        >
            <View style={styles.container}>
                {/* Language Button - Top Right */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.languageButton}
                        onPress={openLanguageModal}
                        activeOpacity={0.7}
                    >
                        <AnyIcon
                            type={Icons.Ionicons}
                            name="globe-outline"
                            size={moderateScale(16)}
                            color={colors.primary}
                        />
                        <Text bold FONT_12 style={styles.languageButtonText}>
                            {language === "en" ? "EN" : "UR"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>

                        <AppImage
                            source={AppImages.AppLogoHorizontal}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Text medium FONT_16 style={styles.tagline}>
                            {t("tagline")}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonSection}>
                        <AppButton
                            title={t("createAccount")}
                            onPress={() => navigation.navigate(ROUTES.SIGNUP)}
                        />

                        <AppButton
                            title={t("signIn")}
                            onPress={() => navigation.navigate(ROUTES.LOGIN)}
                            variant="outline"
                        />
                    </View>
                </View>
            </View>

            {/* Language Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Modal Handle */}
                        <View style={styles.modalHandle} />

                        {/* Modal Title */}
                        <Text bold FONT_18 style={styles.modalTitle}>
                            {t("selectLanguage")}
                        </Text>

                        {/* Language Options */}
                        <View style={styles.languageOptions}>
                            {/* English Option */}
                            <TouchableOpacity
                                style={[
                                    styles.languageOption,
                                    tempLanguage === "en" && styles.languageOptionSelected,
                                ]}
                                onPress={() => setTempLanguage("en")}
                                activeOpacity={0.7}
                            >
                                <Text semiBold FONT_14 style={styles.languageOptionText}>
                                    {t("english")}
                                </Text>
                                <View
                                    style={[
                                        styles.radioButton,
                                        tempLanguage === "en" && styles.radioButtonSelected,
                                    ]}
                                >
                                    {tempLanguage === "en" && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* Urdu Option */}
                            <TouchableOpacity
                                style={[
                                    styles.languageOption,
                                    tempLanguage === "ur" && styles.languageOptionSelected,
                                ]}
                                onPress={() => setTempLanguage("ur")}
                                activeOpacity={0.7}
                            >
                                <Text semiBold FONT_14 style={styles.languageOptionText}>
                                    {t("urdu")}
                                </Text>
                                <View
                                    style={[
                                        styles.radioButton,
                                        tempLanguage === "ur" && styles.radioButtonSelected,
                                    ]}
                                >
                                    {tempLanguage === "ur" && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Button */}
                        <View style={styles.confirmButtonContainer}>
                            <AppButton
                                title={t("confirmSelection")}
                                onPress={confirmLanguageSelection}
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </ScreenWrapper>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(40),
    },
    topBar: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        justifyContent: I18nManager.isRTL ? "flex-start" : "flex-end",
        marginBottom: verticalScale(30),
    },
    languageButton: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: scale(5),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        backgroundColor: colors.white,
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    languageButtonText: {
        color: colors.primary,
        letterSpacing: 0.3,
    },
    languageSeparator: {
        color: colors.border,
        marginHorizontal: scale(2),
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
    },
    logoSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: verticalScale(20),
    },
    logo: {
        width: scale(240),
        height: verticalScale(100),
    },
    tagline: {
        color: colors.textSecondary,
        textAlign: "center",
    },
    buttonSection: {
        gap: verticalScale(14),
        paddingBottom: verticalScale(10),
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(32),
        gap: verticalScale(16),
    },
    modalHandle: {
        width: scale(40),
        height: verticalScale(4),
        backgroundColor: colors.border,
        borderRadius: moderateScale(2),
        alignSelf: "center",
        marginBottom: verticalScale(8),
    },
    modalTitle: {
        color: colors.text,
        textAlign: "left",
    },
    languageOptions: {
        gap: verticalScale(12),
    },
    languageOption: {
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(18),
        paddingVertical: verticalScale(14),
        backgroundColor: colors.card,
        borderRadius: moderateScale(14),
        borderWidth: 2,
        borderColor: "transparent",
    },
    languageOptionSelected: {
        backgroundColor: "rgba(229, 57, 53, 0.05)",
        borderColor: colors.primary,
    },
    languageOptionText: {
        color: colors.text,
    },
    radioButton: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    radioButtonSelected: {
        borderColor: colors.primary,
    },
    radioButtonInner: {
        width: moderateScale(10),
        height: moderateScale(10),
        borderRadius: moderateScale(5),
        backgroundColor: colors.primary,
    },
    confirmButtonContainer: {
        marginTop: verticalScale(4),
    },
});
