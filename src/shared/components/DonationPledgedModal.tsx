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

interface DonationPledgedModalProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  onViewMyDonations?: () => void;
  isAlreadyPledged?: boolean;
  hospitalName?: string;
  patientName?: string;
  bloodType?: string;
}

const DonationPledgedModal: React.FC<DonationPledgedModalProps> = ({
  isVisible,
  onClose,
  onOpenChat,
  onViewMyDonations,
  isAlreadyPledged = false,
  hospitalName = "Hospital",
  patientName = "Patient",
  bloodType = "O+",
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
          {/* Top Celebration Badge */}
          <View style={styles.badgeWrap}>
            <View style={styles.iconCircle}>
              <AnyIcon
                type={Icons.Feather}
                name={isAlreadyPledged ? "check-circle" : "heart"}
                size={moderateScale(28)}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text bold FONT_18 style={styles.title}>
            {isAlreadyPledged
              ? (t("donationPledgedModal.titlePledged") || "Donation Pledged")
              : (t("donationPledgedModal.titlePledgedCelebration") || "Donation Pledged! 🎉")}
          </Text>
          <Text regular FONT_12 style={styles.subtitle}>
            {isAlreadyPledged
              ? (t("donationPledgedModal.subtitleAlready") || "You have already offered to donate for this patient.")
              : (t("donationPledgedModal.subtitleNew") || "Thank you for stepping forward to save a life.")}
          </Text>

          {/* Request Details Box */}
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <View style={styles.bloodBadge}>
                <Text bold FONT_12 style={{ color: colors.primary }}>
                  {bloodType}
                </Text>
              </View>
              <View style={styles.detailTextWrap}>
                <Text bold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
                  {patientName}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: 1 }} numberOfLines={1}>
                  {hospitalName}
                </Text>
              </View>
            </View>
          </View>

          {/* Reassurance text */}
          <View style={styles.infoRow}>
            <AnyIcon
              type={Icons.Feather}
              name="message-circle"
              size={moderateScale(14)}
              color={colors.primary}
            />
            <Text regular FONT_11 style={styles.infoText}>
              {isAlreadyPledged
                ? (t("donationPledgedModal.infoAlready") ||
                   "The requester will confirm the donation once fulfilled at the hospital. Coordinate with them anytime in chat.")
                : (t("donationPledgedModal.infoNew") ||
                   "A chat thread has been initiated with the requester so you can coordinate donation timing and location.")}
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onOpenChat}
            activeOpacity={0.85}
          >
            <AnyIcon
              type={Icons.Feather}
              name="message-circle"
              size={moderateScale(16)}
              color={colors.white}
            />
            <Text bold FONT_13 style={styles.primaryBtnText}>
              {t("donationPledgedModal.openChat") || "Open Chat with Requester"}
            </Text>
          </TouchableOpacity>

          {onViewMyDonations && (
            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={onViewMyDonations}
              activeOpacity={0.85}
            >
              <AnyIcon
                type={Icons.Feather}
                name="list"
                size={moderateScale(15)}
                color={colors.primary}
              />
              <Text bold FONT_12 style={{ color: colors.primary }}>
                {t("donationPledgedModal.viewMyDonations") || "View My Donations"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <Text bold FONT_12 style={styles.secondaryBtnText}>
              {t("donationPledgedModal.doneClose") || "Done / Close"}
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
  },
  detailsBox: {
    width: "100%",
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: colors.gray300,
    padding: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(8),
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderWidth: 1,
    borderColor: withOpacity(colors.primary, 0.25),
    marginRight: scale(10),
  },
  detailTextWrap: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(8),
    backgroundColor: "rgba(229, 57, 53, 0.04)",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(229, 57, 53, 0.15)",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  infoText: {
    color: colors.textSecondary,
    flex: 1,
    lineHeight: verticalScale(15),
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
  secondaryActionBtn: {
    width: "100%",
    height: verticalScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    marginBottom: verticalScale(6),
  },
  secondaryBtn: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  secondaryBtnText: {
    color: colors.textSecondary,
  },
});

export default DonationPledgedModal;
