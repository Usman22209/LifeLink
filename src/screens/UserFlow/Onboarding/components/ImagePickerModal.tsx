import React from "react";
import { View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

interface ImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectSource: (type: "camera" | "gallery") => void;
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isVisible,
  onClose,
  onSelectSource,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.grabber} />
          <Text bold FONT_18 style={styles.title}>
            Select Photo
          </Text>

          <View style={styles.optionsWrapper}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => onSelectSource("camera")}
            >
              <AnyIcon
                type={Icons.MaterialIcons}
                name="photo-camera"
                size={moderateScale(28)}
                color={colors.primary}
              />
              <Text semiBold FONT_16 style={styles.optionText}>
                Camera
              </Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.option}
              onPress={() => onSelectSource("gallery")}
            >
              <AnyIcon
                type={Icons.MaterialIcons}
                name="photo-library"
                size={moderateScale(28)}
                color={colors.success}
              />
              <Text semiBold FONT_16 style={styles.optionText}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  grabber: {
    width: scale(40),
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: verticalScale(12),
  },
  title: {
    textAlign: "center",
    marginBottom: verticalScale(20),
    color: colors.text,
  },
  optionsWrapper: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: colors.border + "50",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
  },
  optionText: {
    marginLeft: scale(15),
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border + "20",
    marginHorizontal: scale(15),
  },
});
