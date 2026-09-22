import React from "react";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { selectIsRtl } from "@store/slices/appSlice";
import { styles } from "../ProfileScreen.styles";

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  tempLanguage: "en" | "ur";
  setTempLanguage: (lang: "en" | "ur") => void;
  onConfirm: () => void;
  t: (key: string) => string;
}

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
  tempLanguage,
  setTempLanguage,
  onConfirm,
  t,
}) => {
  const insets = useSafeAreaInsets();
  const isRtl = useSelector(selectIsRtl);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.modalContent,
            { paddingBottom: Math.max(insets.bottom + verticalScale(14), verticalScale(20)) },
          ]}
        >
          <View style={styles.modalHandle} />

          <View
            style={[
              styles.modalHeaderRow,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <Text
              bold
              FONT_16
              style={[styles.modalTitle, { textAlign: isRtl ? "right" : "left" }]}
            >
              {t("profile.languageModalTitle")}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="close"
                size={moderateScale(20)}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Clean Flat Options */}
          <View style={{ marginVertical: verticalScale(10) }}>
            {/* English Option */}
            <TouchableOpacity
              style={[
                styles.cleanOptionRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
                tempLanguage === "en" && styles.cleanOptionRowSelected,
              ]}
              onPress={() => setTempLanguage("en")}
              activeOpacity={0.7}
            >
              <Text
                semiBold={tempLanguage === "en"}
                medium={tempLanguage !== "en"}
                FONT_14
                style={{ color: tempLanguage === "en" ? colors.primary : colors.text }}
              >
                {t("english") || "English"}
              </Text>
              {tempLanguage === "en" && (
                <AnyIcon
                  type={Icons.Ionicons}
                  name="checkmark"
                  size={moderateScale(18)}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            {/* Urdu Option */}
            <TouchableOpacity
              style={[
                styles.cleanOptionRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
                tempLanguage === "ur" && styles.cleanOptionRowSelected,
              ]}
              onPress={() => setTempLanguage("ur")}
              activeOpacity={0.7}
            >
              <Text
                semiBold={tempLanguage === "ur"}
                medium={tempLanguage !== "ur"}
                FONT_14
                style={{ color: tempLanguage === "ur" ? colors.primary : colors.text }}
              >
                اردو (Urdu)
              </Text>
              {tempLanguage === "ur" && (
                <AnyIcon
                  type={Icons.Ionicons}
                  name="checkmark"
                  size={moderateScale(18)}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Clean Primary Button */}
          <View style={{ marginTop: verticalScale(10) }}>
            <AppButton
              title={t("profile.confirmSelection")}
              onPress={onConfirm}
              style={{ width: "100%" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LanguageSelectorModal;
