import { render } from "react-email";
import { EmailShell, type EmailShellProps } from "./email-shell.js";
import {
  authEmailMessage,
  type AuthEmailTemplate,
  type AuthEmailData,
} from "./auth-email.js";
export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}
export async function renderEmailMessage({
  brand,
  message,
}: EmailShellProps): Promise<RenderedEmail> {
  const html = await render(<EmailShell brand={brand} message={message} />);
  const text = [
    ...(message.name ? [`Hello ${message.name},`] : []),
    ...message.paragraphs.map((p) => (/[.!?]$/.test(p.trim()) ? p : `${p}.`)),
    ...(message.details ?? []).map(
      (detail) =>
        `${detail.label}: ${detail.value}${detail.href ? ` (${detail.href})` : ""}`,
    ),
    message.code ? `Verification code: ${message.code}` : null,
    message.actionUrl
      ? `${message.actionLabel ?? `Open ${brand.name}`}: ${message.actionUrl}`
      : null,
    message.teamName,
    brand.name,
  ]
    .filter((part) => part != null)
    .join("\n\n");
  return {
    subject: `[${brand.name}] ${message.title}`
      .replace(/[\r\n]/g, " ")
      .slice(0, 200),
    html,
    text,
  };
}
export function renderAuthEmail(
  template: AuthEmailTemplate,
  data: AuthEmailData,
): Promise<RenderedEmail> {
  return renderEmailMessage({
    brand: data.brand,
    message: authEmailMessage(template, data),
  });
}
