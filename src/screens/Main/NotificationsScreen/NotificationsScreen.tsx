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
import { Alert, MOCK_ALERTS } from "./types";
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

  // DEV-only state to test mock notifications when backend has no data
  const [devMockList, setDevMockList] = useState<Alert[] | null>(null);

  const {
    data: rawNotifications,
    refetch,
    isRefetching,
  } = useNotifications();

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: clearAll, isPending: isClearing } = useClearAllNotifications();

  // Normalize notifications dynamically from backend API (or dev test list if active)
  const alerts: Alert[] = useMemo(() => {
    if (devMockList) {
      return devMockList;
    }

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
        item.read === true ||
        item.is_read === true ||
        item.status === "read";

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
          item.patientName ||
          item.patient_name ||
          item.data?.patient_name,
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
  }, [rawNotifications, devMockList]);

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.read).length,
    [alerts],
  );

  // Smart Navigation Handler
  const handlePress = useCallback(
    (item: Alert) => {
      // Mark as read in dev state or backend
      if (devMockList) {
        setDevMockList((prev) =>
          prev
            ? prev.map((a) => (a.id === item.id ? { ...a, read: true } : a))
            : prev,
        );
      } else if (!item.read) {
        markRead(item.id);
      }

      // Smart Route Navigation based on payload
      switch (item.type) {
        case "blood_request":
        case "urgent_request": {
          const reqPayload = item.data?.request || {
            id: item.requestId || item.data?.request_id || item.id || "req_1",
            patientName:
              item.patientName ||
              item.data?.patient_name ||
              "Ahmad Raza",
            bloodType:
              item.bloodType || item.data?.blood_group || "B+",
            hospital:
              item.hospital || item.data?.hospital_name || "Mayo Hospital",
            city: item.city || item.data?.city_id || "1172451",
            units: item.data?.units_required || 3,
            urgency: item.urgency || item.data?.urgency || "critical",
            time: item.time || "Recently",
            description:
              item.body || "Mayo Hospital in Lahore urgently needs 3 units of B+ blood for an emergency surgery.",
            latitude: item.data?.latitude || 31.5799,
            longitude: item.data?.longitude || 74.3168,
            contact_number:
              item.data?.contact_number || "+92 300 1234567",
          };

          navigation.navigate(ROUTES.REQUEST_DETAIL, {
            request: reqPayload,
          });
          break;
        }

        case "donation_match": {
          const matchPayload = item.data?.request || {
            id: item.requestId || item.data?.request_id || item.id || "req_2",
            patientName:
              item.patientName ||
              item.data?.patient_name ||
              "Fatima Noor",
            bloodType:
              item.bloodType || item.data?.blood_group || "O+",
            hospital:
              item.hospital ||
              item.data?.hospital_name ||
              "Sheikh Zayed Hospital",
            city: item.city || item.data?.city_id || "1172451",
            units: item.data?.units_required || 1,
            urgency: item.urgency || item.data?.urgency || "urgent",
            time: item.time || "Recently",
            description:
              item.body || "Matched blood donation request at Sheikh Zayed Hospital.",
            latitude: item.data?.latitude || 31.5034,
            longitude: item.data?.longitude || 74.3318,
            contact_number:
              item.data?.contact_number || "+92 321 9876543",
          };

          navigation.navigate(ROUTES.REQUEST_DETAIL, {
            request: matchPayload,
          });
          break;
        }

        case "donation_received": {
          navigation.navigate(ROUTES.MY_DONATIONS);
          break;
        }

        case "chat_message": {
          navigation.navigate(ROUTES.CHAT, {
            threadId: item.conversationId || "thread_1",
            request: item.data?.request || {
              id: item.requestId || "req_1",
              patientName: item.patientName || "Ahmad Raza",
              bloodType: item.bloodType || "B+",
              hospital: item.hospital || "Mayo Hospital",
            },
          });
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
    [navigation, markRead, devMockList],
  );

  const handleClearAll = useCallback(() => {
    if (devMockList) {
      setDevMockList((prev) =>
        prev ? prev.map((a) => ({ ...a, read: true })) : prev,
      );
    } else {
      clearAll();
    }
  }, [clearAll, devMockList]);

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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {__DEV__ && (
                <TouchableOpacity
                  onPress={() =>
                    setDevMockList((prev) => (prev ? null : MOCK_ALERTS))
                  }
                  activeOpacity={0.7}
                  style={styles.headerDevButton}
                >
                  <AppText
                    bold
                    FONT_10
                    style={{
                      color: devMockList ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {devMockList ? "DEV ON" : "DEV"}
                  </AppText>
                </TouchableOpacity>
              )}
              {unreadCount > 0 && (
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
              )}
            </View>
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
        ListEmptyComponent={
          <EmptyAlerts
            onDevSeed={() => setDevMockList(MOCK_ALERTS)}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              if (devMockList) setDevMockList(null);
              refetch();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </ScreenWrapper>
  );
};

export default NotificationsScreen;
