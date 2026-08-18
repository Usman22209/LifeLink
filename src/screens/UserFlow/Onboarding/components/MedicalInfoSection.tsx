import React from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "@components/AppText";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { BLOOD_GROUPS } from "@shared/constants/blood";
import { styles } from "../styles/CompleteProfile.styles";

interface MedicalInfoSectionProps {
  isRtl: boolean;
  watch: any;
  setValue: any;
  errors: any;
}

export const MedicalInfoSection: React.FC<MedicalInfoSectionProps> = ({
  isRtl,
  watch,
  setValue,
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
        {t("onboarding.medicalInfo")}
      </Text>
      <Text
        semiBold
        FONT_12
        style={[styles.inputLabel, { textAlign: isRtl ? "right" : "left" }]}
      >
        {t("onboarding.selectBloodGroup")}
      </Text>
      <View
        style={[
          styles.bloodGroupGrid,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        {BLOOD_GROUPS.map((group) => (
          <TouchableOpacity
            key={group}
            onPress={() =>
              setValue("blood_group", group, { shouldValidate: true })
            }
            style={[
              styles.bloodGroupButton,
              watch("blood_group") === group &&
                styles.bloodGroupButtonActive,
            ]}
          >
            <Text
              bold
              FONT_13
              style={[
                watch("blood_group") === group
                  ? { color: colors.white }
                  : { color: colors.primary },
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.blood_group && (
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
          {errors.blood_group.message}
        </Text>
      )}
    </View>
  );
};
