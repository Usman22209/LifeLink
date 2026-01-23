import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ScreenWrapper from "@components/ScreenWrapper";
import Text from "@components/AppText";
import AppInput from "@components/AppInput";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { useOnboardingForm } from "@shared/forms/hooks/useOnboardingForm";
import useTranslation from "@shared/hooks/useTranslation";
import { OnboardingFormValues } from "@shared/forms/schemas/onboarding.schema";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";

type CompleteProfileNavigationProp = StackNavigationProp<
    UserStackParamList,
    typeof ROUTES.ONBOARDING
>;

const CompleteProfileScreen = () => {
    const navigation = useNavigation<CompleteProfileNavigationProp>();
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useOnboardingForm();

    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const profileImage = watch("profile_image");
    const isRtl = I18nManager.isRTL;

    const onSubmit = (data: OnboardingFormValues) => {
        setLoading(true);
        console.log("Profile Data:", data);
        setTimeout(() => {
            setLoading(false);
            navigation.replace(ROUTES.MAIN_FLOW);
        }, 1500);
    };

    const handleImageUpload = () => {
        console.log("Image upload clicked");
    };

    const handleConfirmDate = (date: Date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setValue("dob", formattedDate);
        setDatePickerVisibility(false);
    };

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    return (
        <ScreenWrapper
            backgroundColor={colors.background}
            safeArea
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === "ios" ? verticalScale(20) : 0}
            >
                <View style={[styles.header, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AnyIcon
                            type={Icons.Ionicons}
                            name={isRtl ? "chevron-forward" : "chevron-back"}
                            size={moderateScale(24)}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                    <Text bold FONT_18 style={styles.headerTitle}>
                        {t("onboarding.title")}
                    </Text>
                    <View style={{ width: moderateScale(24) }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text regular FONT_14 style={styles.subtitle}>
                        {t("onboarding.subtitle")}
                    </Text>

                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <TouchableOpacity
                            onPress={handleImageUpload}
                            style={styles.imageContainer}
                            activeOpacity={0.8}
                        >
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <AnyIcon
                                        type={Icons.MaterialIcons}
                                        name="person"
                                        size={moderateScale(50)}
                                        color={colors.placeholder}
                                    />
                                </View>
                            )}
                            <View style={[styles.cameraIconContainer, isRtl ? { left: 0, right: undefined } : { right: 0, left: undefined }]}>
                                <AnyIcon
                                    type={Icons.MaterialIcons}
                                    name="photo-camera"
                                    size={moderateScale(16)}
                                    color={colors.white}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text semiBold FONT_16 style={styles.uploadText}>
                            {t("onboarding.uploadPhoto")}
                        </Text>
                        <Text regular FONT_12 style={styles.recognizeText}>
                            {t("onboarding.recognizeYou")}
                        </Text>
                    </View>

                    {/* Basic Information Section */}
                    <View style={styles.section}>
                        <Text bold FONT_16 style={[styles.sectionTitle, { textAlign: isRtl ? "right" : "left" }]}>
                            {t("onboarding.basicInfo")}
                        </Text>
                        <AppInput
                            name="name"
                            control={control}
                            label={t("onboarding.fullName")}
                            placeholder={t("onboarding.fullNamePlaceholder")}
                            error={errors.name?.message}
                        />
                        <AppInput
                            name="phone"
                            control={control}
                            label={t("onboarding.phone")}
                            placeholder={t("onboarding.phonePlaceholder")}
                            keyboardType="phone-pad"
                            error={errors.phone?.message}
                        />
                        <AppInput
                            name="email"
                            control={control}
                            label={t("onboarding.email")}
                            placeholder={t("onboarding.emailPlaceholder")}
                            keyboardType="email-address"
                            error={errors.email?.message}
                        />
                    </View>

                    {/* Gender Selection */}
                    <View style={styles.section}>
                        <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                            {t("onboarding.gender")}
                        </Text>
                        <View style={[styles.genderContainer, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                            {["male", "female", "other"].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => setValue("gender", g)}
                                    style={[
                                        styles.genderCard,
                                        watch("gender") === g && styles.genderCardActive
                                    ]}
                                >
                                    <AnyIcon
                                        type={Icons.MaterialCommunityIcons}
                                        name={g === "male" ? "gender-male" : g === "female" ? "gender-female" : "gender-non-binary"}
                                        size={moderateScale(24)}
                                        color={watch("gender") === g ? colors.white : colors.primary}
                                    />
                                    <Text
                                        semiBold
                                        FONT_12
                                        style={[
                                            styles.genderText,
                                            watch("gender") === g ? { color: colors.white } : { color: colors.textSecondary }
                                        ]}
                                    >
                                        {t(`onboarding.${g}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.gender && (
                            <Text FONT_12 style={[{ color: colors.error, marginTop: verticalScale(4), textAlign: isRtl ? "right" : "left" }]}>
                                {errors.gender.message}
                            </Text>
                        )}
                    </View>

                    {/* DOB Picker */}
                    <View style={styles.section}>
                        <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                            {t("onboarding.dob")}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setDatePickerVisibility(true)}
                            activeOpacity={0.7}
                            style={[
                                styles.datePickerButton,
                                { flexDirection: isRtl ? "row-reverse" : "row" }
                            ]}
                        >
                            <Text regular FONT_14 style={watch("dob") ? { color: colors.text } : { color: colors.placeholder }}>
                                {watch("dob") || "YYYY-MM-DD"}
                            </Text>
                            <AnyIcon
                                type={Icons.MaterialCommunityIcons}
                                name="calendar-month"
                                size={moderateScale(20)}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                        {errors.dob && (
                            <Text FONT_12 style={[{ color: colors.error, marginTop: verticalScale(4), textAlign: isRtl ? "right" : "left" }]}>
                                {errors.dob.message}
                            </Text>
                        )}
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmDate}
                            onCancel={() => setDatePickerVisibility(false)}
                            maximumDate={new Date()}
                        />
                    </View>

                    {/* Location Section */}
                    <View style={styles.section}>
                        <AppInput
                            name="city"
                            control={control}
                            label={t("onboarding.city")}
                            placeholder={t("onboarding.cityPlaceholder")}
                            error={errors.city?.message}
                        />
                        <AppInput
                            name="state"
                            control={control}
                            label={t("onboarding.state")}
                            placeholder={t("onboarding.statePlaceholder")}
                            error={errors.state?.message}
                        />
                        <AppInput
                            name="country"
                            control={control}
                            label={t("onboarding.country")}
                            placeholder={t("onboarding.countryPlaceholder")}
                            error={errors.country?.message}
                        />
                    </View>

                    {/* Medical Section */}
                    <View style={styles.section}>
                        <Text bold FONT_16 style={[styles.sectionTitle, { textAlign: isRtl ? "right" : "left" }]}>
                            {t("onboarding.medicalInfo")}
                        </Text>
                        <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                            {t("onboarding.selectBloodGroup")}
                        </Text>
                        <View style={[styles.bloodGroupGrid, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                            {bloodGroups.map((group) => (
                                <TouchableOpacity
                                    key={group}
                                    onPress={() => setValue("blood_group", group)}
                                    style={[
                                        styles.bloodGroupButton,
                                        watch("blood_group") === group && styles.bloodGroupButtonActive
                                    ]}
                                >
                                    <Text
                                        bold
                                        FONT_14
                                        style={[
                                            watch("blood_group") === group ? { color: colors.white } : { color: colors.primary }
                                        ]}
                                    >
                                        {group}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.blood_group && (
                            <Text FONT_12 style={[{ color: colors.error, marginTop: verticalScale(4), textAlign: isRtl ? "right" : "left" }]}>
                                {errors.blood_group.message}
                            </Text>
                        )}
                    </View>

                    <AppButton
                        title={t("onboarding.completeButton")}
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.submitButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

export default CompleteProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    header: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(10),
    },
    headerTitle: {
        color: colors.text,
    },
    scrollContent: {
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(30),
    },
    subtitle: {
        textAlign: "center",
        color: "#2E7D32",
        marginBottom: verticalScale(20),
    },
    imageSection: {
        alignItems: "center",
        marginBottom: verticalScale(30),
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
        bottom: 0,
        backgroundColor: colors.primary,
        padding: moderateScale(6),
        borderRadius: moderateScale(15),
        borderWidth: 2,
        borderColor: colors.white,
    },
    uploadText: {
        color: colors.text,
        marginBottom: verticalScale(2),
    },
    recognizeText: {
        color: colors.textSecondary,
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionTitle: {
        color: colors.text,
        marginBottom: verticalScale(12),
    },
    inputLabel: {
        color: colors.text,
        marginBottom: verticalScale(8),
    },
    genderContainer: {
        gap: scale(10),
    },
    genderCard: {
        flex: 1,
        paddingVertical: verticalScale(16),
        borderRadius: moderateScale(12),
        borderWidth: 1.5,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.card,
    },
    genderCardActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    genderText: {
        marginTop: verticalScale(8),
    },
    datePickerButton: {
        height: verticalScale(48),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: scale(12),
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.card,
    },
    bloodGroupGrid: {
        flexWrap: "wrap",
        gap: moderateScale(8),
    },
    bloodGroupButton: {
        width: "22.5%",
        height: verticalScale(45),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: colors.primary + "30",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
    },
    bloodGroupButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    submitButton: {
        marginTop: verticalScale(10),
    },
});
