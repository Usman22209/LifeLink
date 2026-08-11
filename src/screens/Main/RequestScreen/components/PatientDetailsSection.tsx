import React from "react";
import { View } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppInput from "@components/AppInput";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { BloodRequestFormValues } from "@shared/forms/schemas/blood-request.schema";
import { Controller } from "react-hook-form";
import { formatPhoneNumber } from "@shared/utils/phoneUtils";
import { styles } from "../RequestScreen.styles";

interface PatientDetailsSectionProps {
  control: Control<BloodRequestFormValues>;
  errors: FieldErrors<BloodRequestFormValues>;
  t: (key: string) => string;
}

const PatientDetailsSection: React.FC<PatientDetailsSectionProps> = ({
  control,
  errors,
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
            name="user"
            size={moderateScale(13)}
            color={colors.primary}
          />
        </View>
        <AppText bold FONT_14 style={styles.sectionTitle}>
          {t("onboarding.basicInfo") || "Patient Details"}
        </AppText>
      </View>

      <AppInput
        label={t("requestForm.patientName") || "Patient Name"}
        placeholder={
          t("requestForm.patientNamePlaceholder") ||
          "Enter patient name (optional)"
        }
        name="patient_name"
        control={control}
        error={errors.patient_name?.message}
        iconType={Icons.Feather}
        iconName="user"
      />

      <Controller
        control={control}
        name="contact_number"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label={t("requestForm.contactNumber") || "Contact Number"}
            placeholder="0303 1234567"
            value={value}
            onChangeText={(text) => onChange(formatPhoneNumber(text))}
            keyboardType="phone-pad"
            error={errors.contact_number?.message}
            iconType={Icons.Feather}
            iconName="phone"
          />
        )}
      />
    </View>
  );
};

export default PatientDetailsSection;
