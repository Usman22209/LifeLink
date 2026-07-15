import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "./HelpSupportScreen.styles";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setExpanded(!expanded)}
      style={styles.faqCard}
    >
      <View style={styles.faqHeader}>
        <AppText semiBold FONT_13 style={styles.faqQuestion}>
          {question}
        </AppText>
        <AnyIcon
          type={Icons.Feather}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={moderateScale(16)}
          color={colors.textSecondary}
        />
      </View>
      {expanded && (
        <AppText regular FONT_12 style={styles.faqAnswer}>
          {answer}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const HelpSupportScreen = () => {
  const { t } = useTranslation();

  const handleContactEmail = () => {
    Linking.openURL("mailto:support@lifelink.org?subject=LifeLink Support Request");
  };

  const faqs = [
    {
      question: t("helpSupport.faqQuestion1") || "Who can donate blood?",
      answer:
        t("helpSupport.faqAnswer1") ||
        "Anyone aged 18-65, weighing over 50kg, and in good general health with no active infections can donate.",
    },
    {
      question: t("helpSupport.faqQuestion2") || "How often can I donate?",
      answer:
        t("helpSupport.faqAnswer2") ||
        "You can safely donate whole blood once every 90 days (3 months) to allow your body to fully replenish iron levels.",
    },
    {
      question: t("helpSupport.faqQuestion3") || "Is my personal data secure?",
      answer:
        t("helpSupport.faqAnswer3") ||
        "Yes, your contact details are encrypted and only shown to verified requesters when you explicitly choose to respond to a request.",
    },
    {
      question: t("helpSupport.faqQuestion4") || "How do I request blood?",
      answer:
        t("helpSupport.faqAnswer4") ||
        "Navigate to the 'Request' tab, fill in the patient details, select the blood type and hospital, and submit. Matched donors nearby will be notified.",
    },
  ];

  return (
    <ScreenWrapper backgroundColor={colors.white} safeArea style={styles.wrapper}>
      <AppHeader
        title={t("helpSupport.title") || "Help & Support"}
        showBackButton
        hasBorder={true}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactSection}>
          <View style={styles.contactIconContainer}>
            <AnyIcon
              type={Icons.Feather}
              name="help-circle"
              size={moderateScale(32)}
              color={colors.primary}
            />
          </View>
          <AppText bold FONT_15 style={styles.contactTitle}>
            {t("helpSupport.contactUs") || "Contact Support"}
          </AppText>
          <AppText regular FONT_12 style={styles.contactText}>
            {t("helpSupport.contactSubtitle") ||
              "Have questions or feedback about LifeLink? Reach out to our support team."}
          </AppText>
          <AppButton
            title={t("helpSupport.emailSupport") || "Email Support"}
            onPress={handleContactEmail}
            style={styles.contactButton}
          />
        </View>

        <View style={styles.divider} />

        <AppText bold FONT_14 style={styles.faqSectionTitle}>
          {t("helpSupport.faqTitle") || "Frequently Asked Questions"}
        </AppText>

        <View style={styles.faqList}>
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default HelpSupportScreen;
