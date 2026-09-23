import React, { useEffect, useRef, useState, ReactNode } from "react";
import {
  Linking,
  Platform,
  PermissionsAndroid,
  AppState,
  AppStateStatus,
} from "react-native";
import { useSelector } from "react-redux";
import {
  OneSignal,
  LogLevel,
  NotificationWillDisplayEvent,
  NotificationClickEvent,
} from "react-native-onesignal";
import { selectUser } from "@store/slices/authSlice";
import ENV from "@config/env";
import NotificationPermissionModal from "@components/NotificationPermissionModal";
import { playNotificationSound } from "@shared/utils/soundService";

import { queryClient } from "@shared/query/queryClient";
import { notificationKeys } from "@shared/query/notifications/useNotifications";
import { navigate } from "../../navigation/navigationService";
import { ROUTES } from "@utils/Routes";

const ONESIGNAL_APP_ID = ENV.ONESIGNAL_APP_ID;

let promptPermissionCallback: (() => void) | null = null;

export const checkAndPromptNotificationPermission = async () => {
  try {
    let hasPerm = false;

    if (Platform.OS === "android" && Platform.Version >= 33) {
      hasPerm = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } else {
      hasPerm = await OneSignal.Notifications.hasPermission();
    }

    if (hasPerm) {
      return true;
    }

    if (promptPermissionCallback) {
      promptPermissionCallback();
    }
    return false;
  } catch (err: any) {
    console.log("Error checking notification permission:", err?.message);
    return false;
  }
};

const OneSignalProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector(selectUser);
  const appState = useRef(AppState.currentState);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  useEffect(() => {
    promptPermissionCallback = () => {
      setPermissionModalVisible(true);
    };

    return () => {
      promptPermissionCallback = null;
    };
  }, []);

  const handleEnableNotifications = async () => {
    setPermissionModalVisible(false);
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Linking.openSettings();
        }
      } else {
        const granted = await OneSignal.Notifications.requestPermission(true);
        if (!granted) {
          Linking.openSettings();
        }
      }
    } catch {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);

    // Initial check after app mount with a short delay
    const timer = setTimeout(() => {
      checkAndPromptNotificationPermission();
    }, 1200);

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event: NotificationWillDisplayEvent) => {
        // Suppress OS notification banner popup while app is active
        event.preventDefault();

        // Immediately invalidate queries so in-app notifications screen and badges refresh
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        queryClient.invalidateQueries({ queryKey: ["chat"] });
        queryClient.invalidateQueries({ queryKey: ["donations"] });
        queryClient.invalidateQueries({ queryKey: ["bloodRequests"] });

        // Play ring.mp3 inside active app
        playNotificationSound();
      },
    );

    OneSignal.Notifications.addEventListener(
      "click",
      (event: NotificationClickEvent) => {
        console.log("Notification opened:", event.notification);
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        queryClient.invalidateQueries({ queryKey: ["chat"] });
        queryClient.invalidateQueries({ queryKey: ["donations"] });
        queryClient.invalidateQueries({ queryKey: ["bloodRequests"] });

        const rawData: any = event.notification?.additionalData || {};
        const notifType =
          rawData.type ||
          (rawData.request_id ? "blood_request" : rawData.thread_id ? "chat_message" : "system");

        switch (notifType) {
          case "donation_match": {
            navigate(ROUTES.MY_REQUESTS);
            break;
          }
          case "donation_received": {
            navigate(ROUTES.MY_DONATIONS);
            break;
          }
          case "blood_request":
          case "urgent_request": {
            const reqId = rawData.request_id || rawData.requestId;
            if (reqId) {
              const reqPayload = rawData.request || {
                id: reqId,
                patientName: rawData.patient_name || rawData.patientName || "Blood Patient",
                bloodType: rawData.blood_group || rawData.bloodType || "Emergency",
                hospital: rawData.hospital_name || rawData.hospital || "Hospital",
                city: rawData.city || rawData.city_id || "",
                units: rawData.units_required || 1,
                urgency: rawData.urgency || "critical",
                time: "Just now",
                description: event.notification?.body || "",
              };
              navigate(ROUTES.REQUEST_DETAIL, { request: reqPayload });
            } else {
              navigate(ROUTES.MAIN_FLOW, { screen: ROUTES.FEED });
            }
            break;
          }
          case "chat_message": {
            const threadId = rawData.thread_id || rawData.threadId || rawData.conversation_id;
            if (threadId) {
              navigate(ROUTES.CHAT, { threadId, request: rawData.request });
            } else {
              navigate(ROUTES.NOTIFICATIONS);
            }
            break;
          }
          default: {
            navigate(ROUTES.NOTIFICATIONS);
            break;
          }
        }
      },
    );

    // Re-check every time the user brings the app to the foreground
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          checkAndPromptNotificationPermission();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      OneSignal.login(user.id);
      console.log("🔔 [OneSignal] Logged in user:", user.id);

      try {
        const bloodGroup = user.blood_group || (user as any).blood_type;
        if (bloodGroup) {
          OneSignal.User.addTag(
            "blood_group",
            String(bloodGroup).toUpperCase(),
          );
        }
        const city = user.city_id || (user as any).city;
        if (city) {
          OneSignal.User.addTag("city", String(city).toLowerCase());
        }
      } catch (tagErr: any) {
        console.log("Error syncing OneSignal user tags:", tagErr?.message);
      }
    } else {
      OneSignal.logout();
      console.log("🔔 [OneSignal] Logged out user");
    }
  }, [
    user?.id,
    user?.blood_group,
    (user as any)?.blood_type,
    user?.city_id,
    (user as any)?.city,
  ]);

  return (
    <>
      {children}
      <NotificationPermissionModal
        isVisible={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
        onEnable={handleEnableNotifications}
      />
    </>
  );
};

export default OneSignalProvider;
