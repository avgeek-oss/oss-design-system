"use client";

import { TooltipText } from "../overlays/tooltip.js";

import {
  createContext,
  useContext,
  type ComponentProps,
  type MouseEvent,
} from "react";
import { composeRenderProps } from "react-aria-components";
import { Dropdown } from "../overlays/dropdown.js";
import { Select } from "../forms/select.js";

import { cn } from "../lib/utils.js";
import type { AppShellBreadcrumbItems } from "../layouts/application-shell-types.js";
import { useAppNavigate } from "../hooks/app-navigation.js";

const BreadcrumbItemContext = createContext(false);

const triggerClassName =
  "flex h-auto! min-h-0! min-w-0 max-w-40 transform-none! items-center gap-1 rounded-sm! border-0! bg-transparent! px-0! py-0! text-sm shadow-none! outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 sm:max-w-64";

function BreadcrumbDropdownTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof Dropdown.Trigger>) {
  const isCurrent = useContext(BreadcrumbItemContext);
  return (
    <Dropdown.Trigger
      aria-current={isCurrent ? "page" : undefined}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          triggerClassName,
          isCurrent ? "font-medium text-foreground" : "text-muted",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className="min-w-0 truncate">{children}</span>
          <Select.Indicator className="static! size-3 shrink-0 text-muted" />
        </>
      ))}
    </Dropdown.Trigger>
  );
}

function BreadcrumbSelectTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof Select.Trigger>) {
  const isCurrent = useContext(BreadcrumbItemContext);
  return (
    <Select.Trigger
      aria-current={isCurrent ? "page" : undefined}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          triggerClassName,
          isCurrent ? "font-medium text-foreground" : "text-muted",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          <span className="min-w-0 truncate">{children}</span>
          <Select.Indicator className="static! size-3 shrink-0 text-muted" />
        </>
      ))}
    </Select.Trigger>
  );
}

export const BreadcrumbDropdown = {
  ...Dropdown,
  Trigger: BreadcrumbDropdownTrigger,
};
export const BreadcrumbSelect = { ...Select, Trigger: BreadcrumbSelectTrigger };

export function BreadcrumbTrail({
  className,
  items,
}: {
  className?: string;
  items: AppShellBreadcrumbItems;
}) {
  const navigate = useAppNavigate();
  const visibleItems = items.filter(
    (item, index) => !(index === 0 && item.href === "/"),
  );

  if (visibleItems.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("min-w-0 overflow-hidden", className)}
      data-slot="breadcrumb"
    >
      <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-sm whitespace-nowrap">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          return (
            <li
              className={cn(
                "flex min-w-0 items-center gap-2",
                isLast ? "flex-1" : "shrink",
              )}
              key={`${item.contentKey ?? item.href ?? (item.content ? "content" : item.label)}-${index}`}
            >
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted">
                  /
                </span>
              ) : null}
              {item.content ? (
                <BreadcrumbItemContext.Provider value={isLast}>
                  {item.content}
                </BreadcrumbItemContext.Provider>
              ) : item.href && !isLast ? (
                <a
                  className="block min-w-0 max-w-40 truncate text-muted hover:text-foreground sm:max-w-64"
                  href={item.href}
                  onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                    if (
                      !navigate ||
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    navigate(item.href!);
                  }}
                >
                  <TooltipText tooltip={item.label} tabIndex={-1}>
                    {item.label}
                  </TooltipText>
                </a>
              ) : (
                <TooltipText
                  aria-current={isLast ? "page" : undefined}
                  className="block min-w-0 truncate font-medium text-foreground"
                  tooltip={item.label}
                >
                  {item.label}
                </TooltipText>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
