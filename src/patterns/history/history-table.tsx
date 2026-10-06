"use client";

import type { ComponentProps } from "react";
import { ResourceTable, type ResourceTableColumn } from "../resource-table.js";
import { Pagination } from "../../navigation/pagination.js";
import { QueryError, QueryLoading } from "../feedback/query-state.js";
import { cn } from "../../lib/utils.js";

export type HistoryPagination = {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  totalPages?: number | null;
};
export type HistoryTableProps<T extends { id: string }> = Omit<
  ComponentProps<"div">,
  "children"
> & {
  items: T[];
  columns: ResourceTableColumn<T>[];
  label: string;
  emptyDescription: string;
  isFiltered?: boolean;
  isLoading?: boolean;
  isRefreshing?: boolean;
  error?: string;
  onRetry?: () => void;
  pagination?: HistoryPagination;
};
export function HistoryTable<T extends { id: string }>({
  items,
  columns,
  label,
  emptyDescription,
  isFiltered = false,
  isLoading = false,
  isRefreshing = false,
  error,
  onRetry,
  pagination,
  className,
  ...props
}: HistoryTableProps<T>) {
  return (
    <div
      {...props}
      aria-busy={isLoading || isRefreshing}
      className={cn("grid min-w-0 gap-4", className)}
    >
      {error ? <QueryError message={error} onRetry={onRetry} /> : null}
      {isLoading ? (
        <QueryLoading />
      ) : (
        <>
          <ResourceTable
            ariaLabel={label}
            items={items}
            columns={columns}
            getRowKey={(item) => item.id}
            emptyTitle={`No ${label.toLowerCase()} found`}
            emptyDescription={
              isFiltered
                ? "Try a different search or change the filters."
                : emptyDescription
            }
          />
          {pagination && (pagination.page > 1 || pagination.hasNextPage) ? (
            <Pagination
              aria-label={`${label} pages`}
              page={pagination.page}
              totalPages={pagination.totalPages ?? null}
              hasNextPage={pagination.hasNextPage && !isRefreshing}
              onPageChange={(page) => {
                if (!isRefreshing) pagination.onPageChange(page);
              }}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
