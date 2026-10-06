"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { RouteProvider } from "../hooks/route-context.js";

export function NextNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useCallback((href: string) => router.push(href), [router]);
  return (
    <RouteProvider pathname={pathname} navigate={navigate}>
      {children}
    </RouteProvider>
  );
}
