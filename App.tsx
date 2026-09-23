import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@store/store";
import AppNavigation from "@navigation/index";
import "@shared/i18n";
import OneSignalProvider from "@providers/OneSignalProvider";
import PresenceProvider from "@providers/PresenceProvider";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { toastConfig } from "@components/Toast";
import * as Sentry from "@sentry/react-native";
import {
  NavigationContainer,
  LinkingOptions,
  getStateFromPath,
} from "@react-navigation/native";
import { Linking, Platform } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ROUTES } from "@utils/Routes";
import ENV from "@config/env";
import { queryClient } from "@shared/query/queryClient";
import { navigationRef } from "./src/navigation/navigationService";

const linking: LinkingOptions<any> = {
  prefixes: ["lifelink://"],
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log("Deep link received (initial):", url);
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log("Deep link received (subscribe):", url);
      listener(url);
    };

    const eventListenerSubscription = Linking.addEventListener(
      "url",
      onReceiveURL,
    );

    return () => {
      eventListenerSubscription.remove();
    };
  },
  getStateFromPath(path, config) {
    const normalizedPath = path.includes("#") ? path.replace("#", "?") : path;
    return getStateFromPath(normalizedPath, config);
  },
  config: {
    screens: {
      [ROUTES.AUTH_FLOW]: {
        screens: {
          [ROUTES.RESET_PASSWORD]: "auth/ResetPassword",
        },
      },
    },
  },
};

import { initNetworkSentryTracking } from "@shared/utils/sentryLogger";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const AppToast = () => {
  const insets = useSafeAreaInsets();
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={Platform.OS === "ios" ? insets.top + 10 : 10}
    />
  );
};

const App = (): React.JSX.Element => {
  React.useEffect(() => {
    initNetworkSentryTracking();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <PresenceProvider>
              <OneSignalProvider>
                <NavigationContainer
                  ref={navigationRef}
                  linking={linking}
                  onReady={() => {
                    navigationIntegration.registerNavigationContainer(navigationRef);
                  }}
                >
                  <AppNavigation />
                  <AppToast />
                </NavigationContainer>
              </OneSignalProvider>
            </PresenceProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
