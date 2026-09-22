import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";

interface DeleteAccountConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteAccountConfirmationModal: React.FC<
  DeleteAccountConfirmationModalProps
> = ({ visible, onClose, onConfirm, isLoading = false }) => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const titleText = t("profile.deleteAccount") || "Delete Account Permanently?";
  const descText =
    t("profile.deleteAccountConfirm") ||
    "Are you sure you want to delete your account? All your donation records, blood requests, and profile data will be permanently removed. This action cannot be undone.";
  const cancelText = t("common.cancel") || "Keep Account";
  const confirmText =
    t("profile.deleteAccountConfirmButton") || "Permanently Delete";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={isLoading ? undefined : onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={isLoading ? undefined : onClose}
      >
        <Pressable style={styles.sheetContainer} onPress={() => {}}>
          {/* Top Interactive Handle Bar */}
          <TouchableOpacity
            style={styles.handleContainer}
            activeOpacity={0.6}
            onPress={isLoading ? undefined : onClose}
            hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
          >
            <View style={styles.handleBar} />
          </TouchableOpacity>

          {/* Danger Circle Icon */}
          <View style={styles.iconCircle}>
            <AnyIcon
              type={Icons.Feather}
              name="trash-2"
              size={moderateScale(26)}
              color={colors.primary}
            />
          </View>

          {/* Title & Subtitle */}
          <Text
            bold
            FONT_18
            style={[styles.title, { textAlign: isRtl ? "right" : "center" }]}
          >
            {titleText}
          </Text>

          <Text
            regular
            FONT_12
            style={[
              styles.description,
              { textAlign: isRtl ? "right" : "center" },
            ]}
          >
            {descText}
          </Text>

          {/* Action Buttons Stack */}
          <View style={styles.buttonContainer}>
            <AppButton
              title={confirmText}
              onPress={onConfirm}
              loading={isLoading}
              style={styles.confirmBtn}
              textStyle={{ color: colors.white, fontSize: moderateScale(14) }}
            />

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.75}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text semiBold FONT_13 style={{ color: colors.textSecondary }}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(10, 14, 23, 0.65)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    width: "100%",
    backgroundColor: colors.card,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(28),
    alignItems: "center",
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
    marginBottom: verticalScale(12),
  },
  handleBar: {
    width: scale(38),
    height: verticalScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: colors.gray300,
  },
  iconCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  title: {
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  description: {
    color: colors.textSecondary,
    lineHeight: moderateScale(19),
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(8),
  },
  buttonContainer: {
    width: "100%",
    gap: verticalScale(10),
  },
  confirmBtn: {
    width: "100%",
    height: verticalScale(48),
    borderRadius: moderateScale(14),
    backgroundColor: colors.primary,
  },
  cancelBtn: {
    width: "100%",
    height: verticalScale(46),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default DeleteAccountConfirmationModal;
