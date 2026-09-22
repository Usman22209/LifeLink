import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppInput from "@components/AppInput";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { BloodRequestFormValues } from "@shared/forms/schemas/blood-request.schema";
import { Coords } from "@shared/utils/locationService";
import { styles } from "../RequestScreen.styles";

interface LocationDetailsSectionProps {
  control: Control<BloodRequestFormValues>;
  errors: FieldErrors<BloodRequestFormValues>;
  selectedProvinceLabel: string;
  selectedCityName: string;
  selectedProvince?: string;
  selectedCityId?: string;
  pinnedLocation: Coords | null;
  setProvinceModalVisible: (visible: boolean) => void;
  setCityModalVisible: (visible: boolean) => void;
  setMapVisible: (visible: boolean) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const LocationDetailsSection: React.FC<LocationDetailsSectionProps> = ({
  control,
  errors,
  selectedProvinceLabel,
  selectedCityName,
  selectedProvince,
  selectedCityId,
  pinnedLocation,
  setProvinceModalVisible,
  setCityModalVisible,
  setMapVisible,
  isRtl,
  t,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIconWrap,
            { backgroundColor: withOpacity(colors.primary, 0.08) },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="map-pin"
            size={moderateScale(13)}
            color={colors.primary}
          />
        </View>
        <AppText bold FONT_14 style={styles.sectionTitle}>
          {t("onboarding.location") || "Location Details"}
        </AppText>
      </View>

      <View style={{ marginBottom: verticalScale(12) }}>
        <AppText semiBold FONT_12 style={styles.inputLabel}>
          {t("requestForm.state") || "State / Province"}
        </AppText>
        <TouchableOpacity
          onPress={() => setProvinceModalVisible(true)}
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
            <AnyIcon
              type={Icons.MaterialIcons}
              name="map"
              size={moderateScale(18)}
              color={colors.primary}
              style={{ [isRtl ? "marginLeft" : "marginRight"]: scale(10) }}
            />
            <AppText
              regular
              FONT_13
              style={
                selectedProvince
                  ? { color: colors.text }
                  : { color: colors.placeholder }
              }
            >
              {selectedProvinceLabel ||
                t("requestForm.selectState") ||
                "Select Province"}
            </AppText>
          </View>
          <AnyIcon
            type={Icons.Feather}
            name="chevron-down"
            size={moderateScale(16)}
            color={colors.placeholder}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: verticalScale(12) }}>
        <AppText semiBold FONT_12 style={styles.inputLabel}>
          {t("requestForm.city") || "City"}
        </AppText>
        <TouchableOpacity
          onPress={() => {
            if (selectedProvince) {
              setCityModalVisible(true);
            }
          }}
          activeOpacity={0.7}
          style={[
            styles.pickerButton,
            {
              flexDirection: isRtl ? "row-reverse" : "row",
              opacity: !selectedProvince ? 0.6 : 1,
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
              size={moderateScale(18)}
              color={colors.primary}
              style={{ [isRtl ? "marginLeft" : "marginRight"]: scale(10) }}
            />
            <AppText
              regular
              FONT_13
              style={
                selectedCityId
                  ? { color: colors.text }
                  : { color: colors.placeholder }
              }
            >
              {selectedCityName || t("requestForm.selectCity") || "Select City"}
            </AppText>
          </View>
          <AnyIcon
            type={Icons.Feather}
            name="chevron-down"
            size={moderateScale(16)}
            color={colors.placeholder}
          />
        </TouchableOpacity>
      </View>

      <AppInput
        label={t("requestForm.hospitalName") || "Hospital Name"}
        placeholder={
          t("requestForm.hospitalNamePlaceholder") || "e.g. Mayo Hospital"
        }
        name="hospital_name"
        control={control}
        error={errors.hospital_name?.message}
        iconType={Icons.Feather}
        iconName="home"
      />

      <AppInput
        label={t("requestForm.hospitalAddress") || "Hospital Address"}
        placeholder={
          t("requestForm.hospitalAddressPlaceholder") ||
          "Enter hospital detailed address (optional)"
        }
        name="hospital_address"
        control={control}
        error={errors.hospital_address?.message}
        iconType={Icons.Feather}
        iconName="map"
      />

      <AppText semiBold FONT_12 style={styles.inputLabel}>
        {t("requestForm.selectOnMap") || "Pin Location on Map"}
      </AppText>
      <TouchableOpacity
        onPress={() => setMapVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.mapSelectButton,
          { flexDirection: isRtl ? "row-reverse" : "row" },
          pinnedLocation && {
            borderColor: withOpacity(colors.success, 0.3),
            backgroundColor: withOpacity(colors.success, 0.03),
          },
        ]}
      >
        <View
          style={[
            styles.mapSelectValueContainer,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AnyIcon
            type={Icons.MaterialIcons}
            name={pinnedLocation ? "location-on" : "add-location-alt"}
            size={moderateScale(20)}
            color={pinnedLocation ? colors.success : colors.primary}
            style={{ [isRtl ? "marginLeft" : "marginRight"]: scale(10) }}
          />
          <AppText
            regular
            FONT_13
            style={{
              color: pinnedLocation ? colors.success : colors.placeholder,
            }}
          >
            {pinnedLocation
              ? `${pinnedLocation.latitude.toFixed(4)}, ${pinnedLocation.longitude.toFixed(4)}`
              : t("requestForm.selectOnMap") || "Tap to pin on map"}
          </AppText>
        </View>
        <AnyIcon
          type={Icons.Feather}
          name={pinnedLocation ? "check-circle" : "map"}
          size={moderateScale(16)}
          color={pinnedLocation ? colors.success : colors.placeholder}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LocationDetailsSection;
