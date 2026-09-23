import React, { useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { verticalScale as vs, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import ScreenWrapper from "@components/ScreenWrapper";
import AppFlashList from "@components/AppList";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { selectIsRtl } from "@store/slices/appSlice";
import useTranslation from "@shared/hooks/useTranslation";
import {
  useNotifications,
  useMarkNotificationRead,
  useClearAllNotifications,
} from "@shared/query/notifications/useNotifications";
import AlertCard from "./components/AlertCard";
import EmptyAlerts from "./components/EmptyAlerts";
import { Alert } from "./types";
import { styles } from "./NotificationsScreen.styles";

const formatRelativeTime = (timeStr?: string, createdAt?: string): string => {
  if (timeStr && !timeStr.includes("T") && !timeStr.includes("-")) {
    return timeStr;
  }
  const dateVal = timeStr || createdAt;
  if (!dateVal) return "Recently";
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return timeStr || "Recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const isRtl = useSelector(selectIsRtl);

  const { data: rawNotifications, refetch, isRefetching } = useNotifications();

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: clearAll, isPending: isClearing } =
    useClearAllNotifications();

  const alerts: Alert[] = useMemo(() => {
    if (!rawNotifications) return [];

    const rawList = Array.isArray(rawNotifications)
      ? rawNotifications
      : rawNotifications?.data?.notifications ||
        rawNotifications?.notifications ||
        rawNotifications?.data ||
        [];

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item: any, index: number) => {
      const type =
        item.type ||
        item.notification_type ||
        (item.data?.blood_group || item.data?.request_id
          ? "blood_request"
          : item.data?.conversation_id
            ? "chat_message"
            : "system");

      const isRead =
        item.read === true || item.is_read === true || item.status === "read";

      return {
        id: String(item.id || item._id || `notif-${index}`),
        type,
        title: item.title || "LifeLink Alert",
        body: item.body || item.message || item.description || "",
        time: formatRelativeTime(item.time, item.created_at || item.createdAt),
        read: isRead,
        urgency:
          item.urgency ||
          item.data?.urgency ||
          (type === "urgent_request" ? "critical" : "normal"),
        bloodType:
          item.bloodType ||
          item.blood_group ||
          item.data?.blood_group ||
          item.data?.bloodType,
        hospital:
          item.hospital ||
          item.hospital_name ||
          item.data?.hospital_name ||
          item.data?.hospital,
        patientName:
          item.patientName || item.patient_name || item.data?.patient_name,
        city: item.city || item.data?.city,
        requestId:
          item.requestId ||
          item.request_id ||
          item.data?.request_id ||
          item.data?.requestId,
        conversationId:
          item.conversationId ||
          item.conversation_id ||
          item.data?.conversation_id,
        data: item.data,
        createdAt: item.created_at || item.createdAt,
      };
    });
  }, [rawNotifications]);

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts],
  );

  const handlePress = useCallback(
    (item: Alert) => {
      if (!item.read) {
        markRead(item.id);
      }

      switch (item.type) {
        case "donation_match": {
          navigation.navigate(ROUTES.MY_REQUESTS);
          break;
        }

        case "blood_request":
        case "urgent_request": {
          const reqId =
            item.requestId || item.data?.request_id || item.data?.request?.id;

          if (reqId) {
            const reqPayload = item.data?.request || {
              id: reqId,
              patientName:
                item.patientName ||
                item.data?.patient_name ||
                item.title ||
                "Blood Patient",
              bloodType:
                item.bloodType || item.data?.blood_group || "Emergency",
              hospital: item.hospital || item.data?.hospital_name || "Hospital",
              city: item.city || item.data?.city_id || "",
              units: item.data?.units_required || 1,
              urgency: item.urgency || item.data?.urgency || "urgent",
              time: item.time || "Recently",
              description: item.body || "",
              latitude: item.data?.latitude,
              longitude: item.data?.longitude,
              contact_number: item.data?.contact_number,
            };

            navigation.navigate(ROUTES.REQUEST_DETAIL, {
              request: reqPayload,
            });
          } else {
            navigation.navigate(ROUTES.MAIN_FLOW, {
              screen: ROUTES.FEED,
            });
          }
          break;
        }

        case "donation_received": {
          navigation.navigate(ROUTES.MY_DONATIONS);
          break;
        }

        case "chat_message": {
          const threadId =
            item.conversationId ||
            item.data?.conversation_id ||
            item.data?.thread_id;

          if (threadId) {
            navigation.navigate(ROUTES.CHAT, {
              threadId,
              request: item.data?.request,
            });
          } else {
            navigation.navigate(ROUTES.CHATS_LIST);
          }
          break;
        }

        case "reminder": {
          navigation.navigate(ROUTES.MAIN_FLOW, {
            screen: ROUTES.FEED,
          });
          break;
        }

        case "profile":
        case "system": {
          navigation.navigate(ROUTES.MAIN_FLOW, {
            screen: ROUTES.PROFILE,
          });
          break;
        }

        default: {
          navigation.navigate(ROUTES.MAIN_FLOW, {
            screen: ROUTES.FEED,
          });
          break;
        }
      }
    },
    [navigation, markRead],
  );

  const handleClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

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
            unreadCount > 0 ? (
              <TouchableOpacity
                onPress={handleClearAll}
                activeOpacity={0.7}
                disabled={isClearing}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.headerIconButton}
              >
                <AnyIcon
                  type={Icons.MaterialCommunityIcons}
                  name="check-all"
                  size={moderateScale(19)}
                  color={colors.primary}
                />
              </TouchableOpacity>
            ) : null
          }
          titleSize={15}
          hasBorder={true}
        />
      }
    >
      <AppFlashList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard {...item} isRtl={isRtl} onPress={handlePress} />
        )}
        estimatedItemSize={80}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: vs(8) }} />}
        ListEmptyComponent={<EmptyAlerts />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </ScreenWrapper>
  );
};

export default NotificationsScreen;
