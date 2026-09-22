import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

interface NotificationPermissionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onEnable: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isVisible,
  onClose,
  onEnable,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.card}>
          {/* Icon Badge */}
          <View style={styles.badgeWrap}>
            <View style={styles.iconCircle}>
              <AnyIcon
                type={Icons.Feather}
                name="bell"
                size={moderateScale(28)}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text bold FONT_18 style={styles.title}>
            {t("notificationModal.title") || "Enable Emergency Alerts 🚨"}
          </Text>
          <Text regular FONT_12 style={styles.subtitle}>
            {t("notificationModal.subtitle") ||
              "LifeLink requires notifications to alert you instantly when a patient urgently needs blood in your area."}
          </Text>

          {/* Value Items */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitRow}>
              <View style={styles.bulletDot}>
                <AnyIcon
                  type={Icons.Feather}
                  name="activity"
                  size={moderateScale(14)}
                  color={colors.primary}
                />
              </View>
              <View style={styles.benefitTextWrap}>
                <Text bold FONT_12 style={{ color: colors.text }}>
                  {t("notificationModal.urgentAlerts") || "Urgent Blood Alerts"}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                  {t("notificationModal.urgentAlertsDesc") ||
                    "Get notified when patients near you need your blood group."}
                </Text>
              </View>
            </View>

            <View style={[styles.benefitRow, { marginBottom: 0 }]}>
              <View style={styles.bulletDot}>
                <AnyIcon
                  type={Icons.Feather}
                  name="message-circle"
                  size={moderateScale(14)}
                  color={colors.primary}
                />
              </View>
              <View style={styles.benefitTextWrap}>
                <Text bold FONT_12 style={{ color: colors.text }}>
                  {t("notificationModal.chatMessages") || "Donation Chat Messages"}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                  {t("notificationModal.chatMessagesDesc") ||
                    "Instant updates when someone responds to your donation."}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onEnable}
            activeOpacity={0.85}
          >
            <AnyIcon
              type={Icons.Feather}
              name="check-circle"
              size={moderateScale(16)}
              color={colors.white}
            />
            <Text bold FONT_13 style={styles.primaryBtnText}>
              {t("notificationModal.enableNotifications") || "Enable Notifications"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <Text bold FONT_12 style={styles.secondaryBtnText}>
              {t("notificationModal.maybeLater") || "Maybe Later"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  backdropDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "100%",
    maxWidth: scale(340),
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    borderWidth: 1.5,
    borderColor: colors.gray300,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(22),
    paddingBottom: verticalScale(16),
    alignItems: "center",
  },
  badgeWrap: {
    marginBottom: verticalScale(12),
  },
  iconCircle: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: withOpacity(colors.primary, 0.08),
    borderWidth: 1.5,
    borderColor: withOpacity(colors.primary, 0.22),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: verticalScale(4),
    marginBottom: verticalScale(14),
    lineHeight: verticalScale(16),
  },
  benefitsContainer: {
    width: "100%",
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.gray300,
    padding: moderateScale(12),
    marginBottom: verticalScale(18),
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: verticalScale(10),
  },
  bulletDot: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: withOpacity(colors.primary, 0.1),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
    marginTop: verticalScale(1),
  },
  benefitTextWrap: {
    flex: 1,
  },
  primaryBtn: {
    width: "100%",
    height: verticalScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    marginBottom: verticalScale(8),
  },
  primaryBtnText: {
    color: colors.white,
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  secondaryBtnText: {
    color: colors.textSecondary,
  },
});

export default NotificationPermissionModal;
