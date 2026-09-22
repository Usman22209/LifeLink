import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

interface EligibilityChecklistModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

interface ChecklistItem {
  id: string;
  titleKey: string;
  descKey: string;
  defaultTitle: string;
  defaultDesc: string;
  icon: string;
  iconType: any;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "weight_health",
    titleKey: "eligibilityModal.weightTitle",
    descKey: "eligibilityModal.weightDesc",
    defaultTitle: "Weight & Current Health",
    defaultDesc:
      "I weigh at least 50 kg and feel healthy today with no active fever, flu, or infection.",
    icon: "activity",
    iconType: Icons.Feather,
  },
  {
    id: "cooldown",
    titleKey: "eligibilityModal.cooldownTitle",
    descKey: "eligibilityModal.cooldownDesc",
    defaultTitle: "90-Day Donation Interval",
    defaultDesc:
      "I have not donated whole blood in the last 90 days to ensure safe red cell recovery.",
    icon: "calendar",
    iconType: Icons.Feather,
  },
  {
    id: "medical_safety",
    titleKey: "eligibilityModal.medicalTitle",
    descKey: "eligibilityModal.medicalDesc",
    defaultTitle: "Medical Safety & Screening",
    defaultDesc:
      "No major surgery, hepatitis, chronic illness, or new tattoos/piercings in the last 6 months.",
    icon: "shield",
    iconType: Icons.Feather,
  },
];

const EligibilityChecklistModal: React.FC<EligibilityChecklistModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isVisible) {
      setCheckedItems({});
    }
  }, [isVisible]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = CHECKLIST_ITEMS.filter(
    (item) => checkedItems[item.id],
  ).length;
  const totalCount = CHECKLIST_ITEMS.length;
  const allChecked = checkedCount === totalCount;

  const handleConfirm = () => {
    if (allChecked && !isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          {/* Top Handle Bar */}
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Clean Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconWrap}>
                <AnyIcon
                  type={Icons.Feather}
                  name="shield"
                  size={moderateScale(18)}
                  color={colors.primary}
                />
              </View>
              <View style={styles.headerTextWrap}>
                <Text bold FONT_15 style={{ color: colors.text }}>
                  {t("eligibilityModal.title") || "Donor Health & Safety Check"}
                </Text>
                <Text
                  regular
                  FONT_11
                  style={{
                    color: colors.textSecondary,
                    marginTop: verticalScale(1),
                  }}
                >
                  {t("eligibilityModal.subtitle") ||
                    "Confirm all 3 requirements to safely respond"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="close"
                size={moderateScale(18)}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Simple Clean Counter Pill */}
          <View style={styles.counterRow}>
            <Text
              bold
              FONT_11
              style={{
                color: allChecked ? colors.success : colors.textSecondary,
              }}
            >
              {allChecked
                ? "✓ All 3 requirements confirmed"
                : `Please confirm all requirements (${checkedCount} of ${totalCount})`}
            </Text>
          </View>

          {/* Checklist Items */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.checkCard,
                    isChecked && styles.checkCardActive,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => toggleCheck(item.id)}
                >
                  <View
                    style={[
                      styles.itemIconBadge,
                      isChecked && styles.itemIconBadgeActive,
                    ]}
                  >
                    <AnyIcon
                      type={item.iconType}
                      name={item.icon}
                      size={moderateScale(16)}
                      color={isChecked ? colors.primary : colors.gray600}
                    />
                  </View>

                  <View style={styles.checkTextContent}>
                    <Text bold FONT_13 style={{ color: colors.text }}>
                      {t(item.titleKey) || item.defaultTitle}
                    </Text>
                    <Text regular FONT_11 style={styles.checkDesc}>
                      {t(item.descKey) || item.defaultDesc}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxActive,
                    ]}
                  >
                    {isChecked && (
                      <AnyIcon
                        type={Icons.Feather}
                        name="check"
                        size={moderateScale(12)}
                        color={colors.white}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Simple Clean Note */}
            <View style={styles.safetyNoteRow}>
              <AnyIcon
                type={Icons.Feather}
                name="info"
                size={moderateScale(13)}
                color={colors.textSecondary}
              />
              <Text regular FONT_10 style={styles.safetyNoteText}>
                {t("eligibilityModal.verifiedNotice") ||
                  "Requirements are verified with medical staff prior to blood donation."}
              </Text>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                allChecked
                  ? styles.confirmButtonActive
                  : styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!allChecked || isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <View style={styles.btnInner}>
                  <ActivityIndicator color={colors.white} size="small" />
                  <Text bold FONT_13 style={styles.btnTextActive}>
                    {t("eligibilityModal.pledging") || "Pledging Donation..."}
                  </Text>
                </View>
              ) : allChecked ? (
                <View style={styles.btnInner}>
                  <AnyIcon
                    type={Icons.Feather}
                    name="check-circle"
                    size={moderateScale(16)}
                    color={colors.white}
                  />
                  <Text bold FONT_13 style={styles.btnTextActive}>
                    {t("eligibilityModal.confirmAndRespond") ||
                      "Confirm & Respond to Emergency"}
                  </Text>
                </View>
              ) : (
                <Text bold FONT_12 style={styles.btnTextDisabled}>
                  {t("eligibilityModal.confirmAllToProceed", {
                    count: checkedCount,
                  }) || `Confirm All 3 Items to Proceed (${checkedCount}/3)`}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text bold FONT_12 style={{ color: colors.textSecondary }}>
                {t("common.cancel") || "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdropDismiss: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.gray300,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(16),
    maxHeight: "88%",
  },
  handleBarContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(4),
  },
  handleBar: {
    width: scale(36),
    height: verticalScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: colors.gray300,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(4),
    marginBottom: verticalScale(10),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: withOpacity(colors.primary, 0.08),
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.2),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  headerTextWrap: {
    flex: 1,
  },
  closeBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(8),
  },
  counterRow: {
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  body: {
    maxHeight: verticalScale(310),
  },
  bodyContent: {
    paddingBottom: verticalScale(4),
  },
  checkCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    marginBottom: verticalScale(8),
  },
  checkCardActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(229, 57, 53, 0.04)",
  },
  itemIconBadge: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(10),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  itemIconBadgeActive: {
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderColor: withOpacity(colors.primary, 0.25),
  },
  checkTextContent: {
    flex: 1,
    marginRight: scale(10),
  },
  checkDesc: {
    color: colors.textSecondary,
    marginTop: verticalScale(2),
    lineHeight: verticalScale(15),
  },
  checkbox: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(6),
    borderWidth: 1.5,
    borderColor: colors.gray300,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  safetyNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(6),
    paddingHorizontal: scale(4),
  },
  safetyNoteText: {
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    alignItems: "center",
  },
  confirmButton: {
    width: "100%",
    height: verticalScale(46),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonActive: {
    backgroundColor: colors.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
  },
  btnTextActive: {
    color: colors.white,
    letterSpacing: 0.2,
  },
  btnTextDisabled: {
    color: colors.textSecondary,
  },
  cancelButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(2),
  },
});

export default EligibilityChecklistModal;
