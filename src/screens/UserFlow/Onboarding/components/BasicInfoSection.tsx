import React from "react";
import { View } from "react-native";
import Text from "@components/AppText";
import AppInput from "@components/AppInput";
import { Icons } from "@components/AnyIcon";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../styles/CompleteProfile.styles";

interface BasicInfoSectionProps {
  control: any;
  errors: any;
  userEmail?: string;
  isRtl: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  errors,
  userEmail,
  isRtl,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text
        bold
        FONT_14
        style={[styles.sectionTitle, { textAlign: isRtl ? "right" : "left" }]}
      >
        {t("onboarding.basicInfo")}
      </Text>
      <AppInput
        name="full_name"
        control={control}
        label={t("onboarding.fullName")}
        placeholder={t("onboarding.fullNamePlaceholder")}
        error={errors.full_name?.message}
        autoCapitalize="words"
        iconType={Icons.MaterialIcons}
        iconName="person-outline"
      />
      <AppInput
        name="phone"
        control={control}
        label={t("onboarding.phone")}
        placeholder={t("onboarding.phonePlaceholder")}
        keyboardType="phone-pad"
        error={errors.phone?.message}
        iconType={Icons.MaterialIcons}
        iconName="phone-iphone"
      />
      <AppInput
        name="email"
        control={control}
        label={t("onboarding.email")}
        placeholder={t("onboarding.emailPlaceholder")}
        keyboardType="email-address"
        error={errors.email?.message}
        iconType={Icons.MaterialIcons}
        iconName="mail-outline"
        marginBottom={0}
        editable={!userEmail}
      />
    </View>
  );
};
