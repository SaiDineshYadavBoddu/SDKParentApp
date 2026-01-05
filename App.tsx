import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation';
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { ThemeProvider } from './src/theme/ThemeProvider';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar translucent={false} backgroundColor="black" barStyle="light-content" />
      <Provider store={store}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
