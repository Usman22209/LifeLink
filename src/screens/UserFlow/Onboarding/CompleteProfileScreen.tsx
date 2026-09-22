import React, { useState, useMemo, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
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
import { useScreenHangWatchdog } from "@shared/utils/sentryLogger";
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
  const isEditing =
    route.name === ROUTES.EDIT_PROFILE ||
    (route.params as any)?.isEditing === true;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { data: serverProfile, isLoading: isProfileLoading } = useGetProfile(true);
  const { mutateAsync: updateProfileMutate } = useUpdateProfile();
  const selectedLang = useSelector(selectLanguage);
  const { t } = useTranslation();

  const resolveProfileDefaults = useCallback(
    (profile: any) => {
      if (!profile) return undefined;

      let cityValue = profile.city_id || profile.city || "";
      let stateValue = profile.state || profile.province || "";

      if (cityValue) {
        const foundCity = CitiesData.cities.find(
          (c) =>
            c.id === cityValue ||
            c.name.en.toLowerCase() === String(cityValue).toLowerCase() ||
            c.name.ur === cityValue,
        );
        if (foundCity) {
          cityValue = foundCity.id;
          if (!stateValue) {
            stateValue = foundCity.province;
          }
        }
      }

      let genderValue: OnboardingFormValues["gender"] = "male";
      if (profile.gender) {
        const normalizedGender = String(profile.gender).toLowerCase();
        if (normalizedGender === "female" || normalizedGender === "male") {
          genderValue = normalizedGender;
        }
      }

      let dobValue = "";
      if (profile.dob) {
        dobValue = typeof profile.dob === "string" ? profile.dob.split("T")[0] : "";
      }

      const bloodGroupValue = (
        profile.blood_group ||
        profile.blood_type ||
        ""
      ).toUpperCase();

      return {
        full_name: profile.full_name || profile.name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || profile.contact_number || "",
        gender: genderValue,
        dob: dobValue,
        city: cityValue,
        state: stateValue,
        country: profile.country || "Pakistan",
        blood_group: bloodGroupValue,
        profile_image: profile.profile_image || profile.avatar_url || "",
        confirmed_data: true,
      };
    },
    [user?.email],
  );

  const editDefaults = useMemo(() => {
    const active = serverProfile || user;
    return resolveProfileDefaults(active);
  }, [user, serverProfile, resolveProfileDefaults]);

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

  useScreenHangWatchdog("CompleteProfileScreen", loading || isUploading, {
    actionName: loading ? "save_profile" : "upload_image",
    timeoutMs: 12000,
    context: { isEditing, userId: user?.id },
  });

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
      .filter(
        (item) =>
          item.province?.toLowerCase() === selectedProvince?.toLowerCase(),
      )
      .map((item) => ({
        label: item.name[selectedLang] || item.name.en,
        value: item.id,
      }));
  }, [selectedProvince, selectedLang]);

  const selectedCityName = useMemo(() => {
    if (!selectedCity) return "";
    const city = CitiesData.cities.find(
      (c) =>
        c.id === selectedCity ||
        c.name.en.toLowerCase() === String(selectedCity).toLowerCase() ||
        c.name.ur === selectedCity,
    );
    if (!city) return selectedCity;
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
          const locationPromise = getCurrentLocation(true);
          const timeoutPromise = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), 3500)
          );
          finalLocation = await Promise.race([locationPromise, timeoutPromise]);
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
        (navigation as any).navigate(ROUTES.DONOR_QUESTIONNAIRE);
      }
    } catch (error: any) {
      console.error("[CompleteProfile] Update error:", error);
      let errorMsg = "Could not update profile. Please try again.";
      if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
        errorMsg = "Connection timed out. Please check your internet connection.";
      } else if (!error?.response || error?.message === "Network Error") {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : String(error.response.data.message);
      }

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMsg,
      });
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
        } catch (error: any) {
          console.error("[CompleteProfile] Upload error:", error);
          setLocalImage(null);
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2:
              error?.response?.data?.message ||
              "Could not upload image. Please check your connection.",
          });
        } finally {
          setImageModalVisible(false);
        }
      }
    };
    handleUpload();
  }, [media, setValue, uploadImage]);

  const isInitializedRef = React.useRef(false);

  useEffect(() => {
    const active = serverProfile || user;
    if (active && !isInitializedRef.current) {
      const defaults = resolveProfileDefaults(active);
      if (defaults && (defaults.full_name || defaults.phone || defaults.blood_group || defaults.email)) {
        isInitializedRef.current = true;
        reset(defaults);
      }
    }
  }, [serverProfile, user, resolveProfileDefaults, reset]);

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
        <ProfileAvatarSection
          profileImage={profileImage}
          localImage={localImage}
          isUploading={isUploading}
          onOpenModal={() => setImageModalVisible(true)}
        />

        <BasicInfoSection
          control={control}
          errors={errors}
          userEmail={user?.email}
          isRtl={isRtl}
        />

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

        <MedicalInfoSection
          isRtl={isRtl}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />

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
          setValue("city", "", { shouldValidate: true });
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
