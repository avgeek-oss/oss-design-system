"use client";
import { useState, type ReactNode } from "react";
import { Notification02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../buttons/button.js";
import { Widget } from "../data-display/widget.js";
import { Popover } from "../overlays/popover.js";
import { ScrollShadow } from "../utilities/scroll-shadow.js";
import { RouteLink } from "../navigation/route-link.js";

export type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  href: string;
  icon: ReactNode;
  time: string;
  dateTime?: string;
  unread?: boolean;
};
export function NotificationMenu({
  items,
  unreadCount,
  loading = false,
  onMarkAllRead,
  markingRead = false,
}: {
  items: NotificationItem[];
  unreadCount: number;
  loading?: boolean;
  onMarkAllRead?: () => void;
  markingRead?: boolean;
}) {
  const [open, setOpen] = useState(false);
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
        <Popover.Dialog className="p-0 outline-none">
          <Widget>
            <Widget.Header
              className="widget__header--notification"
              endContent={
                onMarkAllRead ? (
                  <Widget.Action
                    isDisabled={!unreadCount || markingRead}
                    onPress={onMarkAllRead}
                  >
                    {markingRead ? "Marking read…" : "Mark all read"}
                  </Widget.Action>
                ) : null
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
                  <p className="px-4 py-6 text-center text-sm text-muted">
                    No notifications yet
                  </p>
                ) : (
                  <ul className="w-full divide-y divide-separator [&>li:first-child>a]:rounded-t-xl [&>li:last-child>a]:rounded-b-xl">
                    {items.map((item) => (
                      <li key={item.id}>
                        <RouteLink
                          href={item.href}
                          onNavigate={() => setOpen(false)}
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
                          </span>
                        </RouteLink>
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollShadow>
            </Widget.Content>
          </Widget>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
