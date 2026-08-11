import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../NotificationsScreen.styles";

const EmptyAlerts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <AnyIcon
          type={Icons.Feather}
          name="bell-off"
          size={moderateScale(30)}
          color={colors.gray600}
        />
      </View>
      <AppText bold FONT_16 style={styles.emptyTitle}>
        {t("notifications.noNotifications")}
      </AppText>
      <AppText regular FONT_13 style={styles.emptyBody}>
        {t("notifications.noNotificationsSub")}
      </AppText>
    </View>
  );
};

export default EmptyAlerts;
