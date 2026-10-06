import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import {
  NotificationMenu,
  type NotificationItem,
} from "../../src/patterns/notifications.js";
import { Widget } from "../../src/data-display/widget.js";
import { Button } from "../../src/buttons/button.js";
import { toast } from "../../src/overlays/toast.js";

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

function ActivationAndRecovery() {
  const [items, setItems] = useState(initialItems.slice(0, 1));
  const [activations, setActivations] = useState(0);
  const [navigation, setNavigation] = useState("Not navigated");
  const [pending, setPending] = useState(false);
  const [marking, setMarking] = useState(false);
  const [open, setOpen] = useState(false);
  const finish = useRef<(() => void) | undefined>(undefined);
  const count = useRef(0);
  return (
    <div className="grid justify-items-end gap-4 p-4 text-sm">
      <NotificationMenu
        isOpen={open}
        onOpenChange={setOpen}
        items={items}
        unreadCount={items.filter((item) => item.unread).length}
        markingRead={marking}
        onMarkAllRead={() => {
          setMarking(true);
          finish.current = () => {
            setItems((records) =>
              records.map((record) => ({ ...record, unread: false })),
            );
            setMarking(false);
          };
        }}
        onActivate={async (item) => {
          count.current++;
          const attempt = count.current;
          setActivations(attempt);
          setPending(true);
          await new Promise<void>((resolve) => {
            finish.current = resolve;
          });
          setPending(false);
          if (attempt === 1)
            throw new Error("Could not mark the notification read");
          setItems((records) =>
            records.map((record) =>
              record.id === item.id ? { ...record, unread: false } : record,
            ),
          );
          setNavigation(`Navigated to ${item.href}`);
        }}
        emptyContent={
          <div className="p-4">
            <Widget.Action onPress={() => setItems(initialItems.slice(0, 1))}>
              Retry notifications
            </Widget.Action>
          </div>
        }
        footer={
          pending || marking ? (
            <Widget.Action onPress={() => finish.current?.()}>
              {pending ? "Complete activation" : "Complete mark all"}
            </Widget.Action>
          ) : (
            <Widget.Action onPress={() => setItems(initialItems)}>
              Load more
            </Widget.Action>
          )
        }
      />
      <Button
        variant="secondary"
        onPress={() => {
          setItems([]);
          toast.danger("Could not load notifications");
        }}
      >
        Simulate query failure
      </Button>
      <p data-activation-count>Activations: {activations}</p>
      <p data-navigation>{navigation}</p>
      <p data-open>{open ? "Menu open" : "Menu closed"}</p>
    </div>
  );
}

export default {
  "Mark all read": <Notifications />,
  "App header action": <Notifications clearAction />,
  Loading: <Notifications loading />,
  "Activation and recovery": <ActivationAndRecovery />,
};
