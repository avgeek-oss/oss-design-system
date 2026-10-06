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

Associate labels with controls and descriptions with `aria-describedby`. Keep one focus ring. Editable controls use HeroUI’s responsive typography; no font-size adjustment or compact-height override is applied. Preserve long selected values with truncation and keep supplementary offsets in a separate right-aligned slot.

Selectable `ListBox.Item` rows reserve 32px at the inline end for the tick and its gap, including inside picker popovers. Compose a shrinking content wrapper with `min-w-0 flex-1`, truncate the label, and keep trailing metadata `shrink-0`. Do not position metadata over the selection indicator.

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

Role vocabulary belongs to the app. Use `createInvitationSchema(["admin", "editor", "viewer"])` for Rootset and the existing Admin/Member/Viewer schema for Towbar or Mill. Do not broaden server permissions because the shared table supports another role label.

## Notifications and charts

`NotificationMenu` requires an icon on every row. Use a full-width hover area, a raised red unread badge, and the subtle Mark all as read action. Apps map their API data into the shared `NotificationItem` presentation contract: `id`, `title`, optional `message` and `source`, `href`, `icon`, formatted `time`, optional ISO `dateTime`, and `unread`. Backend event payloads remain app-owned. The menu supplies the theme-aware icon button, badge, popover, row layout, loading/empty states and navigation dismissal.

Use `isOpen` and `onOpenChange` when the app needs to refresh notifications on opening; otherwise the menu owns its open state, with optional `defaultIsOpen`. Opening the menu does not mark notifications read. Supply `onMarkAllRead` for the explicit Mark all as read action, with `markingRead` during persistence. A `headerEnd` slot can compose that action with pagination controls; supply `Widget.Action` to retain the standard header style. Do not add Clear All, dismissal, or automatic read timers. Apps own persistence, polling, retention, counts and mutations; follow the [incoming notification contract](patterns.md#incoming-notifications).

`LineChart` supplies consistent axes, line width, colors, and tooltips. Do not connect missing measurements as real data. Use dashed series for the previous period with `legendType="none"`. Keep each current metric and its previous-period row together in tooltips, with the change before the current value. Use `success-soft-foreground` and `danger-soft-foreground` for change text; fewer errors is an improvement. Format from the tooltip's datum, never by searching for a matching numeric value. Use Enable compare and Disable compare actions. Preserve measurements during refresh without adding refresh text. LineChart owns empty and initial loading states; its Legend, ReferenceLine and Selection parts are optional.

Auth screens are exported from their own files, rather than implemented inside Cosmos. `SignIn`, `ForgotPassword`, `PasswordSetup`, `InvitationVerification` and `RecoverySignIn` retain field validation, loading feedback and draft values when callbacks reject. `PasswordSetup` validates confirmation locally before invoking the app. `ConfirmIdentityDialog` blocks repeat confirmation and closing during pending password confirmations. Its passkey mode can expose an explicit WebAuthn cancellation callback; see the cancellation contract in [patterns.md](patterns.md). Its custom content mode lets the app coordinate multiple verification steps and explicitly permit dismissal when it aborts a WebAuthn request. Applications own successful navigation and modal dismissal. `PasskeyVerification` takes controlled pending state and cancellation actions so the app can abort its WebAuthn request before navigating away. No screen generates recovery codes, stores credentials, contacts an auth API or grants access on its own.

`PreferencesSettings` keeps a local draft and calls `onSave` once per submission. After saving, the app updates its `value` prop to the committed preferences. Apps provide `formatPreview` using their own date policy. `PasskeySettings`, `SessionsSettings` and `ApiKeysSettings` take app-owned items and await mutation callbacks; update the items only after the API succeeds. Failures retain the open dialog and draft for retry. Passkey registration and recovery-code generation remain app responsibilities; only the codes returned by the server should be passed into the recovery-code display.

`CodeBlock.CopyButton` retains the visible Copy label and accessible Copy code name. Clipboard writes lock repeat presses immediately, expose native pending state, and unlock for retry after completion. Each completed attempt produces one success or danger toast; an unavailable or denied clipboard keeps the code visible for manual selection. A custom `aria-label` remains stable through success and failure. Copy status is not duplicated inline.

`RecoveryCodes` keeps Copy codes disabled while a clipboard write is pending and blocks repeated presses immediately. Each completed write reports one success or danger toast, retains the codes for manual selection, and enables retry after failure. Download and Continue remain independent actions.

`ActionConfirmation` accepts `confirmLabel` and `cancelLabel` for concrete consequence actions. `SessionsSettings` uses Revoke session and Keep session and explains that the other browser loses access immediately. The current session remains protected from revocation through this settings surface.

`CreateApiKeyDialog` trims the key name before creation. A whitespace-only name produces one danger toast per submission and returns focus to Name, retaining the draft without calling `onCreate`. A corrected name is trimmed and passes through the existing pending guard.
