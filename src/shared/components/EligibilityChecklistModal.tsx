import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";

interface EligibilityChecklistModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const CHECKLIST_ITEMS = [
  {
    id: "weight_health",
    title: "Weight & Current Health",
    desc: "I weigh at least 50 kg and am feeling healthy today with no active fever or flu.",
  },
  {
    id: "cooldown",
    title: "90-Day Donation Interval",
    desc: "I have not donated whole blood in the last 90 days.",
  },
  {
    id: "medical_history",
    title: "Medical Safety",
    desc: "No major surgery, hepatitis, or new tattoos/piercings in the last 6 months.",
  },
];

const EligibilityChecklistModal: React.FC<EligibilityChecklistModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = CHECKLIST_ITEMS.every((item) => checkedItems[item.id]);

  const handleConfirm = () => {
    if (allChecked) {
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
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <AnyIcon
                type={Icons.Feather}
                name="shield"
                size={moderateScale(20)}
                color={colors.primary}
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text bold FONT_16 style={{ color: colors.text }}>
                Donor Health Checklist
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                Confirm these quick requirements before accepting
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AnyIcon
                type={Icons.Ionicons}
                name="close-circle"
                size={moderateScale(22)}
                color={colors.gray300}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.checkRow,
                    isChecked && styles.checkRowActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleCheck(item.id)}
                >
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
                  <View style={styles.checkTextContent}>
                    <Text bold FONT_13 style={{ color: colors.text }}>
                      {item.title}
                    </Text>
                    <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                      {item.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              title="Confirm & Respond to Emergency"
              onPress={handleConfirm}
              disabled={!allChecked}
              loading={isLoading}
              style={
                !allChecked
                  ? ([styles.confirmBtn, { backgroundColor: colors.gray300 }] as any)
                  : styles.confirmBtn
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  iconWrap: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  headerTextWrap: {
    flex: 1,
  },
  body: {
    marginBottom: verticalScale(16),
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: verticalScale(10),
  },
  checkRowActive: {
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.04),
  },
  checkbox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: colors.gray600,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
    marginTop: verticalScale(2),
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkTextContent: {
    flex: 1,
  },
  footer: {
    paddingTop: verticalScale(8),
  },
  confirmBtn: {
    borderRadius: moderateScale(12),
  },
});

export default EligibilityChecklistModal;
