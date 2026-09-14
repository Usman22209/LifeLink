import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { useContactSupport } from "@shared/query/support/useSupport";
import staticFaqs from "@shared/data/faqs.json";
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

  const { mutate: submitContact, isPending: isSubmitting } = useContactSupport();

  const handleContactEmail = () => {
    submitContact({
      subject: "LifeLink Support Request",
      message: "User initiated contact support request from HelpSupportScreen",
    });
    Linking.openURL(
      "mailto:usman.shafiq.dev@gmail.com?subject=LifeLink Support Request",
    );
  };

  const faqs = staticFaqs;

  return (
    <ScreenWrapper
      backgroundColor={colors.white}
      safeArea
      style={styles.wrapper}
    >
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
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(6),
              backgroundColor: "rgba(229, 57, 53, 0.08)",
              paddingHorizontal: scale(12),
              paddingVertical: verticalScale(6),
              borderRadius: moderateScale(8),
              marginBottom: verticalScale(14),
            }}
            onPress={handleContactEmail}
            activeOpacity={0.7}
          >
            <AnyIcon
              type={Icons.Feather}
              name="mail"
              size={moderateScale(13)}
              color={colors.primary}
            />
            <AppText bold FONT_12 style={{ color: colors.primary }}>
              usman.shafiq.dev@gmail.com
            </AppText>
          </TouchableOpacity>
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
