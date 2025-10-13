import React from 'react';
import { Provider } from 'react-redux';
import store from '@store/store';
import AppNavigation from '@navigation/index';
import '@shared/i18n';
import OneSignalProvider from '@providers/OneSignalProvider';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { toastConfig } from '@components/Toast';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://be46759d06dff53be9d88089bb307b19@o4510177765556224.ingest.de.sentry.io/4510177777156176',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <OneSignalProvider>
          <AppNavigation />
          <Toast config={toastConfig} position="top" topOffset={10} />
        </OneSignalProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
