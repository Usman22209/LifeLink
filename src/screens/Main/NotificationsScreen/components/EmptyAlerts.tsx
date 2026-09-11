import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../NotificationsScreen.styles";

interface EmptyAlertsProps {
  onDevSeed?: () => void;
}

const EmptyAlerts: React.FC<EmptyAlertsProps> = ({ onDevSeed }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <AnyIcon
          type={Icons.Feather}
          name="bell"
          size={moderateScale(26)}
          color={colors.gray600}
        />
      </View>
      <AppText bold FONT_15 style={styles.emptyTitle}>
        {t("notifications.noNotifications") || "No Notifications Yet"}
      </AppText>
      <AppText regular FONT_12 style={styles.emptyBody}>
        {t("notifications.noNotificationsSub") ||
          "We'll notify you when urgent blood requests match your blood type."}
      </AppText>

      {__DEV__ && onDevSeed && (
        <TouchableOpacity
          style={styles.devSeedButton}
          onPress={onDevSeed}
          activeOpacity={0.75}
        >
          <AnyIcon
            type={Icons.Feather}
            name="tool"
            size={moderateScale(14)}
            color={colors.primary}
          />
          <AppText semiBold FONT_12 style={{ color: colors.primary }}>
            Load Test Notifications (DEV)
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyAlerts;

