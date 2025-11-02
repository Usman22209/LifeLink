import React, { useEffect, ReactNode } from "react";
import { OneSignal, LogLevel } from "react-native-onesignal";
import { showInfoToast } from "@components/Toast";
import ENV from "@config/env";

const ONESIGNAL_APP_ID = ENV.ONESIGNAL_APP_ID;

const OneSignalProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL_APP_ID);
    OneSignal.Notifications.requestPermission(false);

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event) => {
        event.notification.display();
        const title = event.notification.title || "New Notification";
        const description = event.notification.body || "";
        showInfoToast(title, description);
        console.log("Notification received in foreground:", event.notification);
      },
    );

    OneSignal.Notifications.addEventListener("click", (event) => {
      console.log("Notification opened:", event.notification);
    });
  }, []);

  return <>{children}</>;
};

export default OneSignalProvider;
