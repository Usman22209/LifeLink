import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../RequestDetailScreen.styles";

interface StickyFooterActionsProps {
  insetsBottom: number;
  isOwner?: boolean;
  canCall?: boolean;
  donationPledged?: boolean;
  donationCompleted?: boolean;
  isUrgent?: boolean;
  isCompatible?: boolean;
  onCall?: () => void;
  onContact: () => void;
  onDonate: () => void;
  onShare?: () => void;
  onManageRequest?: () => void;
  onViewMyDonations?: () => void;
}

export const StickyFooterActions: React.FC<StickyFooterActionsProps> = ({
  insetsBottom,
  isOwner,
  canCall,
  donationPledged,
  donationCompleted,
  isUrgent = false,
  isCompatible = true,
  onCall,
  onContact,
  onDonate,
  onShare,
  onManageRequest,
  onViewMyDonations,
}) => {
  const { t } = useTranslation();
  const safeBottomPadding = Math.max(verticalScale(18), insetsBottom + verticalScale(8));

  if (isOwner) {
    return (
      <View
        style={[
          styles.footer,
          { paddingBottom: safeBottomPadding },
        ]}
      >
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={onManageRequest}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="activity"
            size={moderateScale(16)}
            color={colors.white}
          />
          <AppText bold FONT_13 style={{ color: colors.white }}>
            {t("requestDetail.manageInMyRequests") || "Manage in My Requests"}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: safeBottomPadding },
      ]}
    >
      {canCall && (
        <TouchableOpacity
          style={styles.callBtn}
          onPress={onCall}
          activeOpacity={0.75}
        >
          <AnyIcon
            type={Icons.Feather}
            name="phone"
            size={moderateScale(15)}
            color={colors.primary}
          />
          <AppText bold FONT_12 style={styles.callText}>
            {t("requestDetail.call") || "Call"}
          </AppText>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.contactBtn}
        onPress={onContact}
        activeOpacity={0.75}
      >
        <AnyIcon
          type={Icons.Feather}
          name="message-square"
          size={moderateScale(15)}
          color={colors.text}
        />
        <AppText bold FONT_12 style={styles.contactText}>
          {t("requestDetail.message") || "Message"}
        </AppText>
      </TouchableOpacity>

      {donationCompleted ? (
        <TouchableOpacity
          style={styles.pledgedBtn}
          onPress={onViewMyDonations}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="check"
            size={moderateScale(15)}
            color={colors.white}
          />
          <AppText bold FONT_12 style={styles.donateText} numberOfLines={1}>
            {t("requestDetail.fulfilled") || "Fulfilled"}
          </AppText>
        </TouchableOpacity>
      ) : donationPledged ? (
        <TouchableOpacity
          style={styles.pledgedBtn}
          onPress={onDonate}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="check-circle"
            size={moderateScale(15)}
            color={colors.white}
          />
          <AppText bold FONT_12 style={styles.donateText} numberOfLines={1}>
            {t("requestDetail.pledged") || "Pledged"}
          </AppText>
        </TouchableOpacity>
      ) : !isCompatible ? (
        <TouchableOpacity
          style={[styles.donateBtn, { backgroundColor: "#D97706" }]}
          onPress={onShare || onDonate}
          activeOpacity={0.85}
        >
          <AnyIcon
            type={Icons.Feather}
            name="share-2"
            size={moderateScale(15)}
            color={colors.white}
          />
          <AppText bold FONT_13 style={styles.donateText} numberOfLines={1}>
            {t("requestDetail.shareToHelp") || "Share to Help"}
          </AppText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.donateBtn}
          onPress={onDonate}
          activeOpacity={0.85}
        >
          <AnyIcon
            type={Icons.Feather}
            name={isUrgent ? "zap" : "heart"}
            size={moderateScale(15)}
            color={colors.white}
          />
          <AppText bold FONT_13 style={styles.donateText} numberOfLines={1}>
            {isUrgent
              ? (t("requestDetail.respondNow") || "Respond Now")
              : (t("requestDetail.donateNow") || "Donate Now")}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

