import React, { createContext, useContext } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { lightTheme, darkTheme } from './index';

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme(); // "light" | "dark"

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar 
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={'transparent'}
        translucent={true}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
