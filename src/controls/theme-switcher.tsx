"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button, type ButtonProps } from "../buttons/button.js";
import { cn } from "../lib/utils.js";
import { useTheme } from "../utilities/providers.js";

export interface ThemeSwitcherProps extends Omit<
  ButtonProps,
  | "children"
  | "onPress"
  | "type"
  | "size"
  | "variant"
  | "isIconOnly"
  | "className"
> {
  label?: string;
  className?: string;
}

export function ThemeSwitcher({
  className,
  label = "Appearance",
  ...props
}: ThemeSwitcherProps) {
  const { isHydrated, resolvedTheme, setThemeMode } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const icon = resolvedTheme === "dark" ? Moon02Icon : Sun03Icon;
  const actionLabel = `${label}: switch to ${nextTheme} theme`;

  return (
    <Button
      aria-label={actionLabel}
      className={cn(!isHydrated && "invisible", className)}
      isIconOnly
      variant="secondary"
      data-slot="theme-switcher"
      type="button"
      onPress={() => setThemeMode(nextTheme)}
      {...props}
    >
      <HugeiconsIcon aria-hidden="true" className="size-4" icon={icon} />
    </Button>
  );
}
