import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  Image,
  I18nManager,
  PermissionsAndroid,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
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
import { selectLanguage } from "@store/slices/appSlice";
import { useUploadImage } from "@shared/query/file/useUploadImage";
import { getCurrentLocation, Coords } from "@shared/utils/locationService";

import AppHeader from "@components/AppHeader";
import ImagePickerModal from "@components/ImagePickerModal";
import CountryPickerModal from "@components/CountryPickerModal";
import SelectionModal from "@components/SelectionModal";
import { styles } from "./styles/CompleteProfile.styles";
import CitiesData from "@shared/data/cities.json";

type CompleteProfileNavigationProp = StackNavigationProp<
  UserStackParamList,
  typeof ROUTES.ONBOARDING
>;

type CompleteProfileRouteProp = RouteProp<UserStackParamList, typeof ROUTES.EDIT_PROFILE> & {
  params?: { isEditing?: boolean };
};

const COUNTRIES = [{ name: "Pakistan", code: "PK", flag: "🇵🇰" }];

const CompleteProfileScreen = () => {
  const navigation = useNavigation<CompleteProfileNavigationProp>();
  const route = useRoute<CompleteProfileRouteProp>();
  const isEditing = (route.params as any)?.isEditing === true;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const selectedLang = useSelector(selectLanguage);
  const { t, i18n } = useTranslation();

  // Build initial values from user data when editing
  const editDefaults = useMemo(() => {
    if (!isEditing || !user) return undefined;
    return {
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: (user.gender || "male") as OnboardingFormValues["gender"],
      dob: user.dob || "",
      city: user.city_id || "",
      state: user.state || "",
      country: user.country || "Pakistan",
      blood_group: user.blood_group || "",
      profile_image: user.profile_image || "",
      confirmed_data: true,
    };
  }, [isEditing, user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useOnboardingForm(editDefaults);

  const [loading, setLoading] = useState(false);
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [location, setLocation] = useState<Coords | null>(null);

  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }, []);

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isCountryModalVisible, setCountryModalVisible] = useState(false);
  const [isProvinceModalVisible, setProvinceModalVisible] = useState(false);
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const provinces = useMemo(() => {
    const provinceSet = new Set(CitiesData.cities.map((item) => item.province));
    return Array.from(provinceSet)
      .sort()
      .map((p) => ({
        label:
          t(`onboarding.provinces.${p}`) !== `onboarding.provinces.${p}`
            ? t(`onboarding.provinces.${p}`)
            : p,
        value: p,
      }));
  }, [t]);

  const selectedProvince = watch("state");
  const selectedProvinceLabel = useMemo(() => {
    if (!selectedProvince) return "";
    return t(`onboarding.provinces.${selectedProvince}`) !==
      `onboarding.provinces.${selectedProvince}`
      ? t(`onboarding.provinces.${selectedProvince}`)
      : selectedProvince;
  }, [selectedProvince, t]);
  const selectedCity = watch("city");

  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    return CitiesData.cities
      .filter((item) => item.province === selectedProvince)
      .map((item) => ({
        label: item.name[selectedLang] || item.name.en,
        value: item.id,
      }));
  }, [selectedProvince, selectedLang]);

  const selectedCityName = useMemo(() => {
    if (!selectedCity) return "";
    const city = CitiesData.cities.find((c) => c.id === selectedCity);
    if (!city) return "";
    return city.name[selectedLang] || city.name.en;
  }, [selectedCity, selectedLang]);

  const profileImage = watch("profile_image");
  const selectedCountry = watch("country");

  // Find flag derived from selectedCountry name
  const currentFlag = useMemo(() => {
    return COUNTRIES.find((c) => c.name === selectedCountry)?.flag;
  }, [selectedCountry]);

  const isRtl = I18nManager.isRTL;

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()),
    );
  }, [countrySearch]);

  const onSubmit = async (data: OnboardingFormValues) => {
    setLoading(true);
    try {
      // Remove fields that are not in the profiles table schema
      // We only store city_id now, and derive state/city name on frontend
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, confirmed_data, city, ...sanitizedData } = data;

      const response = await PROFILE_SERVICE.updateProfile({
        ...sanitizedData,
        city_id: data.city, // 'city' in form holds the ID
        state: data.state, // Send state/province to match DB schema
        language_preference: selectedLang,
        is_onboarded: true,
        latitude: location?.latitude,
        longitude: location?.longitude,
      } as any);

      if (response.data.success) {
        if (isEditing) {
          // Update Redux with the edited profile fields and navigate back
          dispatch(
            updateUser({
              full_name: data.full_name,
              phone: data.phone,
              gender: data.gender as "male" | "female",
              dob: data.dob,
              blood_group: data.blood_group,
              country: data.country,
              state: data.state,
              city_id: data.city,
              profile_image: data.profile_image,
            }),
          );
          navigation.goBack();
        } else {
          dispatch(
            updateUser({
              is_onboarded: true,
            }),
          );
          // Navigation handles itself via UserNavigation
        }
      }
    } catch (error) {
      console.error("[CompleteProfile] Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDate = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setValue("dob", formattedDate, { shouldValidate: true });
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
            setValue("profile_image", response.data.url, {
              shouldValidate: true,
            });
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

  useEffect(() => {
    // Skip location fetch in edit mode — user already has location data
    if (isEditing) {
      if (user?.latitude && user?.longitude) {
        setLocation({ latitude: user.latitude, longitude: user.longitude });
      }
      return;
    }
    const fetchLocation = async () => {
      try {
        const coords = await getCurrentLocation();
        if (coords) {
          setLocation(coords);
          console.log("[CompleteProfile] Location captured:", coords);
        }
      } catch (err) {
        console.warn("[CompleteProfile] Failed to fetch location:", err);
      }
    };
    fetchLocation();
  }, [isEditing]);

  const pickImage = async (type: "camera" | "gallery") => {
    setImageModalVisible(false);
    if (type === "camera" && Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message:
              "LifeLink needs access to your camera to take a profile picture.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      } catch (err) {
        console.warn("[PickImage] Permission error:", err);
      }
    }

    const options = {
      mediaType: "photo" as const,
      cropping: true,
      width: 400,
      height: 400,
    };

    if (type === "camera") {
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
          title={isEditing ? (t("profile.editProfile") || "Edit Profile") : t("onboarding.title")}
          hasBorder
          showBackButton={isEditing}
        />
      }
      style={styles.container}
    >
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
            {profileImage || localImage ? (
              <View style={styles.profileImage}>
                <Image
                  source={{ uri: profileImage || localImage || "" }}
                  style={styles.profileImage}
                />
                {isUploading && (
                  <View
                    style={[
                      styles.profileImage,
                      {
                        position: "absolute",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
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
                  size={moderateScale(45)}
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
              {profileImage
                ? t("onboarding.changePhoto")
                : t("onboarding.uploadPhoto")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text
            bold
            FONT_14
            style={[
              styles.sectionTitle,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
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
          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.gender")}
          </Text>
          <View
            style={[
              styles.genderContainer,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            {["male", "female"].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setValue("gender", g, { shouldValidate: true })}
                style={[
                  styles.genderCard,
                  watch("gender") === g && styles.genderCardActive,
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
                  FONT_13
                  style={[
                    styles.genderText,
                    watch("gender") === g
                      ? { color: colors.white }
                      : { color: colors.textSecondary },
                  ]}
                >
                  {t(`onboarding.${g}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && (
            <Text
              FONT_12
              style={[
                {
                  color: colors.error,
                  marginTop: 4,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {errors.gender.message}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.dob")}
          </Text>
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            activeOpacity={0.7}
            style={[
              styles.pickerButton,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.pickerValueContainer,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <Text
                regular
                FONT_13
                style={
                  watch("dob")
                    ? { color: colors.text }
                    : { color: colors.placeholder }
                }
              >
                {watch("dob") || "YYYY-MM-DD"}
              </Text>
            </View>
            <AnyIcon
              type={Icons.MaterialCommunityIcons}
              name="calendar-month"
              size={moderateScale(20)}
              color={colors.primary}
            />
          </TouchableOpacity>
          {errors.dob && (
            <Text
              FONT_12
              style={[
                {
                  color: colors.error,
                  marginTop: 4,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {errors.dob.message}
            </Text>
          )}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={() => setDatePickerVisibility(false)}
            date={watch("dob") ? new Date(watch("dob")) : maxDate}
            maximumDate={maxDate}
            accentColor={colors.primary}
            buttonTextColorIOS={colors.primary}
          />
        </View>

        <View style={styles.section}>
          <Text
            bold
            FONT_14
            style={[
              styles.sectionTitle,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {t("onboarding.location")}
          </Text>

          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.country")}
          </Text>
          <View
            style={[
              styles.pickerButton,
              {
                flexDirection: isRtl ? "row-reverse" : "row",
                opacity: 0.8,
                backgroundColor: colors.border + "40",
                marginBottom: verticalScale(16),
              },
            ]}
          >
            <View
              style={[
                styles.pickerValueContainer,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <View
                style={[
                  styles.icon,
                  { [isRtl ? "marginLeft" : "marginRight"]: scale(10) },
                ]}
              >
                {currentFlag ? (
                  <Text style={styles.flagEmoji}>{currentFlag}</Text>
                ) : (
                  <AnyIcon
                    type={Icons.MaterialIcons}
                    name="public"
                    size={moderateScale(20)}
                    color={colors.primary}
                  />
                )}
              </View>
              <Text regular FONT_13 style={{ color: colors.text }}>
                {selectedCountry
                  ? t(`onboarding.${selectedCountry.toLowerCase()}`)
                  : t("onboarding.pakistan")}
              </Text>
            </View>
          </View>

          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.state")} {t("onboarding.provinceLabel")}
          </Text>
          <TouchableOpacity
            onPress={() => setProvinceModalVisible(true)}
            activeOpacity={0.7}
            style={[
              styles.pickerButton,
              {
                flexDirection: isRtl ? "row-reverse" : "row",
                marginBottom: verticalScale(12),
              },
            ]}
          >
            <View
              style={[
                styles.pickerValueContainer,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <AnyIcon
                type={Icons.MaterialIcons}
                name="map"
                size={moderateScale(20)}
                color={colors.primary}
                style={{ [isRtl ? "marginLeft" : "marginRight"]: scale(10) }}
              />
              <Text
                regular
                FONT_13
                style={
                  selectedProvince
                    ? { color: colors.text }
                    : { color: colors.placeholder }
                }
              >
                {selectedProvinceLabel || t("onboarding.selectProvince")}
              </Text>
            </View>
            <AnyIcon
              type={Icons.Feather}
              name="chevron-down"
              size={moderateScale(18)}
              color={colors.placeholder}
            />
          </TouchableOpacity>
          {errors.state && (
            <Text
              FONT_12
              style={[
                {
                  color: colors.error,
                  marginTop: -8,
                  marginBottom: 8,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {errors.state.message}
            </Text>
          )}

          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.city")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (!selectedProvince) {
                // Maybe show toast or hint
              } else {
                setCityModalVisible(true);
              }
            }}
            activeOpacity={0.7}
            style={[
              styles.pickerButton,
              {
                flexDirection: isRtl ? "row-reverse" : "row",
                opacity: !selectedProvince ? 0.6 : 1,
                marginBottom: 0,
              },
            ]}
          >
            <View
              style={[
                styles.pickerValueContainer,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <AnyIcon
                type={Icons.MaterialIcons}
                name="location-city"
                size={moderateScale(20)}
                color={colors.primary}
                style={{ [isRtl ? "marginLeft" : "marginRight"]: scale(10) }}
              />
              <Text
                regular
                FONT_13
                style={
                  selectedCity
                    ? { color: colors.text }
                    : { color: colors.placeholder }
                }
              >
                {selectedCityName || t("onboarding.selectCity")}
              </Text>
            </View>
            <AnyIcon
              type={Icons.Feather}
              name="chevron-down"
              size={moderateScale(18)}
              color={colors.placeholder}
            />
          </TouchableOpacity>
          {errors.city && (
            <Text
              FONT_12
              style={[
                {
                  color: colors.error,
                  marginTop: 4,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {errors.city.message}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text
            bold
            FONT_14
            style={[
              styles.sectionTitle,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {t("onboarding.medicalInfo")}
          </Text>
          <Text
            semiBold
            FONT_12
            style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
          >
            {t("onboarding.selectBloodGroup")}
          </Text>
          <View
            style={[
              styles.bloodGroupGrid,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            {bloodGroups.map((group) => (
              <TouchableOpacity
                key={group}
                onPress={() =>
                  setValue("blood_group", group, { shouldValidate: true })
                }
                style={[
                  styles.bloodGroupButton,
                  watch("blood_group") === group &&
                    styles.bloodGroupButtonActive,
                ]}
              >
                <Text
                  bold
                  FONT_13
                  style={[
                    watch("blood_group") === group
                      ? { color: colors.white }
                      : { color: colors.primary },
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.blood_group && (
            <Text
              FONT_12
              style={[
                {
                  color: colors.error,
                  marginTop: 4,
                  textAlign: isRtl ? "right" : "left",
                },
              ]}
            >
              {errors.blood_group.message}
            </Text>
          )}
        </View>

        <AppButton
          title={isEditing ? (t("profile.saveChanges") || "Save Changes") : t("onboarding.completeButton")}
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
          setValue("profile_image", "", { shouldValidate: true });
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

      <SelectionModal
        isVisible={isProvinceModalVisible}
        onClose={() => setProvinceModalVisible(false)}
        title={t("onboarding.selectProvince")}
        options={provinces}
        selectedValue={selectedProvince}
        onSelect={(value) => {
          setValue("state", value, { shouldValidate: true });
          setValue("city", "", { shouldValidate: true }); // Clear city when province changes
        }}
      />

      <SelectionModal
        isVisible={isCityModalVisible}
        onClose={() => setCityModalVisible(false)}
        title={`${t("onboarding.selectCityIn")} ${selectedProvinceLabel}`}
        options={availableCities}
        selectedValue={selectedCity}
        onSelect={(value) => {
          setValue("city", value, { shouldValidate: true });
        }}
      />
    </ScreenWrapper>
  );
};

export default CompleteProfileScreen;
