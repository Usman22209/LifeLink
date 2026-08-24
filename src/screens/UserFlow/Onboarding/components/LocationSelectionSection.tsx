import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../styles/CompleteProfile.styles";

interface LocationSelectionSectionProps {
  isRtl: boolean;
  currentFlag?: string;
  selectedCountry?: string;
  selectedProvince?: string;
  selectedProvinceLabel?: string;
  selectedCity?: string;
  selectedCityName?: string;
  onOpenProvince: () => void;
  onOpenCity: () => void;
  errors: any;
}

export const LocationSelectionSection: React.FC<LocationSelectionSectionProps> = ({
  isRtl,
  currentFlag,
  selectedCountry,
  selectedProvince,
  selectedProvinceLabel,
  selectedCity,
  selectedCityName,
  onOpenProvince,
  onOpenCity,
  errors,
}) => {
  const { t } = useTranslation();

  return (
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

      {/* Country (Default Pakistan) */}
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

      {/* Province / State Field */}
      <Text
        semiBold
        FONT_12
        style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
      >
        {t("onboarding.state")} {t("onboarding.provinceLabel")}
      </Text>
      <TouchableOpacity
        onPress={onOpenProvince}
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

      {/* City Field */}
      <Text
        semiBold
        FONT_12
        style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
      >
        {t("onboarding.city")}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (selectedProvince) {
            onOpenCity();
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
  );
};
