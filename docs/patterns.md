# Shared application patterns

Towbar is the baseline for common application surfaces. Use these exports directly so applications share their layout, interaction states, and presentation contracts. Components receive typed UI data and callbacks; applications adapt server responses, enforce permissions, perform requests, and update committed data.

Import components and their props from the package root or the subpath shown in the catalog. Every component has a separate interactive Cosmos fixture. Empty states and simulated failures belong to those fixtures, not to production callbacks.

## Account settings

`EmailChangeSettings` displays the current email and verification status, accepts a new email, and shows a pending change with cancellation. Supply `email`, `isVerified`, optional `pendingChange: { email, expiresAt }`, and request/cancel/resend callbacks. `resendAvailableAt` is a Unix timestamp in milliseconds provided by the app after a successful resend. The component displays the remaining cooldown and disables resending until it expires. Supply `formatDate` to show the pending link's expiry and `error` for a failed data fetch. Email-confirmation token parsing and callback URLs stay in the app. Use `mode="read-only"` when the app cannot change or resend verification; this mode requires no mutation callbacks, keeps the factual verification status, and accepts `children` for provider or administrator guidance.

`PasswordChangeSettings` checks confirmation before calling `onChangePassword`, retains values on failure, and clears password inputs after success. It requires the current password by default. Set `requireCurrentPassword` from the app's authentication policy and supply its minimum/maximum lengths and password guidance. The callback receives `newPassword`, `confirmPassword`, and the current password only when required. The server remains responsible for validating password policy and identity.

`ApiKeysTable` displays an `ApiKey` record: `id`, `name`, nullable `expiresAt`, optional `tokenHint`, permission description, creation/last-use dates, and status. Pass row actions and a date formatter. `ApiKeysSettings` adds awaited revocation with a consequence confirmation; update its items after a successful revoke. Dismissal returns focus to the connected Revoke action including late native row/cell restoration. Recovery ends on new input, focus elsewhere, window blur, reopen or unmount; disconnected openers are skipped. Preserve locally acknowledged revocations when reconciling delayed server responses.

`AuthorizedClientsTable` uses the same credential metadata plus `client: { name, id?, logo?, trust? }`. Client trust is supplied explicitly; a name or logo does not establish trust. Compose revocation with `AsyncActionButton` and app-appropriate consequence copy.

`CreateApiKeyDialog` accepts controlled open state, allowed permission/expiry options, and `onCreate`. It returns the selected option IDs in `CreateApiKeyValues`; the app computes expiry, validates allowed permissions, and retains an idempotency key for retries. Omit `permissionOptions` when keys inherit the account’s access and the API has no selectable permission policy. The dialog then collects only name and expiry, and omits `permission` from its callback values; it never invents a permission option. This branch receives `CreateApiKeyMetadataValues`; the original `CreateApiKeyValues` contract still requires `permission` when options are supplied. An empty permission-options array remains an invalid selection. The callback returns `{ token: string | null }`. A string opens the save-once view; null explains that an earlier request already created the key without revealing its token again. Closing unmounts the form and token display. Never include a raw token in table records, persistent state, fixture logs, or analytics. Use the `children` slot for additional scope controls; the app reads those values in its creation callback.

## Team settings

`MembersTable` displays identity, role, account status, and security status. `Member` accepts `accountStatus` and `securityStatus` as status descriptors; supply Towbar's account readiness and 2FA state without inferring 2FA from passkey presence. Optional `emailVerified` flags an unverified address. The legacy `passkeyEnabled` display is retained for existing consumers that do not supply security status. Supply role options to label the app's allowed roles, and row actions to edit or remove access.

`InviteMemberDialog`, `AddMemberDialog`, and `MemberEditDialog` are separate public components. Each accepts controlled open state and allowed role options. Invitation creation collects email/role and displays the returned invitation URL only after success. The result uses neutral private-link guidance and makes no assumption about email verification or delivery. Supply `resultGuidance` for the actual delivery state or joining requirements. The app owns success toasts and delivery warnings. Direct member creation collects name/email/temporary password/role. Editing collects name and role by default. Set `MemberEditDialog` to `mode="role-only"` when an administrator can change access but cannot edit another person’s profile; its callback receives only `{ role }`. Failed requests keep the dialog and draft open. Apps own last-admin rules, identity verification, temporary-password policy, and access-revocation consequences.

`InvitationsTable` displays an email-based `UserAvatar`, optional name, email, role, expiry, and optional status. `MembersTable.currentUserId` labels the matching identity as “(you)” without altering the underlying member name. Supply copy-link, resend, and revoke callbacks for the corresponding actions, or compose custom row actions. Resend confirms that the previous link will stop working; revocation confirms that the selected invitation will no longer work. The app filters expired/revoked invitations and supplies a date formatter.

## History and filters

Use `HistoryTable` when a resource list needs history pagination and loading/error/filter states. Use `ResourceTable` for a plain record list without those behaviors. History records only require an `id`; columns describe their actual fields, so audit events and delivery attempts need not share a backend payload. `HistoryPagination` accepts a one-based page and either a known total or previous/next availability. During refresh, existing rows remain visible and page changes are blocked. Retry is an app callback. Cursor encoding, fetching, polling, and filter serialization stay in the app.

`HistorySearch` submits a trimmed search and resets it immediately when cleared. `HistoryFilter` selects one option with optional search, icons, and trailing metadata. The empty string represents All; option IDs must not use the reserved `all` ID. Both controls compose above `HistoryTable`.

`EventDetailsDialog` accepts `EventDetailField` records with stable IDs, labels, values, and optional copying. Use `EventDetail` children when additional detail content needs composition. Copying is available only for string values. Long values wrap inside the dialog.

`FilterDialog` maintains a draft until Apply; Cancel preserves the committed conditions. Define each field's label, allowed operators, input constraints, and whether it is searchable. Operators with `multiple: true` use a multi-value picker when a `getOptions` callback is supplied. Single-value operators use an input. The app defines operator meanings and implements search. Selected values remain available when suggestions change, stale search responses are ignored, and duplicate conditions are removed on Apply. Supply stable `getOptions` and `renderOption` callbacks. No field or operator is inferred from a project's API.

## Incoming notifications

`NotificationMenu` presents the notification trigger, badge, popover and rows. Use the explicit **Mark all as read** action. Opening the menu only refreshes it; it does not acknowledge or delete events. Notification read state belongs to the server, not local storage.

Applications follow this shared contract:

- Event records have stable `id`, workspace scope, `occurredAt` and `createdAt`, plus domain-specific type/payload. Map those records into `NotificationItem`; the UI package does not import a backend schema.
- Read receipts are scoped by workspace, authenticated user and event, with an immutable `readAt`. Store them durably so different browsers/devices share the same read state. One user's action must not acknowledge another user's feed.
- The feed includes every unread event regardless of age and read events whose `readAt` is within the preceding 24 hours. This is a presentation filter, not deletion of event, delivery or audit history. Retain receipts after rows age out so they cannot reappear unread.
- List responses contain `notifications` with nullable `readAt`, total `unreadCount` independent of page size, and nullable `nextCursor`. Use bounded cursor pages with stable timestamp/ID ordering, preserving database timestamp precision. Provide access to every eligible event, rather than permanently limiting the feed to the latest 20 or 50 rows.
- Mark-all is an idempotent server mutation scoped from the authenticated session. It marks the events visible to its database snapshot, leaves later arrivals unread and preserves existing receipt times on retries. It takes no caller-supplied user or workspace identity. It never deletes notifications.

Towbar implements these responsibilities in its notification-center API and receipt table. Consumers use their own database/API adapters and authorization rules. The shared `onMarkAllRead` callback requests persistence; `markingRead` blocks repeated presses. Supply the server's total unread count and `unread: readAt === null` for rows. Preserve committed rows on a failed refresh; failed mutations use one bottom-center toast.

`dialogRef` optionally receives the native `Popover.Dialog` element. Use it when an app-owned refresh or pagination action must move focus before disabling its initiating control. Capture whether that control actually held focus, focus the dialog before changing pending state, and restore the control only if the same dialog is still connected and still holds focus. A closed or reopened menu, a disconnected control, or a deliberate focus move elsewhere must cancel that restoration. Omit the ref when native popover focus handling is sufficient. Read/unread text can use the existing `NotificationItem.source`; only supply a status known from server data.

`onActivate` awaits an app-owned action, locks repeated ordinary clicks and keyboard activation, and reports a rejection through one toast while retaining the menu. Modified link clicks retain native navigation. Opening the menu never invokes activation. The app owns navigation and must ignore obsolete asynchronous results after its menu session or route changes; the shared menu likewise prevents an old completion from closing a reopened popover.

## Notification settings

`NotificationDestinationsSettings` is the configuration surface for outgoing notifications; `NotificationMenu` displays incoming notifications. A destination supplies `id`, `label`, optional description/icon, and subscriptions keyed by category ID. Each category declares a label and allowed modes: `off`, `all`, or `failures`. Two-mode categories render checkboxes; failure-aware categories render All/Failures only choices and Clear when Off is allowed.

`onSubscriptionChange` receives the destination, category ID, and next mode. Update controlled items after persistence succeeds; failures retain the previous selection. Subscription controls are disabled during a request. Optional test and removal callbacks use consequence confirmations. Compose provider-specific setup content through toolbar/children slots.

`AddNotificationDestinationDialog` collects provider-specific fields supplied as `AuthField` definitions and awaits `onAdd`. The app normalizes and validates addresses, channel IDs, chat IDs, or webhook routes and checks destination limits/duplicates. Category definitions should describe the application's actual event types.

## Integrations and operations

`IntegrationConnectionCard` represents one provider connection. Pass provider identity, a nullable connection with status/details, connection actions, and accurate disconnect consequences. A disconnected card renders the connect state. Compose multiple cards for providers with multiple installations; OAuth redirects and callback validation stay in the app.

`OperationProgress` displays an ordered list of `OperationStep` records. Each step has an ID, title, description, and one of `waiting`, `running`, `succeeded`, `failed`, `skipped`, or `cancelled`. Details are supplied as children. `OperationProgress` expands failed steps with details initially; waiting steps cannot expand. Use `ProgressChecklistItem` inside an `Accordion` when custom surrounding composition is needed; set expansion state on the surrounding Accordion through its native `defaultExpandedKeys` or `expandedKeys` API. Optional step links use the shared router. The app maps operation events, formats timing, supplies logs, and handles polling/retries. This is background operation progress, not form-step navigation.

## Shared feedback and actions

`StatusIndicator` accepts a visible label, semantic Chip color, optional icon, and tooltip description. Apps map domain statuses into this `StatusDescriptor`; the library does not interpret strings such as `running` or `active`.

`AsyncActionButton` awaits an action, locks repeated presses, and reports failure through one danger toast. Shared form submissions, key creation, notification subscriptions, and confirmation actions use the same toast-only failure contract. Supply `confirmation` for a consequence dialog or use `ActionConfirmation` directly with controlled open state. Confirmation stays open on failure and cannot be dismissed during a request. Callbacks should reject on failure and resolve only when the operation succeeds; do not catch a failed request and return apparent success. Apps own cache refresh, permission checks, success navigation, and optional success feedback. Mount one bottom-center `Toast.Provider` for the application, including routes outside AppShell.

`QueryLoading` announces initial loading with a visually hidden `role="status"` by default, matching Towbar. It occupies no page layout space and remains in the accessibility tree. Supply descriptive children for the view being loaded. A deliberately visible progress message can opt in through `className="not-sr-only text-sm text-muted"`; use that only when visible progress helps the user, rather than for ordinary initial query loading. `QueryError` displays the supplied failure and optional retry callback. Keep stale data visible during background refresh instead of replacing it with initial loading.

`ChoiceField` renders a secondary-surface choice with labels, optional descriptions/icons, and selection-indicator spacing. Use it for role, permission, and expiry choices within patterns. Use native `Select` directly for other composition requirements.

## Authentication capabilities

`SignIn.isPending` disables the credential form, forgot-password action, and optional passkey action while an app-owned authentication request is running. Existing credential drafts remain intact. `PasskeyVerification` renders the passkey recovery fallback when `onRecoverySignIn` is supplied. `onAuthenticatorSignIn` is deprecated compatibility for older consumers; new integrations use passkeys only. Fallbacks and retry are disabled during the WebAuthn request; cancellation and back navigation remain available so the app can abort the ceremony.

Use `ConfirmIdentityDialog` with `method="custom"` and `children` for an app-owned multi-step password, passkey, or passkey recovery ceremony. The app owns field submission, pending state, retry, failure toasts, step-up verification, and mutation completion. `isPending` blocks dismissal by default. Set `isDismissDisabled={false}` only when dismissal aborts the pending request safely; the app must perform that cancellation in `onOpenChange`. The existing password/passkey modes retain their awaited callback behavior.

`McpAuthorization.isDisabled` blocks both decisions without representing a pending request. Use it after an uncertain or malformed decision acknowledgement when the app cannot safely replay a one-time grant. `approvalBlockedReason` remains the separate policy condition that blocks approval while permitting denial.

`PasskeySettings.onRename` and `onReplaceRecoveryCodes` are optional capabilities. Unsupported actions are omitted. Recovery replacement appears only when that callback is supplied and the passkey list is nonempty; applications whose recovery policy depends on another factor should compose their recovery action with that factor’s settings instead. To display newly generated codes, pass both `recoveryCodes` and `onDismissRecoveryCodes`; never reconstruct old codes from stored hashes. All callbacks resolve only after the server operation completes.

Use `ProfileImageSettings` beside `ProfileSettings` for the common Gravatar appearance surface. Apps supply the signed-in email and name; the component owns the external profile link and standard instructions.

Use `InvitationPasswordSetup` when a private invitation link establishes the invited identity and the server expects name/password registration. Use `AcceptInvitation` and `InvitationVerification` when the server requires email-code verification first. Do not display a verification method that the app does not implement.

Use `PasskeyRecoveryVerification` after the password has already passed and the server holds a pending passkey challenge. It collects only the recovery code. `RecoverySignIn` is for a server accepting credentials and recovery code together. Apps must bind recovery to the correct pending sign-in, consume the code exactly once and retain the password/passkey gate; these components do not establish authentication.

`ConfirmIdentityDialog` with `method="passkey"` accepts optional `onCancelRequest`. When supplied, Cancel stays enabled during the ceremony, invokes cancellation, then requests dismissal. The app must abort WebAuthn before dismissal, handle deliberate cancellation without an error toast, and avoid supplying this callback during an irreversible mutation. Other pending confirmations remain protected from dismissal.

Use `RemoveMemberDialog` and `RevokeInvitationDialog` for the standard team confirmations. Apps enforce permissions and last-administrator protections, supply identity/email and await the real mutation. Rejection retains the dialog for retry with one toast. These surfaces describe access removal without promising deletion of historical work.

Use `TeamGeneralSettings` for general team identity. Supply the saved name and callback; set `mode="details"` only when the server supports a description. Apps retain name limits, permissions, persistence and identity refresh. Do not show unsupported fields.
