import React, { useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { verticalScale as vs } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppFlashList from "@components/AppList";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";

import useTranslation from "@shared/hooks/useTranslation";
import AlertCard from "./components/AlertCard";
import EmptyAlerts from "./components/EmptyAlerts";
import { Alert, MOCK_ALERTS } from "./types";
import { styles } from "./NotificationsScreen.styles";

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const handlePress = useCallback(
    (item: Alert) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, read: true } : a)),
      );

      if (item.type === "blood_request" || item.type === "donation_match") {
        navigation.navigate(ROUTES.FEED);
      }
    },
    [navigation],
  );

  const handleClearAll = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      scrollable={false}
      style={styles.wrapper}
      header={
        <AppHeader
          title={t("notifications.title")}
          showBackButton
          onBackPress={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              onPress={handleClearAll}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText semiBold FONT_12 style={{ color: colors.primary }}>
                {t("notifications.clearAll")}
              </AppText>
            </TouchableOpacity>
          }
          titleSize={15}
          hasBorder={true}
        />
      }
    >
      <AppFlashList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertCard {...item} onPress={handlePress} />}
        estimatedItemSize={100}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: vs(10) }} />}
        ListEmptyComponent={<EmptyAlerts />}
      />
    </ScreenWrapper>
  );
};

export default NotificationsScreen;
