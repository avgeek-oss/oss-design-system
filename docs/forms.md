# Forms and feedback

## Input surfaces

Use `Input`, `PasswordInput`, `Textarea`, `Select`, and `InputGroup`. Searchable selection uses `Autocomplete` with `SearchField`; an ordinary choice uses `Select`.

For dates, compose HeroUI `DatePicker`, `DateField.Group` and `Calendar`. Use `DateField` alone for segmented entry without a popover, or `Calendar` for an inline calendar. Date values use `@internationalized/date`; persist a date-only value as an ISO date string. Apply the input surface variant to `DateField.Group`.

Variants for these examples are `primary` and `secondary`. `primary` is the primitive default.

- Base page or auth page → `primary`.
- Widget content → `secondary`.
- Modal or drawer content → `secondary`.

```tsx
<Widget.Content>
  <Input variant="secondary" />
</Widget.Content>
```

These are pattern choices; the base primitives retain HeroUI defaults. Each control has its own variant fixture under `Primitives`. Cosmos patterns preview published components; composed form examples without a matching export are omitted.

Associate labels with controls and descriptions with `aria-describedby`. Keep one focus ring. Selection displays and menu options use `text-sm` (14px) at every breakpoint, including `Select` and `Autocomplete` values. Actual text-entry controls, including `Input`, `Textarea`, `SearchField` and the editable `ComboBox` input, retain HeroUI’s mobile `text-base` (16px) to prevent focus zoom, with `text-sm` from the `sm` breakpoint. Keep native control heights. Preserve long selected values with truncation and keep supplementary offsets in a separate right-aligned slot.

Selectable `ListBox.Item` rows reserve 32px at the inline end for the tick and its gap, including inside picker popovers. Compose a shrinking content wrapper with `min-w-0 flex-1`, truncate the label, and keep trailing metadata `shrink-0`. Do not position metadata over the selection indicator.

`Select`, `ComboBox`, and `Autocomplete` popovers use `--field-radius` plus an 8px inset, making their outer corners slightly rounder than the controls and nested search fields. Keep this shared picker radius instead of adding rounded classes to app popovers. Action menus and standalone contextual popovers retain their own surface treatment.

## Buttons

Use `Button` for actions and `ButtonLink` for navigation. `Button` exposes HeroUI’s native `sm`, `md` and `lg` sizes; the default is `md`.

Choose by purpose:

- Main submit or page action → default primary.
- Destructive operation → `danger` for solid danger, or `danger-soft` for the native soft treatment.
- Cancel or auxiliary action → `secondary`.

```tsx
<Button variant="secondary" onPress={cancel}>Cancel</Button>
<Button type="submit">Save</Button>
```

Do not make Cancel another primary button. Use native HeroUI variants. Chips default to HeroUI’s `soft` variant and retain native `color`, `variant` and `size` props; compose icons and spinners with `Chip.Label`.

## Validation and pending state

`TeamSetup` collects team name, your name, email and password before date/time preferences. Continue validates locally; Complete Setup calls `onSubmit` once with all seven values. The two dots beside the brand mark the current step. Back preserves both steps, and a failed request keeps the preferences screen ready to retry. Apps own the setup API call and success navigation.

`McpAuthorization` presents an already loaded authorization request. Apps map their server response into `McpAuthorizationDetails`, provide permission copy that matches the requested scopes, and supply `onAllow` and `onDeny`. Apps own authentication, fetching, missing/expired requests, approval policy, mutation and redirect validation. Pass `approvalBlockedReason` when the account cannot grant the requested access; approval is disabled while denial remains available. Pass `isPending` during either decision and `error` on failure. Metadata published by a client does not verify the requesting app: always supply an accurate `identityDescription`. Expiry, revocation guidance and administrative restrictions come from the app rather than fixed library policy. The Cosmos fixture simulates decisions without granting access.

`AuthForm` and `NameSettingsForm` show one validation toast and focus the invalid control. Server failures keep the draft and allow retry. Disable the submit action during its request; show a busy label. Never replace the whole page with an empty loading screen when existing data is available.

Submission failures use one danger toast, including inside modals. Keep the draft and dialog open, release the pending state, and allow retry. Do not also render an inline error or alert for the same failed submission. Load failures and persistent access restrictions remain in their owning surface.

`IdentityCredentialsForm` defaults to toast feedback. Its `errorPresentation` option controls field validation only; rejected submissions always use a toast. Field validation can mark/focus the invalid control without duplicating a submission failure.

Mount one `Toast.Provider` for the application, including public auth routes. Use `placement="bottom"` for bottom-center toasts; this is the native HeroUI default and the explicit placement used by AppShell and Cosmos. Toast announcements, timers, stacking, motion, and placement retain HeroUI behavior. The close control is a documented accessibility exception: its 32px target is visible without hover on the front toast, expanded stack rows, and a focused toast. Hidden/exiting rows remain unreachable; collapsed background close controls do not intercept clicks.

The shared provider retains HeroUI's props and native rendering. It restores the connected control that preceded toast focus when the final toast exits and native focus was stranded on the document body. It does not move focus away from a control the user has since chosen, into an inert surface, or into a background browser tab. This keeps an initiating modal usable after pointer or keyboard toast dismissal.

Common identity and team names are trimmed, non-empty and limited to 120 characters; email addresses allow up to 320, and new passwords use 15–1024 characters. Keep API and database constraints aligned with these UI limits.

Use the standard Admin/Member/Viewer roles for common team settings. Apps enforce the permissions behind those roles; rendering a role label does not grant access. `createInvitationSchema` can validate a distinct domain-specific role set when a separate feature requires it.

## Notifications and charts

`NotificationMenu` requires an icon on every row. Use a full-width hover area, a raised red unread badge, and the subtle Mark all as read action. Apps map their API data into the shared `NotificationItem` presentation contract: `id`, `title`, optional `message` and `source`, `href`, `icon`, formatted `time`, optional ISO `dateTime`, and `unread`. Backend event payloads remain app-owned. The menu supplies the theme-aware icon button, badge, popover, row layout, loading/empty states and navigation dismissal.

Use `isOpen` and `onOpenChange` when the app needs to refresh notifications on opening; otherwise the menu owns its open state, with optional `defaultIsOpen`. Opening the menu does not mark notifications read. Return `false` from `onActivate` (synchronously or asynchronously) when another app-owned operation makes activation inapplicable; the menu stays open without a toast. A fulfilled `void` result still dismisses the menu, and a rejected activation remains open with one danger toast. Supply `onMarkAllRead` for the explicit Mark all as read action, with `markingRead` during persistence. A `headerEnd` slot can compose that action with pagination controls; supply `Widget.Action` to retain the standard header style. Do not add Clear All, dismissal, or automatic read timers. Apps own persistence, polling, retention, counts and mutations; follow the [incoming notification contract](patterns.md#incoming-notifications).

`LineChart` supplies consistent axes, line width, colors, and tooltips. Its `Area` part supports filled or stacked series inside the same chart; define a chart-local SVG gradient for a fading fill. The plot margin leaves room for the top Y-axis tick. `Widget.Legend` wraps series within the card. Do not connect missing measurements as real data. Use dashed series for the previous period with `legendType="none"`. Keep each current metric and its previous-period row together in tooltips, with the change before the current value. Use `success-soft-foreground` and `danger-soft-foreground` for change text; fewer errors is an improvement. Format from the tooltip's datum, never by searching for a matching numeric value. Use Enable compare and Disable compare actions. Preserve measurements during refresh without adding refresh text. LineChart owns empty and initial loading states; its Legend, ReferenceLine and Selection parts are optional.

Auth screens are exported from their own files, rather than implemented inside Cosmos. `SignIn`, `ForgotPassword`, `PasswordSetup`, `InvitationVerification` and `RecoverySignIn` retain field validation, loading feedback and draft values when callbacks reject. `PasswordSetup` validates confirmation locally before invoking the app. `ConfirmIdentityDialog` blocks repeat confirmation and closing during pending password confirmations. Its passkey mode can expose an explicit WebAuthn cancellation callback; see the cancellation contract in [patterns.md](patterns.md). Its custom content mode lets the app coordinate multiple verification steps and explicitly permit dismissal when it aborts a WebAuthn request. Applications own successful navigation and modal dismissal. `PasskeyVerification` takes controlled pending state and cancellation actions so the app can abort its WebAuthn request before navigating away. No screen generates recovery codes, stores credentials, contacts an auth API or grants access on its own.

`AuthForm` and `IdentityCredentialsForm` use POST for native submissions, keeping credentials out of URLs when JavaScript has not attached the submit handler. Normal interactive submissions await the app callback and prevent native navigation. This fallback does not create a server endpoint or implement authentication without JavaScript.

`PreferencesSettings` keeps a local draft and calls `onSave` once per submission. After saving, the app updates its `value` prop to the committed preferences. Date/time choices are followed directly by Save; the preview and explanatory footer are omitted. The older `formatPreview` prop is accepted for compatibility but does not render. `PasskeySettings`, `SessionsSettings` and `ApiKeysSettings` take app-owned items and await mutation callbacks; update the items only after the API succeeds. Failures retain the open dialog and draft for retry. Passkey registration and recovery-code generation remain app responsibilities; only the codes returned by the server should be passed into the recovery-code display.

`CodeBlock.CopyButton` retains the visible Copy label and accessible Copy code name. Clipboard writes lock repeat presses immediately, expose native pending state, and unlock for retry after completion. Each completed attempt produces one success or danger toast; an unavailable or denied clipboard keeps the code visible for manual selection. A custom `aria-label` remains stable through success and failure. Copy status is not duplicated inline.

`RecoveryCodes` keeps Copy codes disabled while a clipboard write is pending and blocks repeated presses immediately. Each completed write reports one success or danger toast, retains the codes for manual selection, and enables retry after failure. Download and Continue remain independent actions.

`ActionConfirmation` accepts `confirmLabel` and `cancelLabel` for concrete consequence actions. `SessionsSettings` uses Revoke session and Keep session and explains that the other browser loses access immediately. The current session remains protected from revocation through this settings surface.

`CreateApiKeyDialog` trims the key name before creation. A whitespace-only name produces one danger toast per submission and returns focus to Name, retaining the draft without calling `onCreate`. A corrected name is trimmed and passes through the existing pending guard.

## Verification email

`SignIn` shows the centered **Need a new verification email?** recovery action only after `onSubmit` rejects with an error whose `code` is `EMAIL_NOT_VERIFIED`, and only when `onResendVerification` is supplied. Preserve the server error code in the app adapter; do not detect this condition from message text. Editing the email or beginning another submission clears the recovery action. Navigate to `VerificationEmail`, pass branding and optional `defaultEmail`, and connect its awaited `onSubmit({ email })` callback to the public verification endpoint. The shared sign-in description is account-based and applies to team and personal apps. `AuthScreen` owns its responsive gutters; nesting it in `AuthPage` retains the same spacing as standalone use. Use `BrandLockup` with a 32px mark and the app name for every auth brand, aligned with the heading and fields. Keep the native shared button typography and muted, dashed-underlined `AuthAction` links; do not override them in app CSS. A solo app omits unsupported server capabilities while retaining the same layout and copy. Omit `onForgotPassword`, `onResendVerification` or `onPasskeySignIn` only when the backend does not support that capability; environment-managed credentials must not show a nonfunctional password-reset action. All sign-in navigation actions are disabled during either internal submission or externally controlled pending state. Credentials remain intact while a request is in flight. The shared credentials form clears the password after every completed request and when leaving the page, including browser page caching; it retains the email for retry. This credential lifecycle is shared across apps rather than controlled by an app-specific copy of the form.

`VerificationEmail` retains the draft on failure, shows one toast, blocks duplicate submission and back navigation while sending, and moves focus to its neutral acknowledgment after success. **Request another link** returns to the form with the previous email. Acknowledgment means the server accepted the request, not that an account exists or mail was delivered. Servers must return the same acknowledgment for unknown, already verified and eligible accounts, enforce request throttling and token expiry/one-use rules, and validate callback destinations. Email verification proves address ownership; it is separate from passkey verification and recovery. Apps supply routing and backend policy; do not recreate this screen or replace its fixed copy.

## Pending forms across overlay suspension

`AuthForm.isPending` accepts owner-level pending state when a suspended native portal remounts while its request is still settling. It combines with the form’s own submit lock, disables fields and actions, and prevents a repeat callback. Keep that state above the portal; clear it when the app cancels or settles the request. A current rejected attempt still shows one danger toast. Shared actions and clipboard controls suppress late feedback from an attempt invalidated by `OverlaySuspensionScope` or owner unmount; suspension does not undo server mutations or a completed clipboard write.

`ProfileSettings` and other uses of `NameSettingsForm` retain their name draft and pending lock through a suspended save. Feedback from that invalidated attempt is suppressed after resume or owner unmount; settlement releases only its own request lock. Current failed saves show one danger toast per attempt and remain retryable. Apps still own committed values, cancellation and keyed unmount on account change.

## Display preferences

Use `dateFormatOptions`, `timeFormatOptions` and `defaultDateTimePreferences` from `@avgeek-oss/design-system/utilities/date-time-preferences` in account settings and onboarding. The React-free catalog defines the same five date and four time format IDs for every app. Stored defaults are `day-short-month-year`, `24-hour` and `UTC`. `browserDateTimePreferences` can suggest a supported browser time zone during onboarding; it does not replace stored preferences.

Apps validate and persist these IDs and convert legacy IDs without losing existing choices. Formatting follows the selected display preference. Domain DATE and UTC timestamp serialization remain app-owned wire contracts. Pass the catalog arrays to `DateTimePreferenceFields` along with supported IANA time zones.
