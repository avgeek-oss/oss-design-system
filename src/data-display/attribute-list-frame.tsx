"use client";

import { forwardRef, type ComponentPropsWithRef, type ReactNode } from "react";
import { Widget } from "./widget.js";
import { cn } from "../lib/utils.js";

export const attributeListRowSpacing = "px-4 py-3";

interface AttributeListFrameProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title"
> {
  title: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  titleId?: string;
}

export const AttributeListFrame = forwardRef<
  HTMLDivElement,
  AttributeListFrameProps
>(({ children, title, titleId, icon, footer, className, ...props }, ref) => (
  <Widget
    ref={ref}
    className={cn("min-w-0 overflow-hidden", className)}
    {...props}
  >
    <Widget.Header>
      <Widget.Title
        id={titleId}
        icon={icon}
        className="min-w-0 truncate text-xs font-medium text-muted"
      >
        {title}
      </Widget.Title>
    </Widget.Header>
    <Widget.Content className="p-0">{children}</Widget.Content>
    {footer ? <Widget.Footer>{footer}</Widget.Footer> : null}
  </Widget>
));
AttributeListFrame.displayName = "AttributeListFrame";
