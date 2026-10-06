import { TooltipText } from "../overlays/tooltip.js";
import { RouteLink as Link } from "../navigation/route-link.js";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/utils.js";

import { EmptyState } from "../data-display/empty-state.js";
import { Table } from "../data-display/table.js";
import {
  TableCellStack,
  tableCellDescriptionClassName,
} from "../data-display/table-cell-text.js";

export type ResourceTableColumn<T> = {
  cell: (item: T) => ReactNode;
  className?: string;
  header: string;
  headerClassName?: string;
  key: string;
  wrapRowLink?: boolean;
  isRowHeader?: boolean;
  mobileFullWidth?: boolean;
};

type LinkNavigateEvent = Parameters<
  NonNullable<ComponentProps<typeof Link>["onNavigate"]>
>[0];

export type ResourceTableProps<T> = {
  ariaLabel: string;
  columns: ResourceTableColumn<T>[];
  emptyAction?: ReactNode;
  emptyClassName?: string;
  emptyDescription: string;
  emptyMedia?: ReactNode;
  emptyTitle: string;
  footer?: ReactNode;
  getRowHref?: (item: T) => string;
  getRowKey: (item: T) => string;
  items: T[];
  mobileLayout?: "scroll" | "stacked";
  onRowLinkIntent?: (item: T) => void;
  onRowLinkNavigate?: (item: T, event: LinkNavigateEvent) => void;
  tableClassName?: string;
};

export function ResourceTable<T>({
  ariaLabel,
  columns,
  emptyAction,
  emptyClassName,
  emptyDescription,
  emptyMedia,
  emptyTitle,
  footer,
  getRowHref,
  getRowKey,
  items,
  mobileLayout = "scroll",
  onRowLinkIntent,
  onRowLinkNavigate,
  tableClassName,
}: ResourceTableProps<T>) {
  if (items.length === 0) {
    return (
      <EmptyState className={emptyClassName}>
        {emptyMedia ? <EmptyState.Media>{emptyMedia}</EmptyState.Media> : null}
        <EmptyState.Header>
          <EmptyState.Title>{emptyTitle}</EmptyState.Title>
          <EmptyState.Description>{emptyDescription}</EmptyState.Description>
        </EmptyState.Header>
        {emptyAction ? (
          <EmptyState.Content>{emptyAction}</EmptyState.Content>
        ) : null}
      </EmptyState>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label={ariaLabel}
          className={cn(
            tableClassName,
            mobileLayout === "stacked" && "resource-table--stacked",
          )}
        >
          <Table.Header>
            {columns.map((column) => (
              <Table.Column
                className={column.headerClassName}
                isRowHeader={column.isRowHeader ?? column === columns[0]}
                key={column.key}
              >
                {column.header}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {items.map((item) => {
              const key = getRowKey(item);
              const href = getRowHref?.(item);
              return (
                <Table.Row id={key} key={key}>
                  {columns.map((column, index) => (
                    <Table.Cell
                      className={cn(
                        "align-middle",
                        column.className,
                        mobileLayout === "stacked" &&
                          (column.mobileFullWidth ||
                            (column.isRowHeader ?? column === columns[0])) &&
                          "resource-table-mobile-full",
                      )}
                      key={column.key}
                    >
                      {mobileLayout === "stacked" &&
                      !(column.isRowHeader ?? column === columns[0]) ? (
                        <span
                          aria-hidden="true"
                          className="resource-table-mobile-label"
                        >
                          {column.header}
                        </span>
                      ) : null}
                      {index === 0 && href && column.wrapRowLink !== false ? (
                        <Link
                          className="focus-visible:ring-focus relative inline-flex min-w-0 items-center rounded-lg outline-none underline-offset-4 before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] pointer-fine:hover:underline focus-visible:ring-2"
                          href={href}
                          onFocus={() => onRowLinkIntent?.(item)}
                          onMouseEnter={() => onRowLinkIntent?.(item)}
                          onNavigate={(event) =>
                            onRowLinkNavigate?.(item, event)
                          }
                          onPointerDown={() => onRowLinkIntent?.(item)}
                        >
                          {column.cell(item)}
                        </Link>
                      ) : (
                        column.cell(item)
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {footer ? (
        <Table.Footer className="text-muted typography--body-xs flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
          {footer}
        </Table.Footer>
      ) : null}
    </Table>
  );
}

export function ResourceName({
  description,
  name,
}: {
  description?: ReactNode;
  name: ReactNode;
}) {
  return (
    <TableCellStack>
      <TooltipText
        className="truncate"
        tooltip={typeof name === "string" ? name : undefined}
      >
        {name}
      </TooltipText>
      {description ? (
        <TooltipText
          className={`${tableCellDescriptionClassName} truncate`}
          tooltip={typeof description === "string" ? description : undefined}
        >
          {description}
        </TooltipText>
      ) : null}
    </TableCellStack>
  );
}
