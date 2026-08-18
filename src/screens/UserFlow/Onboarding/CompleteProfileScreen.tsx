import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  I18nManager,
  PermissionsAndroid,
  ActivityIndicator,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useMediaPicker from "@shared/hooks/useImagePicker";
import ScreenWrapper from "@components/ScreenWrapper";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { useOnboardingForm } from "@shared/forms/hooks/useOnboardingForm";
import useTranslation from "@shared/hooks/useTranslation";
import { OnboardingFormValues } from "@shared/forms/schemas/onboarding.schema";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useUpdateProfile, useGetProfile } from "@shared/query/profile/useProfile";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "@store/slices/authSlice";
import { selectLanguage } from "@store/slices/appSlice";
import { useUploadImage } from "@shared/query/file/useUploadImage";
import { getCurrentLocation, Coords } from "@shared/utils/locationService";

import AppHeader from "@components/AppHeader";
import ImagePickerModal from "@components/ImagePickerModal";
import CountryPickerModal from "@components/CountryPickerModal";
import SelectionModal from "@components/SelectionModal";

import { ProfileAvatarSection } from "./components/ProfileAvatarSection";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { GenderAndDobSection } from "./components/GenderAndDobSection";
import { LocationSelectionSection } from "./components/LocationSelectionSection";
import { MedicalInfoSection } from "./components/MedicalInfoSection";
import { styles } from "./styles/CompleteProfile.styles";
import CitiesData from "@shared/data/cities.json";

type CompleteProfileNavigationProp = StackNavigationProp<
  UserStackParamList,
  typeof ROUTES.ONBOARDING
>;

type CompleteProfileRouteProp = RouteProp<
  UserStackParamList,
  typeof ROUTES.EDIT_PROFILE
> & {
  params?: { isEditing?: boolean };
};

const COUNTRIES = [{ name: "Pakistan", code: "PK", flag: "🇵🇰" }];

const CompleteProfileScreen = () => {
  const navigation = useNavigation<CompleteProfileNavigationProp>();
  const route = useRoute<CompleteProfileRouteProp>();
  const isEditing = (route.params as any)?.isEditing === true;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { data: serverProfile, isLoading: isProfileLoading } = useGetProfile(!!user);
  const { mutateAsync: updateProfileMutate } = useUpdateProfile();
  const selectedLang = useSelector(selectLanguage);
  const { t } = useTranslation();

  const editDefaults = useMemo(() => {
    if (!user) return undefined;
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
  }, [user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
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
      let finalLocation = location;
      if (!finalLocation) {
        try {
          finalLocation = await getCurrentLocation(true);
        } catch {
          finalLocation = null;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, confirmed_data, city, ...sanitizedData } = data;

      await updateProfileMutate({
        ...sanitizedData,
        city_id: data.city,
        state: data.state,
        language_preference: selectedLang,
        is_onboarded: true,
        latitude: finalLocation?.latitude,
        longitude: finalLocation?.longitude,
      } as any);

      if (isEditing) {
        navigation.goBack();
      } else {
        dispatch(
          updateUser({
            is_onboarded: true,
          }),
        );
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
            setLocalImage(null);
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
    if (serverProfile) {
      const isComplete =
        serverProfile.is_onboarded ||
        Boolean(serverProfile.phone && serverProfile.blood_group);

      if (isComplete) {
        dispatch(updateUser({ ...serverProfile, is_onboarded: true }));
        if (!isEditing) return;
      }

      reset({
        full_name: serverProfile.full_name || "",
        email: serverProfile.email || user?.email || "",
        phone: serverProfile.phone || "",
        gender: (serverProfile.gender || "male") as OnboardingFormValues["gender"],
        dob: serverProfile.dob || "",
        city: serverProfile.city_id || "",
        state: serverProfile.state || "",
        country: serverProfile.country || "Pakistan",
        blood_group: serverProfile.blood_group || "",
        profile_image: serverProfile.profile_image || "",
        confirmed_data: true,
      });
    } else if (user?.email) {
      setValue("email", user.email);
    }
  }, [serverProfile, user?.email, isEditing, dispatch, reset, setValue]);

  useEffect(() => {
    if (isEditing) {
      if (user?.latitude && user?.longitude) {
        setLocation({ latitude: user.latitude, longitude: user.longitude });
      }
      return;
    }
    const fetchLocation = async () => {
      try {
        const coords = await getCurrentLocation(false);
        if (coords) {
          setLocation(coords);
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

  if (isProfileLoading && !isEditing) {
    return (
      <ScreenWrapper backgroundColor={colors.background} safeArea>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      header={
        <AppHeader
          title={
            isEditing
              ? t("profile.editProfile") || "Edit Profile"
              : t("onboarding.title")
          }
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
        {/* Profile Avatar Section */}
        <ProfileAvatarSection
          profileImage={profileImage}
          localImage={localImage}
          isUploading={isUploading}
          onOpenModal={() => setImageModalVisible(true)}
        />

        {/* Basic Info Inputs */}
        <BasicInfoSection
          control={control}
          errors={errors}
          userEmail={user?.email}
          isRtl={isRtl}
        />

        {/* Gender & DOB Selection */}
        <GenderAndDobSection
          watch={watch}
          setValue={setValue}
          errors={errors}
          isRtl={isRtl}
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisibility={setDatePickerVisibility}
          handleConfirmDate={handleConfirmDate}
          maxDate={maxDate}
        />

        {/* Location Dropdowns */}
        <LocationSelectionSection
          isRtl={isRtl}
          currentFlag={currentFlag}
          selectedCountry={selectedCountry}
          selectedProvince={selectedProvince}
          selectedProvinceLabel={selectedProvinceLabel}
          selectedCity={selectedCity}
          selectedCityName={selectedCityName}
          onOpenProvince={() => setProvinceModalVisible(true)}
          onOpenCity={() => setCityModalVisible(true)}
          errors={errors}
        />

        {/* Medical / Blood Group Grid */}
        <MedicalInfoSection
          isRtl={isRtl}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

        {/* Submit Button */}
        <AppButton
          title={
            isEditing
              ? t("profile.saveChanges") || "Save Changes"
              : t("onboarding.completeButton")
          }
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={styles.submitButton}
        />
      </KeyboardAwareScrollView>

      {/* Image Picker Modal */}
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

      {/* Country Picker Modal */}
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

      {/* Province Selection Modal */}
      <SelectionModal
        isVisible={isProvinceModalVisible}
        onClose={() => setProvinceModalVisible(false)}
        title={t("onboarding.selectProvince")}
        options={provinces}
        selectedValue={selectedProvince}
        onSelect={(value) => {
          setValue("state", value, { shouldValidate: true });
          setValue("city", "", { shouldValidate: true });
        }}
      />

      {/* City Selection Modal */}
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
