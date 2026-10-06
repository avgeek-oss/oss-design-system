import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils.js";
import { TooltipText } from "../overlays/tooltip.js";

export type InlineExternalLinkProps = ComponentProps<"a"> & {
  href: string;
  tooltip?: ReactNode;
};

export function InlineExternalLink({
  children,
  className,
  rel = "noopener noreferrer",
  target = "_blank",
  tooltip,
  ...props
}: InlineExternalLinkProps) {
  return (
    <a
      {...props}
      className={cn(
        "group/external-link inline-flex min-w-0 max-w-full items-baseline rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus",
        className,
      )}
      rel={rel}
      target={target}
    >
      <TooltipText
        className="inline-external-link__label min-w-0 truncate rounded-none after:border-muted/30 group-hover/external-link:after:border-muted group-focus-visible/external-link:after:border-muted"
        tabIndex={-1}
        tooltip={tooltip}
      >
        {children}
      </TooltipText>
      {target === "_blank" ? (
        <>
          <sup
            aria-hidden="true"
            className="ml-px shrink-0 text-[0.7em] leading-none font-normal text-muted/30 group-hover/external-link:text-muted group-focus-visible/external-link:text-muted"
          >
            ↗
          </sup>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}
