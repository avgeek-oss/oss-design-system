"use client";

import { createContext, useContext, useMemo } from "react";

export const MobileNavigationContext = createContext<{
  host: HTMLElement | null;
  isMobile: boolean;
  isRestoringFocus?: boolean;
  close: () => void;
  registerSecondaryNavigation: () => () => void;
}>({
  host: null,
  isMobile: false,
  isRestoringFocus: false,
  close: () => {},
  registerSecondaryNavigation: () => () => {},
});

export function useMobileNavigation() {
  const navigation = useContext(MobileNavigationContext);
  return useMemo(
    () => ({
      ...navigation,
      isRestoringFocus: navigation.isRestoringFocus ?? false,
    }),
    [navigation],
  );
}

export const NavigationContext = createContext<
  ((href: string) => void) | undefined
>(undefined);
export function useAppNavigate() {
  return useContext(NavigationContext);
}
