import { useRef, useState } from "react";
import {
  EmailConfirmation,
  type EmailConfirmationProps,
} from "../../../src/patterns/auth/email-confirmation";
import { Button } from "../../../src/buttons/button";
import { toast } from "../../../src/overlays/toast";
import { authPreviewBrand } from "../../../studio/auth-previews";

function Confirmation({
  purpose = "verify-email",
  initial = "ready",
  canRetry = false,
}: {
  purpose?: EmailConfirmationProps["purpose"];
  initial?: EmailConfirmationProps["status"];
  canRetry?: boolean;
}) {
  const [status, setStatus] = useState(initial);
  const [requests, setRequests] = useState(0);
  const [back, setBack] = useState(0);
  const count = useRef(0);
  const finish = useRef<(() => void) | undefined>(undefined);
  const confirm = async () => {
    const attempt = ++count.current;
    setRequests(attempt);
    await new Promise<void>((resolve) => {
      finish.current = resolve;
    });
    if (attempt === 1) throw new Error("Confirmation failed. Try again.");
    toast.success(
      purpose === "email-change" ? "Email updated" : "Email verified",
    );
    setStatus("confirmed");
  };
  const common = {
    brand: authPreviewBrand,
    purpose,
    onBackToSignIn: () => setBack((count) => count + 1),
  };
  const props: EmailConfirmationProps =
    status === "ready"
      ? { ...common, status, onConfirm: confirm }
      : status === "unavailable"
        ? { ...common, status, onRetry: canRetry ? confirm : undefined }
        : { ...common, status };
  return (
    <>
      <EmailConfirmation {...props} />
      <div className="flex flex-wrap gap-4 p-4 text-sm">
        <Button variant="secondary" onPress={() => finish.current?.()}>
          Complete request
        </Button>
        {status === "checking" && (
          <Button onPress={() => setStatus("ready")}>Finish checking</Button>
        )}
        <p data-confirm-requests>Requests: {requests}</p>
        <p data-back-count>Back: {back}</p>
      </div>
    </>
  );
}

export default {
  "Verify email": <Confirmation />,
  "Change email": <Confirmation purpose="email-change" />,
  Checking: <Confirmation initial="checking" />,
  "Missing link": <Confirmation initial="unavailable" />,
  Retry: <Confirmation initial="unavailable" canRetry />,
};
