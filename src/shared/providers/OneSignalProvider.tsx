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
        // Suppress OS notification banner popup and toasts while app is active
        event.preventDefault();

        // Play ring.mp3 inside active app
        playNotificationSound();
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
