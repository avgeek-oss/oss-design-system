import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import {
  NotificationMenu,
  type NotificationItem,
} from "../../src/patterns/notifications.js";
import { Widget } from "../../src/data-display/widget.js";
import { Button } from "../../src/buttons/button.js";

const initialItems: NotificationItem[] = [
  {
    id: "deploy",
    title: "Deployment completed",
    message: "Your website is running the latest release.",
    source: "Example Website · production",
    href: "#deployment",
    icon: <HugeiconsIcon icon={Rocket01Icon} />,
    time: "2m ago",
    unread: true,
  },
  {
    id: "incident",
    title: "Health check failed",
    message: "The service did not respond within the health check timeout.",
    source: "A service with a long name · production",
    href: "#incident",
    icon: <HugeiconsIcon icon={Alert02Icon} className="text-danger" />,
    time: "8m ago",
    unread: true,
  },
];

function Notifications({
  clearAction = false,
  loading = false,
}: {
  clearAction?: boolean;
  loading?: boolean;
}) {
  const [items, setItems] = useState(loading ? [] : initialItems);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="grid justify-items-end gap-4 p-4">
      <NotificationMenu
        items={items}
        unreadCount={items.filter((item) => item.unread).length}
        loading={loading}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        headerEnd={
          clearAction ? (
            <Widget.Action
              isDisabled={!items.length}
              onPress={() => setItems([])}
            >
              Clear All
            </Widget.Action>
          ) : undefined
        }
        onMarkAllRead={() =>
          setItems(items.map((item) => ({ ...item, unread: false })))
        }
      />
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Open notifications
      </Button>
      <Button variant="secondary" onPress={() => setItems(initialItems)}>
        Restore notifications
      </Button>
      <p className="text-sm text-muted">
        {isOpen ? "Menu open" : "Menu closed"}
      </p>
    </div>
  );
}

export default {
  "Mark all read": <Notifications />,
  "App header action": <Notifications clearAction />,
  Loading: <Notifications loading />,
};
