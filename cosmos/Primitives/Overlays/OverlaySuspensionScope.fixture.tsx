import { useEffect, useRef, useState } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import {
  OverlaySuspensionScope,
  useOverlaySuspension,
} from "../../../src/overlays/overlay-suspension";
import { Modal } from "../../../src/overlays/modal";
import { AlertDialog } from "../../../src/overlays/alert-dialog";
import { Dropdown } from "../../../src/overlays/dropdown";
import { Popover } from "../../../src/overlays/popover";
import { Button } from "../../../src/buttons/button";
import { PasskeySettings } from "../../../src/patterns/account-settings/passkey-settings";
import { CreateApiKeyDialog } from "../../../src/patterns/account-settings/create-api-key-dialog";
import { InviteMemberDialog } from "../../../src/patterns/team-settings/invite-member-dialog";
import { ActionConfirmation } from "../../../src/patterns/actions/action-confirmation";
import { CodeBlock } from "../../../src/typography/code-block";
import { RecoveryCodes } from "../../../src/patterns/auth/recovery-codes";
import { PreferencesSettingsPreview } from "../../../studio/account-settings-previews";

type Kind =
  | "passkey"
  | "passkey-rename"
  | "passkey-recovery"
  | "key"
  | "invite"
  | "confirmation"
  | "modal"
  | "alert"
  | "dropdown"
  | "popover";
type ClipboardKind = "code" | "recovery" | "preferences";
function SuspensionPreview({
  kind,
  rerenderOnClose = false,
  moveFocusOnClose = false,
}: {
  kind: Kind | ClipboardKind;
  rerenderOnClose?: boolean;
  moveFocusOnClose?: boolean;
}) {
  const [suspended, setSuspended] = useState(false);
  const [owner, setOwner] = useState(0);
  const [requests, setRequests] = useState(0);
  const [revision, setRevision] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const pending = useRef<{
    resolve: () => void;
    reject: (cause: Error) => void;
  } | null>(null);
  const request = () => {
    setRequests((value) => value + 1);
    return new Promise<void>((resolve, reject) => {
      pending.current = { resolve, reject };
    });
  };
  useEffect(() => {
    const suspend = () => setSuspended(true);
    const resolve = () => {
      pending.current?.resolve();
      pending.current = null;
    };
    const reject = () => {
      pending.current?.reject(new Error("Request rejected"));
      pending.current = null;
    };
    window.addEventListener("preview:suspend", suspend);
    window.addEventListener("preview:resolve", resolve);
    window.addEventListener("preview:reject", reject);
    return () => {
      window.removeEventListener("preview:suspend", suspend);
      window.removeEventListener("preview:resolve", resolve);
      window.removeEventListener("preview:reject", reject);
    };
  }, []);
  return (
    <div className="p-4">
      <p className="mb-4 text-sm text-muted">
        Suspend with the preview:suspend event while a native overlay is open.
        Requests wait for preview:resolve or preview:reject.
      </p>
      <p data-testid="requests">Requests: {requests}</p>
      <p data-testid="revision">Revision: {revision}</p>
      {suspended && (
        <div data-testid="resume-screen" className="grid gap-3 py-4">
          <h1>Resume your work</h1>
          <Button onPress={() => setSuspended(false)}>
            Resume same account
          </Button>
          <Button
            variant="secondary"
            onPress={() => {
              setOwner((value) => value + 1);
              setSuspended(false);
            }}
          >
            Switch account
          </Button>
        </div>
      )}
      <OverlaySuspensionScope isSuspended={suspended} key={owner}>
        <div
          ref={container}
          hidden={suspended}
          inert={suspended}
          aria-hidden={suspended}
        >
          <UNSAFE_PortalProvider getContainer={() => container.current}>
            <SuspensionContent
              kind={kind}
              request={request}
              rerenderOnClose={rerenderOnClose}
              moveFocusOnClose={moveFocusOnClose}
              rerender={() => setRevision((value) => value + 1)}
            />
          </UNSAFE_PortalProvider>
        </div>
      </OverlaySuspensionScope>
    </div>
  );
}

function SuspensionContent({
  kind,
  request,
  rerenderOnClose,
  moveFocusOnClose,
  rerender,
}: {
  kind: Kind | ClipboardKind;
  request: () => Promise<void>;
  rerenderOnClose: boolean;
  moveFocusOnClose: boolean;
  rerender: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const destination = useRef<HTMLButtonElement>(null);
  const [passkeys, setPasskeys] = useState(
    kind === "passkey-rename"
      ? [
          {
            id: "key-1",
            name: "Security key",
            createdAt: "2026-10-07T00:00:00Z",
          },
        ]
      : [],
  );
  const [codes, setCodes] = useState<readonly string[]>([]);
  const suspension = useOverlaySuspension();
  if (kind === "preferences") return <PreferencesSettingsPreview />;
  if (kind === "code")
    return (
      <CodeBlock>
        <CodeBlock.Header>
          <CodeBlock.Filename>Preview code</CodeBlock.Filename>
          <CodeBlock.CopyButton code="Plain text" />
        </CodeBlock.Header>
        <CodeBlock.Code code="Plain text" />
      </CodeBlock>
    );
  if (kind === "recovery")
    return (
      <RecoveryCodes
        codes={["demo-0001-preview"]}
        onContinue={() => setOpen(false)}
      />
    );
  if (
    kind === "passkey" ||
    kind === "passkey-rename" ||
    kind === "passkey-recovery"
  )
    return (
      <PasskeySettings
        items={passkeys}
        formatDate={(value) => value}
        onAdd={async () => {
          const isCurrent = suspension.capture();
          await request();
          if (isCurrent() && kind === "passkey-recovery")
            setCodes(["demo-0001-preview"]);
        }}
        onRename={
          kind === "passkey-rename"
            ? async (id, name) => {
                const isCurrent = suspension.capture();
                await request();
                if (isCurrent())
                  setPasskeys((items) =>
                    items.map((item) =>
                      item.id === id ? { ...item, name } : item,
                    ),
                  );
              }
            : undefined
        }
        onRemove={request}
        recoveryCodes={codes}
        onDismissRecoveryCodes={() => setCodes([])}
      />
    );
  if (kind === "key")
    return (
      <>
        <Button onPress={() => setOpen(true)}>Create key</Button>
        <CreateApiKeyDialog
          isOpen={open}
          onOpenChange={setOpen}
          expiryOptions={[{ id: "never", label: "Never" }]}
          onCreate={async () => {
            await request();
            return { token: "preview-key" };
          }}
        />
      </>
    );
  if (kind === "invite")
    return (
      <>
        <Button onPress={() => setOpen(true)}>Create invitation</Button>
        <InviteMemberDialog
          isOpen={open}
          onOpenChange={setOpen}
          roles={[{ id: "member", label: "Member" }]}
          onInvite={async () => {
            await request();
            return { inviteUrl: "https://example.test/invite/preview" };
          }}
        />
      </>
    );
  if (kind === "confirmation")
    return (
      <>
        <Button onPress={() => setOpen(true)}>Revoke access</Button>
        <ActionConfirmation
          isOpen={open}
          onOpenChange={setOpen}
          title="Revoke access?"
          confirmLabel="Revoke"
          onConfirm={request}
        />
      </>
    );
  if (kind === "dropdown")
    return (
      <Dropdown>
        <Dropdown.Trigger>Open dropdown</Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Menu aria-label="Actions">
            <Dropdown.Item id="first">First action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    );
  if (kind === "popover")
    return (
      <Popover>
        <Popover.Trigger>Open popover</Popover.Trigger>
        <Popover.Content>
          <Popover.Dialog>
            <Popover.Heading>Popover content</Popover.Heading>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    );
  const Overlay = kind === "alert" ? AlertDialog : Modal;
  return (
    <>
      <Button ref={destination} variant="secondary">
        Destination focus
      </Button>
      <Overlay
        defaultOpen={false}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next && rerenderOnClose) queueMicrotask(rerender);
          if (!next && moveFocusOnClose)
            requestAnimationFrame(() => destination.current?.focus());
        }}
      >
        <Button>Open overlay</Button>
        <Overlay.Backdrop>
          <Overlay.Container size="sm">
            <Overlay.Dialog>
              <Overlay.Header>
                <Overlay.Heading>Native overlay</Overlay.Heading>
                <Overlay.CloseTrigger />
              </Overlay.Header>
              <Overlay.Body>
                <label>
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                  />
                </label>
              </Overlay.Body>
            </Overlay.Dialog>
          </Overlay.Container>
        </Overlay.Backdrop>
        <span data-testid="logical-open">Open: {String(open)}</span>
      </Overlay>
    </>
  );
}
export default {
  Passkey: () => <SuspensionPreview kind="passkey" />,
  PasskeyRename: () => <SuspensionPreview kind="passkey-rename" />,
  PasskeyRecovery: () => <SuspensionPreview kind="passkey-recovery" />,
  ApiKey: () => <SuspensionPreview kind="key" />,
  Invitation: () => <SuspensionPreview kind="invite" />,
  Confirmation: () => <SuspensionPreview kind="confirmation" />,
  Modal: () => <SuspensionPreview kind="modal" />,
  AlertDialog: () => <SuspensionPreview kind="alert" />,
  Dropdown: () => <SuspensionPreview kind="dropdown" />,
  Popover: () => <SuspensionPreview kind="popover" />,
  CodeBlock: () => <SuspensionPreview kind="code" />,
  RecoveryCodes: () => <SuspensionPreview kind="recovery" />,
  Preferences: () => <SuspensionPreview kind="preferences" />,
  AlertRerender: () => <SuspensionPreview kind="alert" rerenderOnClose />,
  AlertDestination: () => <SuspensionPreview kind="alert" moveFocusOnClose />,
};
