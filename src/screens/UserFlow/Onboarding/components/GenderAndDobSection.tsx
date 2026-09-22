import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../styles/CompleteProfile.styles";

interface GenderAndDobSectionProps {
  watch: any;
  setValue: any;
  errors: any;
  isRtl: boolean;
  isDatePickerVisible: boolean;
  setDatePickerVisibility: (visible: boolean) => void;
  handleConfirmDate: (date: Date) => void;
  maxDate: Date;
}

export const GenderAndDobSection: React.FC<GenderAndDobSectionProps> = ({
  watch,
  setValue,
  errors,
  isRtl,
  isDatePickerVisible,
  setDatePickerVisibility,
  handleConfirmDate,
  maxDate,
}) => {
  const { t } = useTranslation();

  return (
    <>
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
          {["male", "female"].map((g) => {
            const isSelected =
              watch("gender")?.toLowerCase() === g.toLowerCase();
            return (
              <TouchableOpacity
                key={g}
                onPress={() => setValue("gender", g, { shouldValidate: true })}
                style={[
                  styles.genderCard,
                  isSelected && styles.genderCardActive,
                ]}
                activeOpacity={0.8}
              >
                <AnyIcon
                  type={Icons.MaterialCommunityIcons}
                  name={g === "male" ? "gender-male" : "gender-female"}
                  size={moderateScale(20)}
                  color={isSelected ? colors.white : colors.primary}
                />
                <Text
                  semiBold
                  FONT_13
                  style={[
                    styles.genderText,
                    isSelected
                      ? { color: colors.white }
                      : { color: colors.textSecondary },
                  ]}
                >
                  {t(`onboarding.${g}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          date={
            watch("dob") && !isNaN(Date.parse(watch("dob")))
              ? new Date(watch("dob"))
              : maxDate
          }
          maximumDate={maxDate}
          accentColor={colors.primary}
          buttonTextColorIOS={colors.primary}
        />
      </View>
    </>
  );
};
