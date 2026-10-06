"use client";

import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";

export { HeroTooltip as Tooltip };
export type { TooltipProps } from "@heroui/react";

function visibleText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isClipped(element: HTMLElement) {
  const style = getComputedStyle(element);
  const clipsHorizontally =
    style.overflowX === "hidden" || style.overflowX === "clip";
  const clipsVertically =
    style.overflowY === "hidden" || style.overflowY === "clip";

  return (
    (clipsHorizontally &&
      element.clientWidth > 0 &&
      element.scrollWidth > element.clientWidth + 1) ||
    (clipsVertically &&
      element.clientHeight > 0 &&
      element.scrollHeight > element.clientHeight + 1)
  );
}

function isTextClipped(element: HTMLElement) {
  if (isClipped(element)) return true;

  const parent = element.parentElement;
  if (
    parent &&
    visibleText(parent.textContent ?? "") ===
      visibleText(element.textContent ?? "") &&
    isClipped(parent) &&
    (element.scrollWidth > parent.clientWidth + 1 ||
      element.scrollHeight > parent.clientHeight + 1)
  ) {
    return true;
  }

  return Array.from(element.querySelectorAll<HTMLElement>("*")).some(isClipped);
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/** A focusable text or icon hint with no browser-native title attribute. */
export function TooltipText({
  as: Tag = "span",
  tooltip,
  placement = "top",
  children,
  className,
  dateTime,
  openOnPress = false,
  ...props
}: Omit<ComponentProps<"span">, "title"> & {
  as?: "span" | "time" | "code";
  dateTime?: string;
  tooltip?: ReactNode;
  openOnPress?: boolean;
  placement?: ComponentProps<typeof HeroTooltip.Content>["placement"];
}) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [isRedundant, setIsRedundant] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof tooltip !== "string") {
      setIsRedundant(false);
      return;
    }

    const update = () => {
      const sameText =
        visibleText(trigger.textContent ?? "") === visibleText(tooltip);
      setIsRedundant(sameText && !isTextClipped(trigger));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(trigger);
    if (trigger.parentElement) observer.observe(trigger.parentElement);
    return () => observer.disconnect();
  }, [children, tooltip]);

  if (!tooltip) {
    return createElement(Tag, { ...props, className, dateTime }, children);
  }
  return (
    <HeroTooltip
      isDisabled={isRedundant}
      isOpen={openOnPress ? isOpen && !isRedundant : undefined}
      onOpenChange={openOnPress ? setIsOpen : undefined}
    >
      <HeroTooltip.Trigger<"span">
        {...props}
        role={
          props.role ?? (openOnPress && !isRedundant ? "button" : undefined)
        }
        tabIndex={isRedundant ? -1 : props.tabIndex}
        onClick={(event) => {
          props.onClick?.(event);
          if (openOnPress && !isRedundant) setIsOpen(true);
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (
            openOnPress &&
            !isRedundant &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={className}
        render={(triggerProps) =>
          createElement(Tag, {
            ...triggerProps,
            dateTime,
            ref: (node: HTMLElement | null) => {
              triggerRef.current = node;
              assignRef(triggerProps.ref, node);
            },
          })
        }
      >
        {children}
      </HeroTooltip.Trigger>
      <HeroTooltip.Content placement={placement} showArrow>
        <HeroTooltip.Arrow />
        {tooltip}
      </HeroTooltip.Content>
    </HeroTooltip>
  );
}
