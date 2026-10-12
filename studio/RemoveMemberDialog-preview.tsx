import { RemoveMemberDialog } from "../src/patterns/team-settings/remove-member-dialog";
import { useState } from "react";
import { Button } from "../src/buttons/button";
import { usePreviewOptions } from "./preview-options";

export default function RemoveMemberDialogPreview() {
  const [open, setOpen] = useState(true);
  const { failRequest: fail } = usePreviewOptions();
  const request = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (fail) throw new Error("Could not complete the request. Try again.");
  };
  return (
    <div className="max-w-lg p-4">
      <>
        <Button onPress={() => setOpen(true)}>Open dialog</Button>
        <RemoveMemberDialog
          isOpen={open}
          onOpenChange={setOpen}
          member={{ name: "Alex Morgan", email: "alex@example.test" }}
          onRemove={request}
        />
      </>
    </div>
  );
}
