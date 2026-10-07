"use client";
import type { ComponentProps } from "react";
import { Skeleton } from "../../feedback/skeleton.js";
import { Widget } from "../../data-display/widget.js";
import { cn } from "../../lib/utils.js";
export type LoadingSkeletonProps = ComponentProps<"div">;
export function LoadingSkeleton({
  children,
  className,
  "aria-label": label = "Loading data",
  ...props
}: LoadingSkeletonProps) {
  return (
    <div
      {...props}
      role="status"
      aria-label={label}
      aria-busy="true"
      className={cn("grid gap-4", className)}
    >
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
}
export type SkeletonCardProps = Omit<ComponentProps<"div">, "children">;
export function SkeletonCard({ className, ...props }: SkeletonCardProps) {
  return (
    <Widget {...props} className={cn("oss-skeleton-card", className)}>
      <Skeleton className="oss-skeleton-card__fill" />
    </Widget>
  );
}
