import { View, Text } from 'react-native'
import React from 'react'
import AppNavigation from '@navigation/index'
import { Provider } from 'react-redux';
import store from '@store/store';
import '@shared/i18n'
const App = () => {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  )
}

export default App