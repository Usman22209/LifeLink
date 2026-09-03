import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface StickyFooterActionsProps {
  insetsBottom: number;
  isOwner?: boolean;
  canCall?: boolean;
  donationPledged?: boolean;
  donationCompleted?: boolean;
  onCall?: () => void;
  onContact: () => void;
  onDonate: () => void;
  onManageRequest?: () => void;
  onViewMyDonations?: () => void;
}

export const StickyFooterActions: React.FC<StickyFooterActionsProps> = ({
  insetsBottom,
  isOwner,
  canCall,
  donationPledged,
  donationCompleted,
  onCall,
  onContact,
  onDonate,
  onManageRequest,
  onViewMyDonations,
}) => {
  if (isOwner) {
    return (
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(moderateScale(12), insetsBottom) },
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
            Manage in My Requests
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: Math.max(moderateScale(12), insetsBottom) },
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
            size={moderateScale(14)}
            color={colors.primary}
          />
          <AppText bold FONT_11 style={{ color: colors.primary }}>
            Call
          </AppText>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={canCall ? styles.callBtn : styles.contactBtn}
        onPress={onContact}
        activeOpacity={0.75}
      >
        <AnyIcon
          type={Icons.Feather}
          name="message-square"
          size={moderateScale(14)}
          color={colors.text}
        />
        <AppText bold FONT_11 style={styles.contactText}>
          Message
        </AppText>
      </TouchableOpacity>

      {donationCompleted ? (
        <TouchableOpacity
          style={[styles.pledgedBtn, { backgroundColor: colors.success }]}
          onPress={onViewMyDonations}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="check"
            size={moderateScale(14)}
            color={colors.white}
          />
          <AppText bold FONT_11 style={styles.donateText}>
            Completed
          </AppText>
        </TouchableOpacity>
      ) : donationPledged ? (
        <TouchableOpacity
          style={styles.pledgedBtn}
          onPress={onViewMyDonations}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="check-circle"
            size={moderateScale(14)}
            color={colors.white}
          />
          <AppText bold FONT_11 style={styles.donateText}>
            Pledged (Pending)
          </AppText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.donateBtn}
          onPress={onDonate}
          activeOpacity={0.8}
        >
          <AnyIcon
            type={Icons.Feather}
            name="heart"
            size={moderateScale(14)}
            color={colors.white}
          />
          <AppText bold FONT_12 style={styles.donateText}>
            Donate Now
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};
