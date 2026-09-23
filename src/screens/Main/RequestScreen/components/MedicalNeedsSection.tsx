import React, { useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { moderateScale, verticalScale } from "react-native-size-matters";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { BloodRequestFormValues } from "@shared/forms/schemas/blood-request.schema";
import { UrgencyLevel } from "@shared/interfaces/models/blood-request.interface";
import { BLOOD_GROUPS } from "@shared/constants/blood";
import { styles } from "../RequestScreen.styles";

interface MedicalNeedsSectionProps {
  control: Control<BloodRequestFormValues>;
  errors: FieldErrors<BloodRequestFormValues>;
  selectedBloodGroup?: string;
  selectedUnits?: number;
  selectedUrgency?: UrgencyLevel;
  selectedRequiredDate?: string;
  setValue: UseFormSetValue<BloodRequestFormValues>;
  t: (key: string) => string;
}

const MedicalNeedsSection: React.FC<MedicalNeedsSectionProps> = ({
  errors,
  selectedBloodGroup,
  selectedUnits,
  selectedRequiredDate,
  setValue,
  t,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const currentDate = useMemo(() => {
    if (selectedRequiredDate && !isNaN(Date.parse(selectedRequiredDate))) {
      return new Date(selectedRequiredDate);
    }
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }, [selectedRequiredDate]);

  const updateDate = (newDate: Date) => {
    const isoStr = newDate.toISOString();
    setValue("required_date", isoStr, { shouldValidate: true });

    // Derive urgency for DB / legacy compatibility
    const diffMs = newDate.getTime() - Date.now();
    const derivedUrgency =
      diffMs <= 24 * 60 * 60 * 1000
        ? UrgencyLevel.CRITICAL
        : diffMs <= 72 * 60 * 60 * 1000
          ? UrgencyLevel.HIGH
          : UrgencyLevel.NORMAL;
    setValue("urgency", derivedUrgency, { shouldValidate: true });
  };

  const handleConfirmDate = (pickedDate: Date) => {
    setDatePickerVisible(false);
    const combined = new Date(currentDate.getTime());
    combined.setFullYear(
      pickedDate.getFullYear(),
      pickedDate.getMonth(),
      pickedDate.getDate(),
    );
    if (combined.getTime() < Date.now()) {
      combined.setTime(Date.now() + 60 * 60 * 1000);
    }
    updateDate(combined);
  };

  const handleConfirmTime = (pickedTime: Date) => {
    setTimePickerVisible(false);
    const combined = new Date(currentDate.getTime());
    combined.setHours(pickedTime.getHours(), pickedTime.getMinutes(), 0, 0);
    if (combined.getTime() < Date.now()) {
      combined.setDate(combined.getDate() + 1);
    }
    updateDate(combined);
  };

  const formattedDateStr = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [currentDate]);

  const formattedTimeStr = useMemo(() => {
    return currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, [currentDate]);

  const countdownText = useMemo(() => {
    const diffMs = currentDate.getTime() - Date.now();
    if (diffMs <= 0) return t("requestDetail.expired") || "Expired";
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 60) return `In ${Math.max(1, minutes)}m`;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `In ${hours}h`;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `In ${days}d`;
  }, [currentDate, t]);

  const isEmergency = useMemo(() => {
    const diffMs = currentDate.getTime() - Date.now();
    return diffMs <= 24 * 60 * 60 * 1000;
  }, [currentDate]);

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
          {t("requestForm.requiredDateTime") || "When is Blood Required?"}
        </AppText>

        <View style={styles.dateTimePickersRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dateTimePickerBtn}
            onPress={() => setDatePickerVisible(true)}
          >
            <View style={styles.dateTimePickerBtnIcon}>
              <AnyIcon
                type={Icons.Feather}
                name="calendar"
                size={moderateScale(15)}
                color={colors.primary}
              />
            </View>
            <View style={styles.dateTimePickerBtnTextWrap}>
              <AppText regular FONT_10 style={styles.dateTimePickerBtnLabel}>
                {t("requestForm.pickDate") || "Date"}
              </AppText>
              <AppText bold FONT_12 style={styles.dateTimePickerBtnVal} numberOfLines={1}>
                {formattedDateStr}
              </AppText>
            </View>
            <AnyIcon
              type={Icons.Feather}
              name="chevron-down"
              size={moderateScale(14)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dateTimePickerBtn}
            onPress={() => setTimePickerVisible(true)}
          >
            <View style={styles.dateTimePickerBtnIcon}>
              <AnyIcon
                type={Icons.Feather}
                name="clock"
                size={moderateScale(15)}
                color={colors.primary}
              />
            </View>
            <View style={styles.dateTimePickerBtnTextWrap}>
              <AppText regular FONT_10 style={styles.dateTimePickerBtnLabel}>
                {t("requestForm.pickTime") || "Time"}
              </AppText>
              <AppText bold FONT_12 style={styles.dateTimePickerBtnVal} numberOfLines={1}>
                {formattedTimeStr}
              </AppText>
            </View>
            <AnyIcon
              type={Icons.Feather}
              name="chevron-down"
              size={moderateScale(14)}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.dateTimeSummaryCard,
            isEmergency && {
              borderColor: withOpacity(colors.danger, 0.25),
              backgroundColor: withOpacity(colors.danger, 0.04),
            },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="clock"
            size={moderateScale(15)}
            color={isEmergency ? colors.danger : colors.primary}
          />
          <View style={styles.dateTimeSummaryTextWrap}>
            <AppText regular FONT_10 style={{ color: colors.textSecondary }}>
              {t("requestForm.neededBy") || "Needed by"}
            </AppText>
            <AppText bold FONT_12 style={{ color: colors.text }}>
              {formattedDateStr} · {formattedTimeStr}
            </AppText>
          </View>
          <View
            style={[
              styles.dateTimeCountdownBadge,
              isEmergency && { backgroundColor: colors.danger },
            ]}
          >
            <AppText bold FONT_10 style={styles.dateTimeCountdownText}>
              {countdownText}
            </AppText>
          </View>
        </View>

        {errors.required_date && (
          <AppText
            FONT_11
            style={{ color: colors.error, marginTop: verticalScale(6) }}
          >
            {errors.required_date.message}
          </AppText>
        )}
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={currentDate}
        minimumDate={new Date()}
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        accentColor={colors.primary}
        buttonTextColorIOS={colors.primary}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        date={currentDate}
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisible(false)}
        accentColor={colors.primary}
        buttonTextColorIOS={colors.primary}
      />
    </View>
  );
};

export default MedicalNeedsSection;
