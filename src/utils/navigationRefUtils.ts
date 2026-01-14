import { NavigationContainerRef } from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

/**
 * Initializes and sets up navigation refs for all modules that need it
 * @param ref The navigation container ref
 */
export const initializeNavigationRef = (ref: NavigationContainerRef<any> | null) => {
  navigationRef = ref;
};

/**
 * Gets the current navigation ref
 */
export const getNavigationRef = () => navigationRef;

/**
 * Navigates to a screen
 */
export const navigate = (name: string, params?: any) => {
  if (navigationRef?.isReady()) {
    (navigationRef as any).navigate(name, params);
  }
};

/**
 * Resets navigation stack to a specific screen
 */
export const resetNavigation = (name: string, params?: any) => {
  if (navigationRef?.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
};

/**
 * Goes back in navigation
 */
export const goBack = () => {
  if (navigationRef?.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

/**
 * Gets the current route name
 */
export const getCurrentRouteName = () => {
  return navigationRef?.getCurrentRoute()?.name;
};

