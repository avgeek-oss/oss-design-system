"use client";

import { createContext, useContext, useState } from "react";
import {
  Button,
  OverlayArrow,
  Popover,
  PreviewTrigger,
} from "react-aria-components";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InlineExternalLink } from "../navigation/inline-external-link.js";

function TooltipArrowShape() {
  return (
    <svg
      aria-hidden="true"
      data-slot="overlay-arrow"
      width="12"
      height="12"
      viewBox="0 0 12 12"
    >
      <path
        className="fill-overlay stroke-none"
        d="M0 0C5.48483 8 6.5 8 12 0Z"
      />
      <path
        className="fill-none"
        data-slot="tooltip-arrow-edge"
        d="M0 0C5.48483 8 6.5 8 12 0"
        strokeWidth="1"
      />
    </svg>
  );
}

export type HeadingDocumentation = {
  description: string;
  href: string;
  linkLabel?: string;
};
export type HeadingKind = "page" | "widget";
export const HeadingHelpContext = createContext<
  (title: string, kind: HeadingKind) => HeadingDocumentation | undefined
>(() => undefined);

export function HeadingHelp({
  title,
  kind = "widget",
  help,
}: {
  title: string;
  kind?: HeadingKind;
  help?: HeadingDocumentation | false;
}) {
  const resolve = useContext(HeadingHelpContext);
  const [isOpen, setIsOpen] = useState(false);
  const documentation =
    help === false ? undefined : (help ?? resolve(title, kind));
  if (!documentation) return null;
  return (
    <PreviewTrigger
      delay={250}
      closeDelay={100}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Button
        aria-label={`About ${title}`}
        onPress={() => setIsOpen(true)}
        className="relative inline-flex size-6 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full text-muted outline-none pointer-fine:hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus pointer-coarse:before:absolute pointer-coarse:before:-inset-2.5 pointer-coarse:before:content-['']"
      >
        <HugeiconsIcon
          aria-hidden="true"
          icon={InformationCircleIcon}
          className="size-4"
        />
      </Button>
      <Popover
        aria-label={`About ${title}`}
        className="tooltip max-w-64 whitespace-normal break-normal text-xs font-normal [overflow-wrap:normal] [word-break:normal]"
        placement="top"
        offset={7}
      >
        <OverlayArrow>
          <TooltipArrowShape />
        </OverlayArrow>
        <span className="grid gap-2">
          <span>{documentation.description}</span>
          <InlineExternalLink
            aria-label={`Learn more about ${title} in the documentation (opens in a new tab)`}
            href={documentation.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-foreground!"
          >
            {documentation.linkLabel ?? "Learn more"}
          </InlineExternalLink>
        </span>
      </Popover>
    </PreviewTrigger>
  );
}
