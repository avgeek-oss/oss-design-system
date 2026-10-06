"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { Button } from "../../buttons/button.js";
import { Alert } from "../../feedback/alert.js";
import { toast } from "../../overlays/toast.js";

export type McpAuthorizationDetails = {
  clientName: string;
  clientId: string;
  clientLogo?: ReactNode;
  clientTrust: "metadata-document" | "unverified";
  identityDescription: ReactNode;
  redirectUri: string;
  account: { name?: string; email: string; teamName?: string; role?: string };
  permissionSummary: ReactNode;
  accessDescription: ReactNode;
  accessLifetime: ReactNode;
  revocationDescription: ReactNode;
  restrictions: ReactNode;
  deviceConnectionNotice?: ReactNode;
};

export type McpAuthorizationProps = {
  brand: ReactNode;
  productName: string;
  details: McpAuthorizationDetails;
  isPending?: boolean;
  error?: ReactNode;
  approvalBlockedReason?: ReactNode;
  onAllow: () => void;
  onDeny: () => void;
  children?: ReactNode;
};

export function McpAuthorization({
  brand,
  productName,
  details,
  isPending = false,
  error,
  approvalBlockedReason,
  onAllow,
  onDeny,
  children,
}: McpAuthorizationProps) {
  const reportedError = useRef<ReactNode>(undefined);
  useEffect(() => {
    if (error != null && error !== reportedError.current) toast.danger(error);
    reportedError.current = error;
  }, [error]);
  const approvalBlocked = approvalBlockedReason != null;
  return (
    <AuthScreen
      brand={brand}
      title={`Connect to ${productName}`}
      description="Choose whether to give this app access."
    >
      <form
        className="grid min-w-0 gap-6 text-sm"
        aria-busy={isPending}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending && !approvalBlocked) onAllow();
        }}
      >
        <div className="grid gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {details.clientLogo}
            <span className="min-w-0 break-words text-base font-medium">
              {details.clientName}
            </span>
          </div>
          <p className="text-muted">{details.permissionSummary}</p>
        </div>
        {details.clientTrust === "unverified" && (
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                Unverified app. Only continue if you recognize this app and
                started this connection yourself.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        <div className="grid gap-3">
          <div>
            <p>
              Signed in as{" "}
              <strong className="break-all">{details.account.email}</strong>
              {details.account.teamName
                ? ` in ${details.account.teamName}`
                : ""}
              .
            </p>
            {(details.account.name || details.account.role) && (
              <p className="text-muted">
                {[details.account.name, details.account.role]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <p>{details.accessDescription}</p>
          <p>
            Access expires in <strong>{details.accessLifetime}</strong>.{" "}
            {details.revocationDescription}
          </p>
          {details.deviceConnectionNotice && (
            <p className="text-muted">{details.deviceConnectionNotice}</p>
          )}
        </div>
        <details className="min-w-0">
          <summary className="w-fit cursor-pointer text-muted underline decoration-dashed underline-offset-2 hover:text-foreground">
            Connection details
          </summary>
          <div className="grid gap-3 pt-3 text-muted">
            <p>{details.identityDescription}</p>
            <dl className="grid min-w-0 gap-3">
              <div>
                <dt className="font-medium">Client ID</dt>
                <dd className="break-all">{details.clientId}</dd>
              </div>
              <div>
                <dt className="font-medium">Return URL</dt>
                <dd className="break-all">{details.redirectUri}</dd>
              </div>
            </dl>
            <p>{details.restrictions}</p>
          </div>
        </details>
        {children}
        {approvalBlocked && (
          <p role="alert" className="text-sm text-danger-soft-foreground">
            {approvalBlockedReason}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            isDisabled={isPending || approvalBlocked}
            isPending={isPending}
          >
            Allow access
          </Button>
          <Button
            type="button"
            variant="secondary"
            isDisabled={isPending}
            onPress={onDeny}
          >
            Deny
          </Button>
        </div>
      </form>
    </AuthScreen>
  );
}
