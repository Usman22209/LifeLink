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
import ThemeProvider from "@shared/providers/ThemeProvider";
import ENV from "@config/env";
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
        <OneSignalProvider>
          <ThemeProvider>
            <AppNavigation />
            <Toast config={toastConfig} position="top" topOffset={10} />
          </ThemeProvider>
        </OneSignalProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
