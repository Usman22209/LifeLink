import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { styles } from "../TrackRequestScreen.styles";

interface DonorCardProps {
  donation: any;
  onMessage: () => void;
  onConfirmReceived: (donationId: string, donorName: string) => void;
  isUpdatingDonation: boolean;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donation,
  onMessage,
  onConfirmReceived,
  isUpdatingDonation,
}) => {
  const donorName = donation.donor?.full_name || "Volunteer Donor";
  const donorPhone = donation.donor?.phone || "";
  const isCompleted = donation.status === "completed";

  return (
    <View style={styles.card}>
      <View style={styles.donorRow}>
        <View style={styles.donorAvatar}>
          <Text bold FONT_13 style={{ color: colors.primary }}>
            {donorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
            {donorName}
          </Text>
          {donorPhone ? (
            <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(1) }}>
              {donorPhone}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.donorBadge,
            {
              backgroundColor: isCompleted
                ? withOpacity(colors.success, 0.1)
                : withOpacity(colors.warning, 0.1),
            },
          ]}
        >
          <Text bold FONT_10 style={{ color: isCompleted ? colors.success : colors.warning }}>
            {isCompleted ? "Donated" : "Pledged"}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />
      <View style={styles.donorActions}>
        <TouchableOpacity
          style={styles.actionBtnOutline}
          activeOpacity={0.7}
          onPress={onMessage}
        >
          <AnyIcon type={Icons.Feather} name="message-circle" size={moderateScale(13)} color={colors.text} />
          <Text semiBold FONT_11 style={{ color: colors.text, marginLeft: scale(5) }}>
            Message
          </Text>
        </TouchableOpacity>

        {!isCompleted ? (
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            activeOpacity={0.8}
            onPress={() => onConfirmReceived(donation.id, donorName)}
            disabled={isUpdatingDonation}
          >
            <AnyIcon type={Icons.Feather} name="check" size={moderateScale(13)} color={colors.white} />
            <Text semiBold FONT_11 style={{ color: colors.white, marginLeft: scale(5) }}>
              Confirm Received
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
