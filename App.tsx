import React from "react";
import { Provider } from "react-redux";
import store from "@store/store";
import AppNavigation from "@navigation/index";
import "@shared/i18n";
import OneSignalProvider from "@providers/OneSignalProvider";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { toastConfig } from "@components/Toast";
import * as Sentry from "@sentry/react-native";
import {
  NavigationContainer,
  LinkingOptions,
  getStateFromPath,
} from "@react-navigation/native";
import { Linking } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { ROUTES } from "@utils/Routes";
import ENV from "@config/env";
import { queryClient } from "@shared/query/queryClient";

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

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <OneSignalProvider>
            <NavigationContainer linking={linking}>
              <AppNavigation />
              <Toast config={toastConfig} position="top" topOffset={10} />
            </NavigationContainer>
          </OneSignalProvider>
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
