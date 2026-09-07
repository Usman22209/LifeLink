import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { useSubmitReport } from "@shared/query/support/useSupport";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetType: "request" | "user";
  targetId: string;
  targetTitle?: string;
}

interface CategoryOption {
  key: string;
  label: string;
  desc: string;
  icon: string;
}

const REQUEST_CATEGORIES: CategoryOption[] = [
  {
    key: "fake_request",
    label: "Fake or Invalid Request",
    desc: "Hospital or patient details appear fabricated",
    icon: "alert-triangle",
  },
  {
    key: "fraud",
    label: "Demanding Money / Commercial Selling",
    desc: "Money or fees demanded for blood donation",
    icon: "dollar-sign",
  },
  {
    key: "spam",
    label: "Duplicate or Spam Request",
    desc: "Repeated, outdated, or irrelevant posting",
    icon: "copy",
  },
  {
    key: "other",
    label: "Other Safety Concern",
    desc: "Any other issue violating community guidelines",
    icon: "shield",
  },
];

const USER_CATEGORIES: CategoryOption[] = [
  {
    key: "harassment",
    label: "Harassment or Inappropriate Behavior",
    desc: "Abusive messages, offensive conduct, or threats",
    icon: "user-x",
  },
  {
    key: "fraud",
    label: "Fraudulent User or Impersonation",
    desc: "Scam attempts or false donor/patient identity",
    icon: "alert-octagon",
  },
  {
    key: "spam",
    label: "Spam or Promotional Activity",
    desc: "Sending unsolicited advertisements or repetitive messages",
    icon: "mail",
  },
  {
    key: "other",
    label: "Other Concern",
    desc: "Other behavior violating community safety",
    icon: "flag",
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  targetType,
  targetId,
  targetTitle,
}) => {
  const categories =
    targetType === "request" ? REQUEST_CATEGORIES : USER_CATEGORIES;

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].key,
  );
  const [description, setDescription] = useState("");

  const resetAndClose = () => {
    setDescription("");
    setSelectedCategory(categories[0].key);
    onClose();
  };

  const { mutate: submitReport, isPending } = useSubmitReport(() => {
    resetAndClose();
  });

  const handleSubmit = () => {
    if (!targetId) return;

    const matchedCategory = categories.find((c) => c.key === selectedCategory);
    submitReport({
      target_type: targetType,
      target_id: targetId,
      reason: matchedCategory?.label || selectedCategory,
      description: description.trim() || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.backdropPressable} onPress={onClose}>
          <Pressable style={styles.sheetContainer} onPress={() => {}}>
            {/* Top Interactive Handle Bar */}
            <TouchableOpacity
              style={styles.handleContainer}
              activeOpacity={0.6}
              onPress={onClose}
              hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
            >
              <View style={styles.handleBar} />
            </TouchableOpacity>

            <ScrollView
              style={{ width: "100%", maxHeight: verticalScale(480) }}
              showsVerticalScrollIndicator={false}
            >
              {/* Shield Header */}
              <View style={styles.headerRow}>
                <View style={styles.iconCircle}>
                  <AnyIcon
                    type={Icons.Feather}
                    name="shield"
                    size={moderateScale(22)}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.headerText}>
                  <Text bold FONT_16 style={{ color: colors.text }}>
                    {targetType === "request"
                      ? "Report Blood Request"
                      : "Report User"}
                  </Text>
                  <Text
                    regular
                    FONT_11
                    style={{ color: colors.textSecondary, marginTop: 2 }}
                  >
                    {targetTitle
                      ? targetTitle
                      : targetType === "request"
                      ? "Help maintain genuine, verified requests"
                      : "Help keep our community safe and respectful"}
                  </Text>
                </View>
              </View>

              {/* Category Selector */}
              <Text bold FONT_12 style={styles.sectionLabel}>
                Select the reason for reporting:
              </Text>

              <View style={styles.categoriesList}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      activeOpacity={0.75}
                      onPress={() => setSelectedCategory(cat.key)}
                      style={[
                        styles.categoryCard,
                        isSelected && styles.categoryCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIconCircle,
                          isSelected && styles.categoryIconCircleSelected,
                        ]}
                      >
                        <AnyIcon
                          type={Icons.Feather}
                          name={cat.icon as any}
                          size={moderateScale(15)}
                          color={isSelected ? colors.primary : colors.textSecondary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          semiBold
                          FONT_12
                          style={[
                            styles.categoryLabel,
                            isSelected && styles.categoryLabelSelected,
                          ]}
                        >
                          {cat.label}
                        </Text>
                        <Text regular FONT_10 style={styles.categoryDesc}>
                          {cat.desc}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Additional Details Input */}
              <Text bold FONT_12 style={[styles.sectionLabel, { marginTop: verticalScale(14) }]}>
                Additional details (optional):
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Explain what happened so our moderation team can verify..."
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
                style={styles.textInput}
                maxLength={500}
              />

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <AppButton
                  title="Submit Incident Report"
                  onPress={handleSubmit}
                  loading={isPending}
                  style={styles.submitBtn}
                  textStyle={{ color: colors.white, fontSize: moderateScale(13) }}
                />

                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.75}
                  onPress={onClose}
                  disabled={isPending}
                >
                  <Text semiBold FONT_12 style={{ color: colors.textSecondary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 23, 0.6)",
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    width: "100%",
    backgroundColor: colors.card,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(Platform.OS === "ios" ? 34 : 20),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: verticalScale(6),
    marginBottom: verticalScale(6),
  },
  handleBar: {
    width: scale(38),
    height: verticalScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: colors.gray300,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  iconCircle: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: withOpacity(colors.primary, 0.12),
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  sectionLabel: {
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  categoriesList: {
    gap: verticalScale(8),
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(12),
    borderRadius: moderateScale(14),
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: scale(10),
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.04),
  },
  categoryIconCircle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconCircleSelected: {
    backgroundColor: withOpacity(colors.primary, 0.12),
  },
  categoryLabel: {
    color: colors.text,
  },
  categoryLabelSelected: {
    color: colors.primary,
    fontWeight: "700",
  },
  categoryDesc: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    borderWidth: 1.5,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: moderateScale(9),
    height: moderateScale(9),
    borderRadius: moderateScale(4.5),
    backgroundColor: colors.primary,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(14),
    padding: scale(12),
    fontSize: moderateScale(12),
    color: colors.text,
    minHeight: verticalScale(64),
    textAlignVertical: "top",
  },
  buttonContainer: {
    width: "100%",
    gap: verticalScale(8),
    marginTop: verticalScale(16),
  },
  submitBtn: {
    width: "100%",
    height: verticalScale(46),
    borderRadius: moderateScale(14),
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    width: "100%",
    height: verticalScale(42),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default ReportModal;
