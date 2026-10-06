"use client";

import type { ComponentProps } from "react";
import { useAppNavigate } from "../hooks/app-navigation.js";

export function RouteLink({
  onNavigate,
  onClick,
  ...props
}: ComponentProps<"a"> & {
  onNavigate?: (event: { preventDefault: () => void }) => void;
}) {
  const navigate = useAppNavigate();
  return (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.shiftKey ||
          props.target === "_blank" ||
          props.download ||
          !props.href ||
          !navigate
        )
          return;
        const destination = new URL(props.href, window.location.href);
        if (destination.origin !== window.location.origin) return;
        let cancelled = false;
        onNavigate?.({
          preventDefault: () => {
            cancelled = true;
          },
        });
        event.preventDefault();
        if (!cancelled) navigate(props.href);
      }}
    />
  );
}
