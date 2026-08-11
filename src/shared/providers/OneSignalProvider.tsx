import React, { useEffect, ReactNode } from "react";
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

const OneSignalProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector(selectUser);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(false);

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
