import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface StickyFooterActionsProps {
  insetsBottom: number;
  onContact: () => void;
  onDonate: () => void;
}

export const StickyFooterActions: React.FC<StickyFooterActionsProps> = ({
  insetsBottom,
  onContact,
  onDonate,
}) => {
  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: Math.max(moderateScale(12), insetsBottom) },
      ]}
    >
      <TouchableOpacity
        style={styles.contactBtn}
        onPress={onContact}
        activeOpacity={0.75}
      >
        <AnyIcon
          type={Icons.Feather}
          name="message-square"
          size={moderateScale(14)}
          color={colors.text}
        />
        <AppText bold FONT_12 style={styles.contactText}>
          Message
        </AppText>
      </TouchableOpacity>
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
    </View>
  );
};
