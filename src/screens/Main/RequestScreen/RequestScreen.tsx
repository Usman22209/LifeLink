import React, { useState, useMemo, useCallback } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "react-native-size-matters";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppButton from "@components/AppButton";
import SelectionModal from "@components/SelectionModal";
import AnyIcon, { Icons } from "@components/AnyIcon";

import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { selectLanguage } from "@store/slices/appSlice";
import { selectUser } from "@store/slices/authSlice";
import { useGetProfile } from "@shared/query/profile/useProfile";
import { useBloodRequestForm } from "@shared/forms/hooks/useBloodRequestForm";
import { useCreateBloodRequest } from "@shared/query/blood-requests/useBloodRequests";
import { Coords } from "@shared/utils/locationService";
import CitiesData from "@shared/data/cities.json";

import { styles } from "./RequestScreen.styles";
import LocationPickerModal, {
  PlaceInfo,
} from "./components/LocationPickerModal";
import PatientDetailsSection from "./components/PatientDetailsSection";
import MedicalNeedsSection from "./components/MedicalNeedsSection";
import LocationDetailsSection from "./components/LocationDetailsSection";
import AdditionalInfoSection from "./components/AdditionalInfoSection";

const RequestScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const selectedLang = useSelector(selectLanguage);
  const isRtl = useSelector((state: any) => state.app?.isRtl ?? false);
  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const user = profile || reduxUser;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useBloodRequestForm();

  const createRequestMutation = useCreateBloodRequest();

  const [isProvinceModalVisible, setProvinceModalVisible] = useState(false);
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<Coords | null>(null);

  const selectedBloodGroup = watch("blood_group");
  const selectedUnits = watch("units_required");
  const selectedUrgency = watch("urgency");
  const selectedProvince = watch("state");
  const selectedCityId = watch("city_id");

  // Prefill user data (name, contact number, blood group, state, city)
  React.useEffect(() => {
    if (user) {
      if (user.full_name && !watch("patient_name")) {
        setValue("patient_name", user.full_name, { shouldValidate: true });
      }
      if (user.phone && !watch("contact_number")) {
        setValue("contact_number", user.phone, { shouldValidate: true });
      }
      if (user.blood_group && !watch("blood_group")) {
        setValue("blood_group", user.blood_group, { shouldValidate: true });
      }
      if (user.state && !watch("state")) {
        setValue("state", user.state, { shouldValidate: true });
      }
      if (user.city_id && !watch("city_id")) {
        setValue("city_id", user.city_id, { shouldValidate: true });
      }
    }
  }, [user, setValue, watch]);

  const handleMapConfirm = useCallback(
    (coords: Coords, placeInfo?: PlaceInfo) => {
      setPinnedLocation(coords);
      setValue("latitude", coords.latitude, { shouldValidate: true });
      setValue("longitude", coords.longitude, { shouldValidate: true });

      if (placeInfo) {
        if (placeInfo.name) {
          setValue("hospital_name", placeInfo.name, { shouldValidate: true });
        }
        if (placeInfo.address) {
          setValue("hospital_address", placeInfo.address, {
            shouldValidate: true,
          });
        }
      }

      setMapVisible(false);
      Toast.show({
        type: "success",
        text2:
          t("requestForm.locationSelected") || "Location pinned successfully",
      });
    },
    [setValue, t],
  );

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

  const selectedProvinceLabel = useMemo(() => {
    if (!selectedProvince) return "";
    return t(`onboarding.provinces.${selectedProvince}`) !==
      `onboarding.provinces.${selectedProvince}`
      ? t(`onboarding.provinces.${selectedProvince}`)
      : selectedProvince;
  }, [selectedProvince, t]);

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
    if (!selectedCityId) return "";
    const city = CitiesData.cities.find((c) => c.id === selectedCityId);
    if (!city) return "";
    return city.name[selectedLang] || city.name.en;
  }, [selectedCityId, selectedLang]);

  const onSubmit = async (data: any) => {
    try {
      const { state, required_date, ...restData } = data;

      const formattedRequiredDate =
        required_date && !isNaN(Date.parse(required_date))
          ? new Date(required_date).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const payload: any = {
        ...restData,
        units_required: Number(data.units_required),
        required_date: formattedRequiredDate,
        ...(pinnedLocation && {
          latitude: pinnedLocation.latitude,
          longitude: pinnedLocation.longitude,
        }),
      };

      // Clean up empty optional fields
      if (!payload.city_id) delete payload.city_id;
      if (!payload.hospital_address) delete payload.hospital_address;
      if (!payload.patient_name) delete payload.patient_name;
      if (!payload.contact_number) delete payload.contact_number;
      if (!payload.description) delete payload.description;

      await createRequestMutation.mutateAsync(payload);

      Toast.show({
        type: "success",
        text1: t("common.success") || "Success",
        text2:
          t("requestForm.successMessage") || "Request created successfully!",
      });

      reset();
      navigation.navigate(ROUTES.FEED);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("common.error") || "Error",
        text2: error?.response?.data?.message || "Failed to submit request",
      });
    }
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.white}
      safeArea
      disableBottomSafeArea={true}
      style={styles.wrapper}
    >
      <AppHeader
        showBackButton
        title={t("requestForm.title") || "Create Request"}
        backgroundColor={colors.white}
        hasBorder={true}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerIntroContainer}>
          <AnyIcon
            type={Icons.Feather}
            name="info"
            size={moderateScale(15)}
            color={colors.primary}
          />
          <AppText regular FONT_12 style={styles.headerSubtitle}>
            {t("requestForm.subtitle") ||
              "Submit a request to find compatible blood donors nearby"}
          </AppText>
        </View>

        <PatientDetailsSection control={control} errors={errors} t={t} />

        <MedicalNeedsSection
          control={control}
          errors={errors}
          selectedBloodGroup={selectedBloodGroup}
          selectedUnits={selectedUnits}
          selectedUrgency={selectedUrgency}
          setValue={setValue}
          t={t}
        />

        <LocationDetailsSection
          control={control}
          errors={errors}
          selectedProvinceLabel={selectedProvinceLabel}
          selectedCityName={selectedCityName}
          selectedProvince={selectedProvince}
          selectedCityId={selectedCityId}
          pinnedLocation={pinnedLocation}
          setProvinceModalVisible={setProvinceModalVisible}
          setCityModalVisible={setCityModalVisible}
          setMapVisible={setMapVisible}
          isRtl={isRtl}
          t={t}
        />

        <AdditionalInfoSection control={control} errors={errors} t={t} />

        <AppButton
          title={
            createRequestMutation.isPending
              ? t("requestForm.submitting") || "Submitting Request..."
              : t("requestForm.submit") || "Submit Blood Request"
          }
          onPress={handleSubmit(onSubmit)}
          disabled={createRequestMutation.isPending}
          loading={createRequestMutation.isPending}
        />
      </KeyboardAwareScrollView>

      <SelectionModal
        isVisible={isProvinceModalVisible}
        onClose={() => setProvinceModalVisible(false)}
        title={t("onboarding.selectProvince") || "Select Province"}
        options={provinces}
        selectedValue={selectedProvince || ""}
        onSelect={(val) => {
          setValue("state", val, { shouldValidate: true });
          setValue("city_id", "", { shouldValidate: true });
          setProvinceModalVisible(false);
        }}
      />

      <SelectionModal
        isVisible={isCityModalVisible}
        onClose={() => setCityModalVisible(false)}
        title={t("onboarding.selectCity") || "Select City"}
        options={availableCities}
        selectedValue={selectedCityId || ""}
        onSelect={(val) => {
          setValue("city_id", val, { shouldValidate: true });
          setCityModalVisible(false);
        }}
      />

      <LocationPickerModal
        visible={isMapVisible}
        onClose={() => setMapVisible(false)}
        onConfirm={handleMapConfirm}
        initialCoords={pinnedLocation}
      />
    </ScreenWrapper>
  );
};

export default RequestScreen;
