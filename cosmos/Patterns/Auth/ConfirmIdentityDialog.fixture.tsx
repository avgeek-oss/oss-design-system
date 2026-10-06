import { useState } from "react";
import { Button } from "../../../src/buttons/button";
import { AuthForm } from "../../../src/patterns/auth/auth-form";
import { ConfirmIdentityDialog } from "../../../src/patterns/auth/confirm-identity-dialog";
import { ConfirmIdentityPreview } from "../../../studio/auth-previews";
function CustomVerification() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Confirm identity</Button>
      <ConfirmIdentityDialog
        isOpen={open}
        onOpenChange={setOpen}
        method="custom"
      >
        <AuthForm
          variant="secondary"
          fields={[
            {
              name: "code",
              label: "Authenticator code",
              required: true,
              autoComplete: "one-time-code",
              inputMode: "numeric",
            },
          ]}
          submitLabel="Confirm"
          onSubmit={async () => setOpen(false)}
        />
      </ConfirmIdentityDialog>
    </>
  );
}
export default {
  AppOwnedVerification: CustomVerification,
  Password: () => <ConfirmIdentityPreview />,
  Passkey: () => <ConfirmIdentityPreview method="passkey" />,
};
