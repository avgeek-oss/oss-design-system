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
  readFirst = false,
}: {
  clearAction?: boolean;
  loading?: boolean;
  readFirst?: boolean;
}) {
  const [items, setItems] = useState<NotificationItem[]>(
    loading
      ? []
      : initialItems.map((item, index) => ({
          ...item,
          unread: !(readFirst && index === 0),
        })),
  );
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
  const session = useRef(0);
  return (
    <div className="grid justify-items-end gap-4 p-4 text-sm">
      <NotificationMenu
        isOpen={open}
        onOpenChange={(next) => {
          session.current++;
          setOpen(next);
        }}
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
          const generation = session.current;
          setActivations(attempt);
          setPending(true);
          await new Promise<void>((resolve) => {
            finish.current = resolve;
          });
          setPending(false);
          if (generation !== session.current) return;
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

function FocusManagement() {
  const dialog = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLButtonElement | null>(null);
  const restore = useRef(false);
  const finish = useRef<(() => void) | undefined>(undefined);
  const [pending, setPending] = useState<string>();
  const [requests, setRequests] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  function request(name: string, target: EventTarget | null) {
    const container = dialog.current;
    action.current = target instanceof HTMLButtonElement ? target : null;
    restore.current = document.activeElement === action.current;
    if (restore.current) container?.focus({ preventScroll: true });
    setPending(name);
    setRequests((count) => count + 1);
    finish.current = () => {
      setPending(undefined);
      if (name === "Load more")
        setItems((records) =>
          records.map((record) => ({ ...record, unread: false })),
        );
      requestAnimationFrame(() => {
        if (
          restore.current &&
          container?.isConnected &&
          dialog.current === container &&
          document.activeElement === container
        )
          action.current?.focus({ preventScroll: true });
      });
    };
  }
  return (
    <div className="grid justify-items-end gap-4 p-4 text-sm">
      <NotificationMenu
        dialogRef={dialog}
        isOpen={open}
        onOpenChange={setOpen}
        items={items.map((item) => ({
          ...item,
          source: item.unread ? "Unread" : "Read",
        }))}
        unreadCount={items.filter((item) => item.unread).length}
        headerEnd={
          <Widget.Action
            isDisabled={Boolean(pending)}
            onPress={(event) => request("Refresh", event.target)}
          >
            Refresh
          </Widget.Action>
        }
        footer={
          <Widget.Action
            isDisabled={Boolean(pending)}
            onPress={(event) => request("Load more", event.target)}
          >
            Load more
          </Widget.Action>
        }
      />
      <Button variant="secondary" onPress={() => finish.current?.()}>
        Complete request
      </Button>
      <p data-focus-requests>Requests: {requests}</p>
      <p data-focus-pending>{pending ?? "Idle"}</p>
    </div>
  );
}

function IgnoredActivation({
  asynchronous = false,
}: {
  asynchronous?: boolean;
}) {
  const [ignore, setIgnore] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [navigation, setNavigation] = useState("Not navigated");
  return (
    <div className="grid justify-items-end gap-4 p-4 text-sm">
      <NotificationMenu
        items={initialItems}
        unreadCount={2}
        onActivate={(item) => {
          setAttempts((count) => count + 1);
          if (ignore)
            return asynchronous ? Promise.resolve<false>(false) : false;
          setNavigation(`Navigated to ${item.href}`);
        }}
        footer={
          <Widget.Action onPress={() => setIgnore(false)}>
            Allow activation
          </Widget.Action>
        }
      />
      <p data-ignored-attempts>Attempts: {attempts}</p>
      <p data-navigation>{navigation}</p>
    </div>
  );
}

export default {
  "Mark all read": <Notifications />,
  "Read and unread": <Notifications readFirst />,
  "App header action": <Notifications clearAction />,
  "Focus management": <FocusManagement />,
  Loading: <Notifications loading />,
  "Ignored activation": <IgnoredActivation />,
  "Ignored async activation": <IgnoredActivation asynchronous />,
  "Activation and recovery": <ActivationAndRecovery />,
};
