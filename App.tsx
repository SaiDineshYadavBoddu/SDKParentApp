import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation';
import { Provider } from "react-redux";
import { store } from "./src/store/store";

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
      <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
