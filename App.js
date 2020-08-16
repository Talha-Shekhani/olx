import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './Components/Main'
import { Provider } from 'react-redux'
import { configureStore } from './redux/ConfigureStore'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './Components/LoadingComponent'

const { persistor, store } = configureStore()

export default function App() {
  return (
    <Provider store={store}>
        <PersistGate
        loading={<Loading />}
        persistor={persistor} >
          <Main />
        </PersistGate>
      </Provider>
  );
}