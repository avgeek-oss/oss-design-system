import { useEffect, useRef, useState } from "react";
import { ProfileSettings } from "../../../src/patterns/account-settings/profile-settings";
import { Button } from "../../../src/buttons/button";
import {
  OverlaySuspensionScope,
  useOverlaySuspension,
} from "../../../src/overlays/overlay-suspension";
import { ProfileSettingsPreview } from "../../../studio/account-settings-previews";

function HeldSavePreview() {
  const [suspended, setSuspended] = useState(false);
  const [owner, setOwner] = useState(0);
  const [requests, setRequests] = useState(0);
  const sequence = useRef(0);
  const pending = useRef(
    new Map<
      number,
      {
        resolve: () => void;
        reject: (cause: Error) => void;
      }
    >(),
  );
  const request = () => {
    const id = ++sequence.current;
    setRequests(id);
    return new Promise<void>((resolve, reject) => {
      pending.current.set(id, { resolve, reject });
    });
  };
  useEffect(() => {
    const settle = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "number")
        return;
      const held = pending.current.get(event.detail);
      if (!held) return;
      pending.current.delete(event.detail);
      if (event.type === "preview:name-resolve") held.resolve();
      else held.reject(new Error("Name save rejected"));
    };
    window.addEventListener("preview:name-resolve", settle);
    window.addEventListener("preview:name-reject", settle);
    return () => {
      window.removeEventListener("preview:name-resolve", settle);
      window.removeEventListener("preview:name-reject", settle);
    };
  }, []);
  return (
    <div className="grid gap-4 p-4">
      <p data-testid="requests">Requests: {requests}</p>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => setSuspended((current) => !current)}>
          {suspended ? "Resume same account" : "Suspend account"}
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setOwner((current) => current + 1);
            setSuspended(false);
          }}
        >
          Switch account
        </Button>
      </div>
      <OverlaySuspensionScope isSuspended={suspended}>
        <div hidden={suspended} inert={suspended}>
          <OwnedProfile
            key={owner}
            initialName={owner === 0 ? "Alex" : "Morgan"}
            request={request}
          />
        </div>
      </OverlaySuspensionScope>
    </div>
  );
}
function OwnedProfile({
  initialName,
  request,
}: {
  initialName: string;
  request: () => Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const { capture } = useOverlaySuspension();
  return (
    <>
      <p data-testid="saved-name">Saved name: {name}</p>
      <ProfileSettings
        value={name}
        onSave={async (draft) => {
          const isCurrent = capture();
          await request();
          if (isCurrent()) setName(draft);
        }}
      />
    </>
  );
}
export default {
  Default: ProfileSettingsPreview,
  "Held save": HeldSavePreview,
};
