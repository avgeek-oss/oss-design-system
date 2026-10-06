import type { ReactNode } from "react";
import { Providers } from "../src/utilities/providers";
import { ThemeSwitcher } from "../src/controls/theme-switcher";
import { Toast } from "../src/overlays/toast";
import "../src/styles/globals.css";

export default function Decorator({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="fixed right-3 bottom-3 z-50">
        <ThemeSwitcher />
      </div>
      {children}
      <Toast.Provider placement="bottom" />
    </Providers>
  );
}
