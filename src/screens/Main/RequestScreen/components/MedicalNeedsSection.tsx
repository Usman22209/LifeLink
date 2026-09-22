import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { BloodRequestFormValues } from "@shared/forms/schemas/blood-request.schema";
import { UrgencyLevel } from "@shared/interfaces/models/blood-request.interface";
import { BLOOD_GROUPS, getUrgencyLevels } from "@shared/constants/blood";
import { styles } from "../RequestScreen.styles";

interface MedicalNeedsSectionProps {
  control: Control<BloodRequestFormValues>;
  errors: FieldErrors<BloodRequestFormValues>;
  selectedBloodGroup?: string;
  selectedUnits?: number;
  selectedUrgency?: UrgencyLevel;
  setValue: UseFormSetValue<BloodRequestFormValues>;
  t: (key: string) => string;
}

const MedicalNeedsSection: React.FC<MedicalNeedsSectionProps> = ({
  errors,
  selectedBloodGroup,
  selectedUnits,
  selectedUrgency,
  setValue,
  t,
}) => {
  const urgencyLevels = getUrgencyLevels(t);
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
            name="droplet"
            size={moderateScale(13)}
            color={colors.primary}
          />
        </View>
        <AppText bold FONT_14 style={styles.sectionTitle}>
          {t("onboarding.medicalInfo") || "Medical Needs"}
        </AppText>
      </View>

      <View style={{ marginBottom: verticalScale(16) }}>
        <AppText semiBold FONT_12 style={styles.inputLabel}>
          {t("requestForm.bloodGroup") || "Blood Group"}
        </AppText>
        <View style={styles.bloodGroupGrid}>
          {BLOOD_GROUPS.map((group) => {
            const isActive = selectedBloodGroup === group;
            return (
              <TouchableOpacity
                key={group}
                activeOpacity={0.8}
                style={[
                  styles.bloodGroupButton,
                  isActive && styles.bloodGroupButtonActive,
                ]}
                onPress={() =>
                  setValue("blood_group", group, { shouldValidate: true })
                }
              >
                <AppText
                  bold
                  FONT_13
                  style={
                    isActive
                      ? styles.bloodGroupTextActive
                      : styles.bloodGroupText
                  }
                >
                  {group}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.blood_group && (
          <AppText
            FONT_11
            style={{ color: colors.error, marginTop: verticalScale(6) }}
          >
            {errors.blood_group.message}
          </AppText>
        )}
      </View>

      <View style={{ marginBottom: verticalScale(16) }}>
        <AppText semiBold FONT_12 style={styles.inputLabel}>
          {t("requestForm.units") || "Units Required"}
        </AppText>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.stepperButton}
            onPress={() => {
              const currentUnits = selectedUnits ?? 1;
              if (currentUnits > 1) {
                setValue("units_required", currentUnits - 1, {
                  shouldValidate: true,
                });
              }
            }}
          >
            <AnyIcon
              type={Icons.Feather}
              name="minus"
              size={moderateScale(16)}
              color={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.stepperValueContainer}>
            <AppText bold FONT_15 style={styles.stepperValueText}>
              {selectedUnits ?? 1}{" "}
              {(selectedUnits ?? 1) === 1
                ? t("home.unit") || "Unit"
                : t("home.units") || "Units"}
            </AppText>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.stepperButton}
            onPress={() => {
              const currentUnits = selectedUnits ?? 1;
              setValue("units_required", currentUnits + 1, {
                shouldValidate: true,
              });
            }}
          >
            <AnyIcon
              type={Icons.Feather}
              name="plus"
              size={moderateScale(16)}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <AppText semiBold FONT_12 style={styles.inputLabel}>
          {t("requestForm.urgency") || "Urgency Level"}
        </AppText>
        <View style={styles.urgencyContainer}>
          {urgencyLevels.map((urg) => {
            const isActive = selectedUrgency === urg.value;
            return (
              <TouchableOpacity
                key={urg.value}
                activeOpacity={0.8}
                style={[
                  styles.urgencyCard,
                  isActive && {
                    borderColor: urg.color,
                    backgroundColor: withOpacity(urg.color, 0.05),
                  },
                ]}
                onPress={() =>
                  setValue("urgency", urg.value, { shouldValidate: true })
                }
              >
                <AnyIcon
                  type={Icons.Feather}
                  name={urg.icon}
                  size={moderateScale(16)}
                  color={isActive ? urg.color : colors.textSecondary}
                />
                <AppText
                  bold={isActive}
                  FONT_11
                  style={[styles.urgencyText, isActive && { color: urg.color }]}
                >
                  {urg.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default MedicalNeedsSection;
