"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { NavigationContext } from "./app-navigation.js";

const RouteContext = createContext<string | null>(null);
const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const browserPath = () => window.location.pathname;
const serverPath = () => "/";

export function RouteProvider({
  pathname,
  navigate,
  children,
}: {
  pathname: string;
  navigate?: (href: string) => void;
  children: ReactNode;
}) {
  return (
    <RouteContext.Provider value={pathname}>
      <NavigationContext.Provider value={navigate}>
        {children}
      </NavigationContext.Provider>
    </RouteContext.Provider>
  );
}

export function useRoutePathname() {
  const route = useContext(RouteContext);
  const location = useSyncExternalStore(subscribe, browserPath, serverPath);
  return route ?? location;
}
