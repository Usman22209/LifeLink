import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
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
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const donorName = donation.donor?.full_name || "Volunteer Donor";
  const donorPhone = donation.donor?.phone || "";
  const isCompleted = donation.status === "completed";

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.donorRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.donorAvatar}>
          <Text bold FONT_13 style={{ color: colors.primary }}>
            {donorName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginHorizontal: scale(10),
            alignItems: isRtl ? "flex-end" : "flex-start",
          }}
        >
          <Text
            semiBold
            FONT_13
            style={{ color: colors.text, textAlign: isRtl ? "right" : "left" }}
            numberOfLines={1}
          >
            {donorName}
          </Text>
          {donorPhone ? (
            <Text
              regular
              FONT_11
              style={{
                color: colors.textSecondary,
                marginTop: verticalScale(1),
                textAlign: isRtl ? "right" : "left",
              }}
            >
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
            {isCompleted
              ? (t("trackRequest.received") || "Donated")
              : (t("trackRequest.pledged") || "Pledged")}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />
      <View
        style={[
          styles.donorActions,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionBtnOutline,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
          activeOpacity={0.7}
          onPress={onMessage}
        >
          <AnyIcon type={Icons.Feather} name="message-circle" size={moderateScale(13)} color={colors.text} />
          <Text semiBold FONT_11 style={{ color: colors.text, marginHorizontal: scale(5) }}>
            {t("trackRequest.message") || "Message"}
          </Text>
        </TouchableOpacity>

        {!isCompleted ? (
          <TouchableOpacity
            style={[
              styles.actionBtnPrimary,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
            activeOpacity={0.8}
            onPress={() => onConfirmReceived(donation.id, donorName)}
            disabled={isUpdatingDonation}
          >
            <AnyIcon type={Icons.Feather} name="check" size={moderateScale(13)} color={colors.white} />
            <Text semiBold FONT_11 style={{ color: colors.white, marginHorizontal: scale(5) }}>
              {t("trackRequest.confirmReceivedBtn") || "Confirm Received"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
