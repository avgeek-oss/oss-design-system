import { RevokeInvitationDialog } from "../src/patterns/team-settings/revoke-invitation-dialog";
import { useState } from "react";
import { Button } from "../src/buttons/button";
import { useFixtureInput } from "react-cosmos/client";

export default function RevokeInvitationDialogPreview() {
  const [open, setOpen] = useState(true);
  const [fail] = useFixtureInput("Fail request", false);
  const request = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (fail) throw new Error("Could not complete the request. Try again.");
  };
  return (
    <div className="max-w-lg p-4">
      <>
        <Button onPress={() => setOpen(true)}>Open dialog</Button>
        <RevokeInvitationDialog
          isOpen={open}
          onOpenChange={setOpen}
          email="alex@example.test"
          onRevoke={request}
        />
      </>
    </div>
  );
}
