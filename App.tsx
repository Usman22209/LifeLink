import React from 'react';
import { Provider } from 'react-redux';
import store from '@store/store';
import AppNavigation from '@navigation/index';
import '@shared/i18n';
import OneSignalProvider from '@providers/OneSignalProvider';

const App = (): React.JSX.Element => {
  return (
    <Provider store={store}>
      <OneSignalProvider>
        <AppNavigation />
      </OneSignalProvider>
    </Provider>
  );
};

export default App;
