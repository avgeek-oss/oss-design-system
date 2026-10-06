"use client";

import { useContext, type ComponentProps } from "react";
import { cn } from "../lib/utils.js";
import { Widget } from "./widget.js";
import { WidgetContentContext } from "./widget-context.js";

function Root({ className, children, ...props }: ComponentProps<"div">) {
  const isInsideWidget = useContext(WidgetContentContext);
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 px-6 py-10 text-center",
        isInsideWidget && className,
      )}
      {...(isInsideWidget ? props : {})}
    >
      {children}
    </div>
  );
  if (isInsideWidget) return content;
  return (
    <Widget className={cn("w-full min-w-0", className)} {...props}>
      <Widget.Content className="p-0">{content}</Widget.Content>
    </Widget>
  );
}
function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("grid justify-items-center gap-1", className)}
      {...props}
    />
  );
}
function Title({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-base font-medium", className)} {...props} />;
}
function Description({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted", className)} {...props} />;
}
function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      {...props}
    />
  );
}
function Media({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-muted", className)} {...props} />;
}

export const EmptyState = Object.assign(Root, {
  Content,
  Description,
  Header,
  Media,
  Root,
  Title,
});
export type EmptyStateProps = ComponentProps<typeof Root>;
