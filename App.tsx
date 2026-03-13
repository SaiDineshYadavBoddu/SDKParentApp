import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation';
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { ThemeProvider } from './src/theme/ThemeProvider';
import { enableSecureScreen } from './src/hooks/SecureScreen';
import { useEffect } from 'react';

function App(): React.JSX.Element {
  useEffect(() => {
    enableSecureScreen();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
