import React, { useEffect, useRef, ReactNode } from "react";
import {
  Alert,
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
import { showInfoToast } from "@components/Toast";
import { selectUser } from "@store/slices/authSlice";
import ENV from "@config/env";

const ONESIGNAL_APP_ID = ENV.ONESIGNAL_APP_ID;

export const checkAndPromptNotificationPermission = async () => {
  try {
    let hasPerm = false;

    if (Platform.OS === "android" && Platform.Version >= 33) {
      hasPerm = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    } else {
      hasPerm = await OneSignal.Notifications.hasPermission();
    }

    if (hasPerm) {
      return true;
    }

    Alert.alert(
      "Enable Emergency Alerts 🚨",
      "LifeLink requires notification permission to alert you instantly when a patient urgently needs blood in your area or when someone messages you about a donation.\n\nPlease enable notifications to save lives.",
      [
        {
          text: "Later",
          style: "cancel",
        },
        {
          text: "Enable in Settings",
          onPress: async () => {
            const granted = await OneSignal.Notifications.requestPermission(true);
            if (!granted) {
              Linking.openSettings();
            }
          },
        },
      ],
      { cancelable: true }
    );
    return false;
  } catch (err: any) {
    console.log("Error checking notification permission:", err?.message);
    return false;
  }
};

const OneSignalProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector(selectUser);
  const appState = useRef(AppState.currentState);

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
        event.notification.display();
        const title = event.notification.title || "New Notification";
        const description = event.notification.body || "";
        showInfoToast(title, description);
        console.log("Notification received in foreground:", event.notification);
      },
    );

    OneSignal.Notifications.addEventListener(
      "click",
      (event: NotificationClickEvent) => {
        console.log("Notification opened:", event.notification);
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
      }
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
    } else {
      OneSignal.logout();
      console.log("🔔 [OneSignal] Logged out user");
    }
  }, [user?.id]);

  return <>{children}</>;
};

export default OneSignalProvider;
