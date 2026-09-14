import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../NotificationsScreen.styles";

interface EmptyAlertsProps {}

const EmptyAlerts: React.FC<EmptyAlertsProps> = () => {
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
    </View>
  );
};

export default EmptyAlerts;
