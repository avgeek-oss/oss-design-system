import { useRef, useState, useEffect } from "react";
import { useFixtureInput } from "react-cosmos/client";
import { preferenceOptions } from "./preference-options";
import { BrandLockup } from "../src/media/brand-lockup";
import { AvgeekLogo } from "./avgeek-brand";
import { Button } from "../src/buttons/button";
import { toast } from "../src/overlays/toast";
import { SignIn } from "../src/patterns/auth/sign-in";
import { VerificationEmail } from "../src/patterns/auth/verification-email";
import { ForgotPassword } from "../src/patterns/auth/forgot-password";
import { ResetLinkSent } from "../src/patterns/auth/reset-link-sent";
import { PasswordSetup } from "../src/patterns/auth/password-setup";
import { AcceptInvitation } from "../src/patterns/auth/accept-invitation";
import { InvitationVerification } from "../src/patterns/auth/invitation-verification";
import { InvitationUnavailable } from "../src/patterns/auth/invitation-unavailable";
import { PasskeyVerification } from "../src/patterns/auth/passkey-verification";
import { RecoverySignIn } from "../src/patterns/auth/recovery-sign-in";
import { RecoveryCodesScreen } from "../src/patterns/auth/recovery-codes-screen";
import { TeamSetup } from "../src/patterns/auth/team-setup";
import { McpAuthorization } from "../src/patterns/auth/mcp-authorization";
import { ConfirmIdentityDialog } from "../src/patterns/auth/confirm-identity-dialog";

export const authPreviewBrand = (
  <BrandLockup logo={<AvgeekLogo />}>Avgeek</BrandLockup>
);
const brand = authPreviewBrand;
const codes = Array.from(
  { length: 8 },
  (_, index) => `demo-${String(index + 1).padStart(4, "0")}-preview`,
);
export type AuthPreviewScreen =
  | "SignIn"
  | "VerificationEmail"
  | "ForgotPassword"
  | "ResetLinkSent"
  | "PasswordSetup"
  | "FirstPassword"
  | "TeamSetup"
  | "AcceptInvitation"
  | "InvitationVerification"
  | "InvitationUnavailable"
  | "PasskeyVerification"
  | "RecoverySignIn"
  | "RecoveryCodesScreen";

export function useAuthPreviewSubmit() {
  const [slow] = useFixtureInput("Slow response", false);
  const [fail] = useFixtureInput("Fail request", false);
  return async () => {
    if (slow) await new Promise((resolve) => setTimeout(resolve, 1200));
    if (fail)
      throw new Error(
        "Unable to continue. Your fields are retained. Try again.",
      );
  };
}

export function AuthPreview({
  initial,
  signInFailureCode,
}: {
  initial: AuthPreviewScreen;
  signInFailureCode?: "EMAIL_NOT_VERIFIED";
}) {
  const [screen, setScreen] = useState(initial);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const passkeyAttempt = useRef<AbortController | null>(null);
  const [setupRequests, setSetupRequests] = useFixtureInput(
    "Setup requests",
    0,
  );
  const submit = useAuthPreviewSubmit();
  const back = () => setScreen("SignIn");
  const cancelPasskey = () => {
    passkeyAttempt.current?.abort();
    passkeyAttempt.current = null;
    setPasskeyBusy(false);
  };
  useEffect(() => () => passkeyAttempt.current?.abort(), []);
  const complete = async () => {
    await submit();
    toast.success("Preview completed");
    back();
  };
  const common = { brand, onBackToSignIn: back };
  const views = {
    SignIn: (
      <SignIn
        brand={brand}
        onForgotPassword={() => setScreen("ForgotPassword")}
        onResendVerification={() => setScreen("VerificationEmail")}
        onPasskeySignIn={() => setScreen("PasskeyVerification")}
        onSubmit={async () => {
          await submit();
          if (signInFailureCode)
            throw Object.assign(new Error("Verify your email to sign in."), {
              code: signInFailureCode,
            });
          setScreen("PasskeyVerification");
        }}
      />
    ),
    VerificationEmail: <VerificationEmail {...common} onSubmit={submit} />,
    ForgotPassword: (
      <ForgotPassword
        {...common}
        onSubmit={async () => {
          await submit();
          setScreen("ResetLinkSent");
        }}
      />
    ),
    ResetLinkSent: <ResetLinkSent {...common} />,
    PasswordSetup: <PasswordSetup {...common} onSubmit={complete} />,
    FirstPassword: (
      <PasswordSetup {...common} mode="first" onSubmit={complete} />
    ),
    TeamSetup: (
      <TeamSetup
        brand={brand}
        preferenceOptions={preferenceOptions}
        onSubmit={async () => {
          setSetupRequests(setupRequests + 1);
          await complete();
        }}
      />
    ),
    AcceptInvitation: (
      <AcceptInvitation
        {...common}
        teamName="Avgeek"
        role="Member"
        onVerifyEmail={() => setScreen("InvitationVerification")}
      />
    ),
    InvitationVerification: (
      <InvitationVerification
        brand={brand}
        teamName="Avgeek"
        onSubmit={async () => {
          await submit();
          setScreen("FirstPassword");
        }}
      />
    ),
    InvitationUnavailable: <InvitationUnavailable {...common} />,
    PasskeyVerification: (
      <PasskeyVerification
        {...common}
        isPending={passkeyBusy}
        onCancelRequest={cancelPasskey}
        onRecoverySignIn={() => {
          cancelPasskey();
          setScreen("RecoverySignIn");
        }}
        onBackToSignIn={() => {
          cancelPasskey();
          back();
        }}
        onRetry={async () => {
          if (passkeyAttempt.current) return;
          const attempt = new AbortController();
          passkeyAttempt.current = attempt;
          setPasskeyBusy(true);
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (attempt.signal.aborted) return;
          passkeyAttempt.current = null;
          setPasskeyBusy(false);
          toast.danger("Passkey verification was cancelled. Try again.");
        }}
      />
    ),
    RecoverySignIn: <RecoverySignIn {...common} onSubmit={complete} />,
    RecoveryCodesScreen: (
      <RecoveryCodesScreen brand={brand} codes={codes} onContinue={back} />
    ),
  };
  return <div data-setup-requests={setupRequests}>{views[screen]}</div>;
}

export function ConfirmIdentityPreview({
  method = "password",
}: {
  method?: "password" | "passkey";
}) {
  const [open, setOpen] = useState(false);
  const submit = useAuthPreviewSubmit();
  const confirm = async () => {
    await submit();
    toast.success("Preview verified");
    setOpen(false);
  };
  return (
    <div className="p-5">
      <Button onPress={() => setOpen(true)}>Confirm identity</Button>
      {method === "passkey" ? (
        <ConfirmIdentityDialog
          method="passkey"
          isOpen={open}
          onOpenChange={setOpen}
          onConfirm={confirm}
        />
      ) : (
        <ConfirmIdentityDialog
          isOpen={open}
          onOpenChange={setOpen}
          onConfirm={confirm}
        />
      )}
    </div>
  );
}
export function ConsentPreview({
  viewerRole = false,
  slowRequest = false,
}: {
  viewerRole?: boolean;
  slowRequest?: boolean;
}) {
  const [viewer] = useFixtureInput("Viewer role", viewerRole);
  const [slow] = useFixtureInput("Slow authorization", slowRequest);
  const [fail] = useFixtureInput("Authorization failure", false);
  const [accessLevel, setAccessLevel] = useState<"read" | "write" | "admin">(
    "read",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const requestPending = useRef(false);
  async function decide(allow: boolean) {
    if (requestPending.current) return;
    requestPending.current = true;
    setPending(true);
    setError(undefined);
    try {
      if (slow) await new Promise((resolve) => setTimeout(resolve, 1200));
      if (fail) throw new Error("Unable to connect this app. Try again.");
      toast.success(
        allow ? "Preview connection approved" : "Preview connection denied",
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to connect this app.",
      );
    } finally {
      requestPending.current = false;
      setPending(false);
    }
  }
  return (
    <McpAuthorization
      brand={brand}
      productName="Towbar"
      clientName="Example MCP client"
      clientLogo={
        <span aria-hidden className="font-medium">
          C
        </span>
      }
      accessLevel={accessLevel}
      availableAccessLevels={viewer ? ["read"] : ["read", "write", "admin"]}
      onAccessLevelChange={setAccessLevel}
      isPending={pending}
      error={error}
      onApprove={() => void decide(true)}
      onDeny={() => void decide(false)}
    />
  );
}
