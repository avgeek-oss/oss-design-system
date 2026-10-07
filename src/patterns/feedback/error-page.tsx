"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Search01Icon,
  WifiDisconnected01Icon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons";
import { Button, ButtonLink } from "../../buttons/button.js";
import { cn } from "../../lib/utils.js";

const states = {
  "not-found": {
    code: "404",
    title: "Page not found",
    description: "The address may be incorrect, or this page may have moved.",
    icon: Search01Icon,
  },
  "server-error": {
    code: "500",
    title: "We couldn't load this page",
    description: "Something went wrong. Try again in a moment.",
    icon: AlertCircleIcon,
  },
  unavailable: {
    code: "Unavailable",
    title: "Temporarily unavailable",
    description: "We couldn't connect right now. Please try again in a moment.",
    icon: WifiDisconnected01Icon,
  },
  forbidden: {
    code: "403",
    title: "You can't access this page",
    description: "Ask an administrator for access, or return to the app.",
    icon: LockKeyIcon,
  },
} as const;

export type ErrorPageStatus = keyof typeof states;
export type ErrorPageProps = Omit<ComponentProps<"section">, "title"> & {
  status: ErrorPageStatus;
  title?: string;
  description?: string;
  onRetry?: () => void;
  isPending?: boolean;
  returnHref?: string;
  returnLabel?: string;
  children?: ReactNode;
};

export function ErrorPage({
  status,
  title,
  description,
  onRetry,
  isPending = false,
  returnHref,
  returnLabel = "Go to home",
  children,
  className,
  ...props
}: ErrorPageProps) {
  const headingId = useId();
  const state = states[status];
  return (
    <section
      aria-labelledby={headingId}
      {...props}
      className={cn(
        "grid min-h-[calc(100dvh-10rem)] w-full min-w-0 place-items-center px-6 py-12",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-secondary text-muted">
          <HugeiconsIcon icon={state.icon} size={32} aria-hidden="true" />
        </div>
        <p className="mb-2 text-xs font-medium text-muted">{state.code}</p>
        <h1
          id={headingId}
          className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
        >
          {title ?? state.title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
          {description ?? state.description}
        </p>
        {(onRetry || returnHref || children) && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <Button onPress={onRetry} isPending={isPending}>
                Try again
              </Button>
            )}
            {returnHref && (
              <ButtonLink
                href={returnHref}
                variant={onRetry ? "secondary" : "primary"}
              >
                {returnLabel}
              </ButtonLink>
            )}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
