# Authentication emails and loading surfaces

Use `@avgeek-oss/design-system/emails/render` in the backend for `renderAuthEmail(template, data)`. It returns `{ subject, html, text }`. This dedicated entry point works in Node without Next.js, a browser, or a UI provider. Do not import email rendering from the UI root barrel.

```ts
import { renderAuthEmail } from "@avgeek-oss/design-system/emails/render";

const message = await renderAuthEmail("password-reset", {
  brand: {
    name: "Example",
    accentColor: "#2d5e44",
    theme: { accentForeground: "#ffffff" },
  },
  actionUrl: resetUrl,
});
await outbox.enqueue({ to: user.email, ...message });
```

The shared templates own headings, paragraphs, action labels and the email shell. Branding is an app name, six-digit hex accent and optional public HTTP(S) logo URL. Pass the application's light theme through `brand.theme`: `surface`, `foreground`, `muted` and `accentForeground` are optional six-digit hex colors with neutral light defaults. Use `accentForeground` for the button text, independently of the email background; a yellow accent needs dark text. The brand name remains visible when remote logo images are blocked. The layout uses inline styles and email-compatible tables, a 560px container, Inter with system fallbacks, a primary action and a plain link fallback. Email colors are explicit because mail clients do not load app theme CSS. All dynamic text is escaped; URL schemes and embedded credentials are checked. Apps must additionally enforce their trusted action origin.

`AuthEmail` and `authEmailTemplates` are exported from `emails/auth-email` for previews. Templates cover invitations and their email verification, account verification, email changes, password resets/changes, passkey or recovery-code changes, account recovery and membership notices. `mfa-changed` retains the existing Towbar identifier but its copy refers only to passkeys and recovery codes. Invocation does not enable any backend feature. Invitation verification accepts a `verificationCode` for code-based joining or an `actionUrl` for link-based joining. This email code proves an invitation address; it is not a sign-in second factor. Optional name, team, role and labeled factual details supply context. Security links last one hour, invitation links seven days and invitation codes ten minutes; the backend must enforce the corresponding lifetime.

Applications own recipients, token generation and hashing, link destinations, expiry, authorization, outbox encryption, cancellation, retries and SMTP credentials. Render both alternatives before enqueueing and preserve the existing delivery constraints. Never put authentication tokens in preview fixtures or logs. Domain notices can use `EmailShell` from `emails/email-shell` and `renderEmailMessage` from `emails/render`; their domain content remains app-owned. Do not recreate a shell or override common auth copy.

Use `LoadingSkeleton` and `SkeletonCard` from the root or `patterns/feedback/loading-skeleton` when initial loading needs visible placeholders. The group owns one accessible busy status and hides decorative cards from assistive technology. Card height and arrangement follow the eventual page; retain headings and navigation, supply meaningful height classes and prevent a false empty state. The shared card owns neutral surfaces, shimmer and reduced-motion behavior. Do not add app-owned animation or color overrides. Use the existing `Skeleton` primitive for individual text/shape placeholders, or `QueryLoading` for an invisible status when a visible skeleton would cause unnecessary layout changes. Apps retain their domain layout and query lifecycle.

Installation setup creates the first administrator as email-verified on the server and proceeds to sign-in or an authenticated session. Apps must refresh cached setup state before navigating; `TeamSetup` awaits the app's mutation but does not own verification policy or routing. Invitations, subsequent accounts and email changes retain their address-verification rules.

SMTP delivery belongs to the app. When the configured sender is a bare address, supply the application name as its display name (for example, `{ name: "Rootset", address: configuredFrom }` in Nodemailer). Preserve an explicitly configured display name. A sender name improves recognition but does not replace SPF, DKIM or DMARC authentication or guarantee inbox delivery.
