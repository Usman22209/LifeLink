import React from "react";
import { View, Modal, TouchableOpacity, Pressable } from "react-native";
import { verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
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
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text bold FONT_16 style={styles.modalTitle}>
            {t("selectLanguage") || "Select Language"}
          </Text>

          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                tempLanguage === "en" && styles.languageOptionSelected,
              ]}
              onPress={() => setTempLanguage("en")}
              activeOpacity={0.7}
            >
              <Text semiBold FONT_13 style={styles.languageOptionText}>
                English
              </Text>
              <View
                style={[styles.radioCircle, tempLanguage === "en" && styles.radioCircleSelected]}
              >
                {tempLanguage === "en" && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                tempLanguage === "ur" && styles.languageOptionSelected,
              ]}
              onPress={() => setTempLanguage("ur")}
              activeOpacity={0.7}
            >
              <Text semiBold FONT_13 style={styles.languageOptionText}>
                اردو (Urdu)
              </Text>
              <View
                style={[styles.radioCircle, tempLanguage === "ur" && styles.radioCircleSelected]}
              >
                {tempLanguage === "ur" && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.modalButtons, { paddingBottom: verticalScale(20) }]}>
            <AppButton
              title={t("common.cancel") || "Cancel"}
              onPress={onClose}
              variant="outline"
              style={styles.modalButton}
            />
            <AppButton
              title={t("confirmSelection") || "Confirm"}
              onPress={onConfirm}
              style={styles.modalButton}
            />
          </View>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

export default LanguageSelectorModal;
