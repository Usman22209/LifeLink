import React from 'react';
import { Provider } from 'react-redux';
import store from '@store/store';
import AppNavigation from '@navigation/index';
import '@shared/i18n';
import OneSignalProvider from '@providers/OneSignalProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@components/Toast';

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <OneSignalProvider>
        <AppNavigation />
        <Toast config={toastConfig} position="top" topOffset={10} />
      </OneSignalProvider>
    </Provider>
  );
};

export default App;
