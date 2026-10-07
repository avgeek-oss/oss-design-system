import {
  EmailShell,
  type EmailBrand,
  type EmailDetail,
  type EmailMessage,
} from "./email-shell.js";
export const authEmailTemplates = [
  "invitation",
  "invitation-verification",
  "email-verification",
  "email-change-verification",
  "email-changed",
  "account-created",
  "invitation-accepted",
  "role-changed",
  "access-removed",
  "password-reset",
  "password-changed",
  "mfa-changed",
  "account-recovery",
] as const;
export type AuthEmailTemplate = (typeof authEmailTemplates)[number];
export type AuthEmailData = {
  brand: EmailBrand;
  name?: string;
  teamName?: string;
  actionUrl?: string;
  role?: string;
  verificationCode?: string;
  details?: readonly EmailDetail[];
};
export function authEmailMessage(
  template: AuthEmailTemplate,
  data: AuthEmailData,
): EmailMessage {
  const role =
    data.role === "admin"
      ? "Admin"
      : data.role === "viewer"
        ? "Viewer"
        : "Member";
  const access =
    data.role === "admin"
      ? "Manage the team and its resources."
      : data.role === "viewer"
        ? "View team resources."
        : "Create and update team resources.";
  const team = data.teamName ?? data.brand.name;
  const app = data.brand.name;
  const messages: Record<
    AuthEmailTemplate,
    Pick<EmailMessage, "title" | "paragraphs" | "actionLabel">
  > = {
    invitation: {
      title: `Join ${team}`,
      paragraphs: [
        `You have been invited to ${team}${data.role ? ` as ${role}` : ""}.`,
        ...(data.role ? [access] : []),
        "This invitation expires in seven days. Verify your email to join. If you weren't expecting it, you can ignore this message.",
      ],
      actionLabel: "View invitation",
    },
    "invitation-verification": {
      title: "Verify your email",
      actionLabel: "Verify email",
      paragraphs: [
        data.verificationCode
          ? `Enter this code in ${app} to finish joining your team. It expires in 10 minutes. If you didn't request it, ignore this email.`
          : "Confirm this email address to finish joining your team. If you didn't request it, ignore this email.",
      ],
    },
    "email-verification": {
      title: "Verify your email",
      paragraphs: [
        `Confirm this email address for your ${app} account. This link expires in one hour.`,
      ],
      actionLabel: "Verify email",
    },
    "email-change-verification": {
      title: "Confirm your new email address",
      paragraphs: [
        `Confirm this address to update the email you use to sign in to ${app}. Your current email stays active until you confirm.`,
        "This link expires in one hour and can be used once. If you did not request this change, ignore this email.",
      ],
      actionLabel: "Confirm email change",
    },
    "email-changed": {
      title: "Your sign-in email was changed",
      paragraphs: [
        `The email address for your ${app} account has been updated.`,
        "If you did not make this change, contact your installation operator immediately.",
      ],
      actionLabel: `Open ${app}`,
    },
    "account-created": {
      title: `Your ${team} account is ready`,
      paragraphs: [
        `An administrator created your account with ${role} access.`,
        access,
        "Ask your administrator for your temporary password through a secure channel. You will choose a new password when you first sign in.",
      ],
      actionLabel: "Sign in",
    },
    "invitation-accepted": {
      title: "A new member joined",
      paragraphs: [
        `${data.name ?? "A team member"} accepted an invitation to ${team} as ${role}.`,
      ],
    },
    "role-changed": {
      title: "Your team access changed",
      paragraphs: [
        `Your role in ${team} is now ${role}.`,
        access,
        "Personal API keys remain limited to their original grants and your current access. Removed permissions are not restored by a later promotion.",
      ],
    },
    "access-removed": {
      title: "Your team access was removed",
      paragraphs: [
        `Your access to ${team} has been removed. Your sessions and personal API keys have been revoked. Contact a team administrator if this was unexpected.`,
      ],
    },
    "password-reset": {
      title: "Reset your password",
      paragraphs: [
        `Use this link to choose a new ${app} password. It expires in one hour and can be used once. If you didn't request a reset, you can ignore this email.`,
      ],
      actionLabel: "Reset password",
    },
    "password-changed": {
      title: "Your password changed",
      paragraphs: [
        `Your ${app} password was changed. If you didn't make this change, contact your installation operator and recover your account immediately.`,
      ],
      actionLabel: "Open account security",
    },
    "account-recovery": {
      title: "Your account was recovered",
      paragraphs: [
        "Your installation operator performed account recovery. Review your security settings before reconnecting integrations.",
      ],
      actionLabel: "Review account security",
    },
    "mfa-changed": {
      title: "Your account security changed",
      paragraphs: [
        "Your passkeys or recovery codes were changed. If you didn't make this change, contact your installation operator immediately.",
      ],
      actionLabel: "Review account security",
    },
  };
  return {
    ...messages[template],
    name: data.name,
    details: data.details,
    teamName: team,
    actionUrl: data.actionUrl,
    code:
      template === "invitation-verification"
        ? data.verificationCode
        : undefined,
  };
}
export interface AuthEmailProps {
  template: AuthEmailTemplate;
  data: AuthEmailData;
}
export function AuthEmail({ template, data }: AuthEmailProps) {
  return (
    <EmailShell brand={data.brand} message={authEmailMessage(template, data)} />
  );
}
