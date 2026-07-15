import React from "react";
import { View, ScrollView } from "react-native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "./PrivacyPolicyScreen.styles";

interface PolicySectionProps {
  title: string;
  body: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, body }) => (
  <View style={styles.section}>
    <AppText bold FONT_13 style={styles.sectionTitle}>
      {title}
    </AppText>
    <AppText regular FONT_12 style={styles.sectionBody}>
      {body}
    </AppText>
  </View>
);

const PrivacyPolicyScreen = () => {
  const { t } = useTranslation();

  return (
    <ScreenWrapper backgroundColor={colors.white} safeArea style={styles.wrapper}>
      <AppHeader
        title={t("privacyPolicy.title") || "Privacy Policy"}
        showBackButton
        hasBorder={true}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppText regular FONT_11 style={styles.lastUpdated}>
          {t("privacyPolicy.lastUpdated") || "Last updated: July 15, 2026"}
        </AppText>

        <PolicySection
          title={t("privacyPolicy.sectionTitle1") || "1. Information We Collect"}
          body={
            t("privacyPolicy.sectionBody1") ||
            "We collect personal information that you choose to provide when registering on LifeLink, including your name, email address, contact phone number, date of birth, biological gender, blood group, and location details."
          }
        />

        <PolicySection
          title={t("privacyPolicy.sectionTitle2") || "2. How We Use Your Information"}
          body={
            t("privacyPolicy.sectionBody2") ||
            "Your blood group and location details are utilized to match you with critical blood requests in your region. Your contact details are stored securely and are only revealed to request coordinators when you explicitly agree to coordinate a donation."
          }
        />

        <PolicySection
          title={t("privacyPolicy.sectionTitle3") || "3. Share & Data Control"}
          body={
            t("privacyPolicy.sectionBody3") ||
            "LifeLink will never sell, lease, or distribute your personal metrics, geolocation tracks, or contact configurations to third-party marketing networks. All stored information is protected using state-of-the-art security layers."
          }
        />

        <PolicySection
          title={t("privacyPolicy.sectionTitle4") || "4. Account Deletion"}
          body={
            t("privacyPolicy.sectionBody4") ||
            "You hold the full right to edit your health metrics or permanently purge your account datasets at any time. Tapping the Delete Account button in settings will immediately remove all your records from our databases."
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PrivacyPolicyScreen;
