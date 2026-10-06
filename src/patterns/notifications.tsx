"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Ref,
  type ReactNode,
} from "react";
import { Notification02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../buttons/button.js";
import { Widget } from "../data-display/widget.js";
import { Popover } from "../overlays/popover.js";
import { ScrollShadow } from "../utilities/scroll-shadow.js";
import { RouteLink } from "../navigation/route-link.js";
import { useAsyncAction } from "./use-async-action.js";

export type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  source?: string;
  href: string;
  icon: ReactNode;
  time: string;
  dateTime?: string;
  unread?: boolean;
};

export interface NotificationMenuProps {
  items: NotificationItem[];
  unreadCount: number;
  loading?: boolean;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  headerEnd?: ReactNode;
  onMarkAllRead?: () => void;
  markingRead?: boolean;
  onActivate?: (item: NotificationItem) => void | false | Promise<void | false>;
  emptyContent?: ReactNode;
  footer?: ReactNode;
  dialogRef?: Ref<HTMLDivElement>;
}

export function NotificationMenu({
  items,
  unreadCount,
  loading = false,
  onMarkAllRead,
  markingRead = false,
  isOpen,
  defaultIsOpen = false,
  onOpenChange,
  headerEnd,
  onActivate,
  emptyContent,
  footer,
  dialogRef,
}: NotificationMenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultIsOpen);
  const activation = useAsyncAction("Could not open the notification");
  const [activeId, setActiveId] = useState<string>();
  const openGeneration = useRef(0);
  const observedOpen = useRef(false);
  const invalidateOpenSession = useCallback(() => {
    openGeneration.current++;
  }, []);
  const open = isOpen ?? internalOpen;
  useEffect(() => {
    if (observedOpen.current !== open) {
      observedOpen.current = open;
      invalidateOpenSession();
    }
    return invalidateOpenSession;
  }, [open, invalidateOpenSession]);
  const setOpen = (nextOpen: boolean) => {
    invalidateOpenSession();
    if (isOpen === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Button
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        className="notification-trigger shrink-0"
        isIconOnly
        variant="secondary"
      >
        <HugeiconsIcon
          aria-hidden="true"
          className="size-4"
          icon={Notification02Icon}
        />
        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -end-0.5 -top-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-danger px-1 font-mono text-[0.625rem] font-medium leading-4 text-danger-foreground"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Button>
      <Popover.Content
        placement="bottom end"
        className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-transparent p-0"
      >
        <Popover.Dialog ref={dialogRef} className="p-0 outline-none">
          <Widget>
            <Widget.Header
              className="widget__header--notification"
              endContent={
                headerEnd ??
                (onMarkAllRead ? (
                  <Widget.Action
                    isDisabled={!unreadCount || markingRead}
                    onPress={onMarkAllRead}
                  >
                    {markingRead ? "Marking read…" : "Mark all as read"}
                  </Widget.Action>
                ) : null)
              }
            >
              <Popover.Heading className="flex min-w-0">
                <Widget.Title help={false}>Notifications</Widget.Title>
              </Popover.Heading>
            </Widget.Header>
            <Widget.Content className="p-0">
              <ScrollShadow className="max-h-[26rem]">
                {loading && !items.length ? (
                  <p
                    role="status"
                    className="px-4 py-6 text-center text-sm text-muted"
                  >
                    Loading notifications…
                  </p>
                ) : !items.length ? (
                  (emptyContent ?? (
                    <p className="px-4 py-6 text-center text-sm text-muted">
                      No notifications yet
                    </p>
                  ))
                ) : (
                  <ul
                    aria-busy={activation.isPending}
                    className="w-full divide-y divide-separator [&>li:first-child>a]:rounded-t-xl [&>li:last-child>a]:rounded-b-xl"
                  >
                    {items.map((item) => (
                      <li key={item.id}>
                        <RouteLink
                          href={item.href}
                          aria-busy={
                            activation.isPending && activeId === item.id
                          }
                          onClick={async (event) => {
                            if (
                              event.defaultPrevented ||
                              event.button !== 0 ||
                              event.metaKey ||
                              event.ctrlKey ||
                              event.altKey ||
                              event.shiftKey
                            )
                              return;
                            if (!onActivate) {
                              setOpen(false);
                              return;
                            }
                            event.preventDefault();
                            const generation = openGeneration.current;
                            const result = await activation.run(async () => {
                              setActiveId(item.id);
                              return onActivate(item);
                            });
                            if (
                              result.ok &&
                              result.value !== false &&
                              generation === openGeneration.current
                            )
                              setOpen(false);
                          }}
                          className="flex w-full min-w-0 gap-3 rounded-none px-4 py-3 outline-none transition-colors hover:bg-default/60 focus-visible:bg-default/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 inline-flex size-4 shrink-0 [&_svg]:size-4"
                          >
                            {item.icon}
                          </span>
                          <span className="grid min-w-0 flex-1 gap-1">
                            <span className="flex items-start justify-between gap-3">
                              <span
                                className={
                                  item.unread
                                    ? "text-sm font-medium"
                                    : "text-sm"
                                }
                              >
                                {item.title}
                              </span>
                              <time
                                className="shrink-0 text-xs text-muted"
                                dateTime={item.dateTime}
                              >
                                {item.time}
                              </time>
                            </span>
                            {item.message ? (
                              <span className="text-sm text-muted">
                                {item.message}
                              </span>
                            ) : null}
                            {item.source ? (
                              <span className="text-xs text-muted">
                                {item.source}
                              </span>
                            ) : null}
                          </span>
                        </RouteLink>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollShadow>
              {activation.isPending ? (
                <p role="status" className="sr-only">
                  Opening notification…
                </p>
              ) : null}
            </Widget.Content>
            {footer ? <Widget.Footer>{footer}</Widget.Footer> : null}
          </Widget>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
