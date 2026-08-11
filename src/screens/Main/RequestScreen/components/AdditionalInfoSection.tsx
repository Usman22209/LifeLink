import React from "react";
import { View } from "react-native";
import { Control, FieldErrors } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AppInput from "@components/AppInput";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { BloodRequestFormValues } from "@shared/forms/schemas/blood-request.schema";
import { styles } from "../RequestScreen.styles";

interface AdditionalInfoSectionProps {
  control: Control<BloodRequestFormValues>;
  errors: FieldErrors<BloodRequestFormValues>;
  t: (key: string) => string;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
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
            name="file-text"
            size={moderateScale(13)}
            color={colors.primary}
          />
        </View>
        <AppText bold FONT_14 style={styles.sectionTitle}>
          Additional Info
        </AppText>
      </View>

      <AppInput
        label={t("requestForm.description") || "Case Summary"}
        placeholder={
          t("requestForm.descriptionPlaceholder") ||
          "Provide medical details, surgery schedule, etc. (optional)"
        }
        name="description"
        control={control}
        error={errors.description?.message}
        multiline
        numberOfLines={4}
        containerStyle={styles.descriptionContainer}
        inputStyle={styles.descriptionInput}
        iconType={Icons.Feather}
        iconName="edit"
        marginBottom={0}
      />
    </View>
  );
};

export default AdditionalInfoSection;
