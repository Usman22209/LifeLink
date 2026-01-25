import React, { useState, useMemo, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Platform,
    Image,
    I18nManager,
    StatusBar,
    PermissionsAndroid,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useMediaPicker from "@shared/hooks/useImagePicker";
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
import { PROFILE_SERVICE } from "@shared/api/service/profile.service";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "@store/slices/authSlice";
import { useUploadImage } from "@shared/query/file/useUploadImage";



// Global Components
import AppHeader from "@components/AppHeader";
import ImagePickerModal from "@components/ImagePickerModal";
import CountryPickerModal from "@components/CountryPickerModal";
import { styles } from "./styles/CompleteProfile.styles";

type CompleteProfileNavigationProp = StackNavigationProp<
    UserStackParamList,
    typeof ROUTES.ONBOARDING
>;

const COUNTRIES = [
    { name: "Pakistan", code: "PK", flag: "🇵🇰" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Canada", code: "CA", flag: "🇨🇦" },
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "India", code: "IN", flag: "🇮🇳" },
    { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
    { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "France", code: "FR", flag: "🇫🇷" },
].sort((a, b) => a.name.localeCompare(b.name));

const CompleteProfileScreen = () => {
    const navigation = useNavigation<CompleteProfileNavigationProp>();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useOnboardingForm();


    const [loading, setLoading] = useState(false);
    const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
    const [localImage, setLocalImage] = useState<string | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [isCountryModalVisible, setCountryModalVisible] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");

    const profileImage = watch("profile_image");
    const selectedCountry = watch("country");

    // Find flag derived from selectedCountry name
    const currentFlag = useMemo(() => {
        return COUNTRIES.find(c => c.name === selectedCountry)?.flag;
    }, [selectedCountry]);

    const isRtl = I18nManager.isRTL;

    const filteredCountries = useMemo(() => {
        return COUNTRIES.filter(c =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase())
        );
    }, [countrySearch]);

    const onSubmit = async (data: OnboardingFormValues) => {
        setLoading(true);
        try {
            const response = await PROFILE_SERVICE.updateProfile({
                ...data,
                is_onboarded: true
            } as any);

            if (response.data.success) {
                dispatch(updateUser({ is_onboarded: true }));
                // Navigation handles itself via UserNavigation
            }
        } catch (error) {
            console.error("[CompleteProfile] Update error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDate = (date: Date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setValue("dob", formattedDate);
        setDatePickerVisibility(false);
    };

    const { media, pickFromCamera, pickFromGallery } = useMediaPicker();

    useEffect(() => {
        const handleUpload = async () => {
            if (media && !Array.isArray(media)) {
                setLocalImage(media.path);
                try {
                    const file = {
                        uri: media.path,
                        type: media.mime || "image/jpeg",
                        name: media.path.split("/").pop() || "profile.jpg",
                    };
                    const response = await uploadImage(file);
                    if (response?.data?.url) {
                        setValue("profile_image", response.data.url);
                        setLocalImage(null); // Clear local preview once remote is set
                    }
                } catch (error) {
                    console.error("[CompleteProfile] Upload error:", error);
                } finally {
                    setImageModalVisible(false);
                }
            }
        };
        handleUpload();
    }, [media, setValue, uploadImage]);



    useEffect(() => {
        if (user?.email) {
            setValue("email", user.email);
        }
    }, [user?.email, setValue]);


    const pickImage = async (type: 'camera' | 'gallery') => {
        setImageModalVisible(false);
        if (type === 'camera' && Platform.OS === 'android') {

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "LifeLink needs access to your camera to take a profile picture.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
            } catch (err) {
                console.warn("[PickImage] Permission error:", err);
            }
        }

        const options = {
            mediaType: 'photo' as const,
            cropping: true,
            width: 400,
            height: 400,
        };

        if (type === 'camera') {
            await pickFromCamera(options);
        } else {
            await pickFromGallery({ ...options, multiple: false });
        }
    };

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    return (
        <ScreenWrapper
            backgroundColor={colors.background}
            safeArea
            header={
                <AppHeader
                    title={t("onboarding.title")}
                    hasBorder
                />
            }
            style={styles.container}
        >
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={verticalScale(150)}
                extraHeight={verticalScale(100)}
            >
                <View style={styles.imageSection}>
                    <TouchableOpacity
                        onPress={() => setImageModalVisible(true)}
                        style={styles.imageContainer}
                        activeOpacity={0.8}
                    >
                        {(profileImage || localImage) ? (
                            <View style={styles.profileImage}>
                                <Image
                                    source={{ uri: profileImage || localImage || "" }}
                                    style={styles.profileImage}
                                />
                                {isUploading && (
                                    <View style={[
                                        styles.profileImage,
                                        {
                                            position: 'absolute',
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}>
                                        <AnyIcon
                                            type={Icons.MaterialIcons}
                                            name="cloud-upload"
                                            size={moderateScale(32)}
                                            color={colors.white}
                                        />
                                    </View>
                                )}
                            </View>
                        ) : (


                            <View style={styles.imagePlaceholder}>
                                <AnyIcon
                                    type={Icons.MaterialIcons}
                                    name="person"
                                    size={moderateScale(55)}
                                    color={colors.placeholder}
                                />
                            </View>
                        )}
                        <View style={styles.cameraIconContainer}>
                            <AnyIcon
                                type={Icons.MaterialIcons}
                                name="camera-alt"
                                size={moderateScale(14)}
                                color={colors.white}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                        <Text semiBold style={styles.uploadText}>
                            {profileImage ? t("onboarding.changePhoto") : t("onboarding.uploadPhoto")}
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.section}>
                    <Text bold FONT_16 style={[styles.sectionTitle, { textAlign: isRtl ? "right" : "left" }]}>
                        {t("onboarding.basicInfo")}
                    </Text>
                    <AppInput
                        name="full_name"
                        control={control}
                        label={t("onboarding.fullName")}
                        placeholder={t("onboarding.fullNamePlaceholder")}
                        error={errors.full_name?.message}
                        autoCapitalize="words"
                        iconType={Icons.MaterialIcons}
                        iconName="person-outline"
                    />
                    <AppInput
                        name="phone"
                        control={control}
                        label={t("onboarding.phone")}
                        placeholder={t("onboarding.phonePlaceholder")}
                        keyboardType="phone-pad"
                        error={errors.phone?.message}
                        iconType={Icons.MaterialIcons}
                        iconName="phone-iphone"
                    />
                    <AppInput
                        name="email"
                        control={control}
                        label={t("onboarding.email")}
                        placeholder={t("onboarding.emailPlaceholder")}
                        keyboardType="email-address"
                        error={errors.email?.message}
                        iconType={Icons.MaterialIcons}
                        iconName="mail-outline"
                        marginBottom={0}
                        editable={!user?.email}
                    />

                </View>

                <View style={styles.section}>
                    <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                        {t("onboarding.gender")}
                    </Text>
                    <View style={[styles.genderContainer, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
                        {["male", "female"].map((g) => (
                            <TouchableOpacity
                                key={g}
                                onPress={() => setValue("gender", g)}
                                style={[
                                    styles.genderCard,
                                    watch("gender") === g && styles.genderCardActive
                                ]}
                                activeOpacity={0.8}
                            >
                                <AnyIcon
                                    type={Icons.MaterialCommunityIcons}
                                    name={g === "male" ? "gender-male" : "gender-female"}
                                    size={moderateScale(20)}
                                    color={watch("gender") === g ? colors.white : colors.primary}
                                />
                                <Text
                                    semiBold
                                    FONT_14
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
                        <Text FONT_12 style={[{ color: colors.error, marginTop: 4, textAlign: isRtl ? "right" : "left" }]}>
                            {errors.gender.message}
                        </Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                        {t("onboarding.dob")}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setDatePickerVisibility(true)}
                        activeOpacity={0.7}
                        style={[
                            styles.pickerButton,
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
                        <Text FONT_12 style={[{ color: colors.error, marginTop: 4, textAlign: isRtl ? "right" : "left" }]}>
                            {errors.dob.message}
                        </Text>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisibility(false)}
                        maximumDate={new Date()}
                        accentColor={colors.primary}
                        buttonTextColorIOS={colors.primary}
                    />
                </View>

                <View style={styles.section}>
                    <Text bold FONT_16 style={[styles.sectionTitle, { textAlign: isRtl ? "right" : "left" }]}>
                        Location
                    </Text>

                    <Text semiBold FONT_14 style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}>
                        {t("onboarding.country")}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setCountryModalVisible(true)}
                        activeOpacity={0.7}
                        style={[
                            styles.pickerButton,
                            { flexDirection: isRtl ? "row-reverse" : "row" }
                        ]}
                    >
                        <View style={styles.pickerValueContainer}>
                            {currentFlag && <Text style={styles.flagEmoji}>{currentFlag}</Text>}
                            <Text regular FONT_14 style={selectedCountry ? { color: colors.text } : { color: colors.placeholder }}>
                                {selectedCountry || t("onboarding.countryPlaceholder")}
                            </Text>
                        </View>
                        <AnyIcon
                            type={Icons.MaterialIcons}
                            name="public"
                            size={moderateScale(20)}
                            color={colors.primary}
                        />
                    </TouchableOpacity>



                    <AppInput
                        name="state"
                        control={control}
                        label={t("onboarding.state")}
                        placeholder={t("onboarding.statePlaceholder")}
                        error={errors.state?.message}
                        iconType={Icons.MaterialIcons}
                        iconName="map"
                    />
                    <AppInput
                        name="city"
                        control={control}
                        label={t("onboarding.city")}
                        placeholder={t("onboarding.cityPlaceholder")}
                        error={errors.city?.message}
                        iconType={Icons.MaterialIcons}
                        iconName="location-city"
                        marginBottom={0}
                    />
                </View>

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
                </View>

                <AppButton
                    title={t("onboarding.completeButton")}
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    style={styles.submitButton}
                />
            </KeyboardAwareScrollView>

            <ImagePickerModal
                isVisible={isImageModalVisible}
                onClose={() => setImageModalVisible(false)}
                onSelectSource={pickImage}
                showRemove={!!profileImage}
                onRemove={() => {
                    setValue("profile_image", "");
                    setImageModalVisible(false);
                }}
            />

            <CountryPickerModal
                isVisible={isCountryModalVisible}
                onClose={() => setCountryModalVisible(false)}
                countries={filteredCountries}
                selectedCountry={selectedCountry}
                onSelect={(country) => {
                    setValue("country", country);
                    setCountryModalVisible(false);
                }}
                onSearch={setCountrySearch}
            />
        </ScreenWrapper>
    );
};

export default CompleteProfileScreen;
