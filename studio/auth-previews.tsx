import { useRef, useState, useEffect } from "react";
import { useFixtureInput } from "react-cosmos/client";
import { preferenceOptions } from "./preference-options";
import { BrandLockup } from "../src/media/brand-lockup";
import { AvgeekLogo } from "./avgeek-brand";
import { Button } from "../src/buttons/button";
import { toast } from "../src/overlays/toast";
import { SignIn } from "../src/patterns/auth/sign-in";
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

export function AuthPreview({ initial }: { initial: AuthPreviewScreen }) {
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
        onPasskeySignIn={() => setScreen("PasskeyVerification")}
        onSubmit={async () => {
          await submit();
          setScreen("PasskeyVerification");
        }}
      />
    ),
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
export function ConsentPreview() {
  const [write] = useFixtureInput("Edit access", false);
  const [unverified] = useFixtureInput("Unverified client", false);
  const [viewer] = useFixtureInput("Viewer role", false);
  const [localApp] = useFixtureInput("Local app", false);
  const [slow] = useFixtureInput("Slow authorization", false);
  const [fail] = useFixtureInput("Authorization failure", false);
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
      setError((cause as Error).message);
    } finally {
      requestPending.current = false;
      setPending(false);
    }
  }
  return (
    <McpAuthorization
      brand={brand}
      productName="Towbar"
      details={{
        clientName: "Example MCP client",
        clientId: unverified
          ? "example-mcp-client"
          : "https://client.example.test/.well-known/oauth-client.json",
        clientLogo: (
          <span
            aria-hidden
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-default font-medium"
          >
            C
          </span>
        ),
        clientTrust: unverified ? "unverified" : "metadata-document",
        identityDescription: unverified
          ? "The app supplied its own name. Towbar has not verified its identity."
          : "App details published by client.example.test. This does not verify the app making this request.",
        redirectUri: localApp
          ? "http://127.0.0.1:54321/callback"
          : "https://client.example.test/oauth/callback",
        account: {
          name: "Alex Morgan",
          email: "alex@example.test",
          teamName: "Avgeek",
          role: viewer ? "Viewer" : "Admin",
        },
        permissionSummary: `Wants to ${write ? "read and edit" : "read"} your Towbar data.`,
        accessDescription: `${write ? "Can view and make changes allowed by your Towbar role, including updating secrets." : "Can only view data allowed by your Towbar role."} Cannot manage accounts or reveal stored credentials.`,
        accessLifetime: "30 days",
        revocationDescription: "Revoke it anytime in your personal API keys.",
        restrictions: "Administrative access is excluded.",
        deviceConnectionNotice: localApp
          ? "This opens an app on your device. Only continue if you started this connection yourself."
          : undefined,
      }}
      isPending={pending}
      error={error}
      approvalBlockedReason={
        write && viewer
          ? "Your Viewer role cannot grant edit access. Reconnect with read-only access."
          : undefined
      }
      onAllow={() => void decide(true)}
      onDeny={() => void decide(false)}
    />
  );
}
