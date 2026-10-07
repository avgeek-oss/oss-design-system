# Component catalog

Cosmos follows three layers:

- **Primitives:** one fixture per component file, showing its variants, states and compound parts with neutral content. Fixtures import the component directly from `src`; they do not reimplement its styling or contain application workflows.
- **Patterns:** published authentication, account settings, team settings and data components. Fixtures supply sample data and simulate app callbacks; composed examples without a matching library export are omitted.
- **Layouts:** shell, sidebars, page headings and navigation.

Cosmos mirrors the component folders: `src/forms/checkbox.tsx` appears at `Primitives / Forms / Checkbox`, and `src/data-display/chip.tsx` at `Primitives / DataDisplay / Chip`. HeroUI-backed primitives follow native styling and variant APIs; composed helpers retain their behavior without restyling the base component. `UserAvatar` belongs to Patterns, where it supplies initials and Gravatar lookup. `ResourceTable` appears under Patterns and composes the Table primitive with record links, actions and an empty state. Its source is [src/patterns/resource-table.tsx](../src/patterns/resource-table.tsx). Source-file mapping is listed below. Applications use that component export directly; fixture wrappers are only for the studio and are not published.

`NotificationMenu` is the shared notification trigger and popover in [src/patterns/notifications.tsx](../src/patterns/notifications.tsx), previewed under `Patterns / NotificationMenu`. Import it from the package root or `@avgeek-oss/design-system/patterns/notifications`. Apps supply notification items and mutations; the component owns presentation, navigation dismissal, and controlled or uncontrolled open state.

Use optional `onActivate(item)` when ordinary notification navigation must await an app mutation. The callback owns the read request and navigation: await the real backend result, then navigate. The menu prevents default ordinary navigation, locks duplicate requests immediately, announces the pending row, and closes only after callback success. Rejection shows one danger toast and retains the menu for retry; throw the meaningful failure instead of also displaying it in the callback. A settled callback does not close a later popover session. Opening the menu never invokes the callback. Modified and new-tab clicks stay native links and bypass mutation; without `onActivate`, ordinary links retain `RouteLink` navigation.

`emptyContent` replaces the default empty area, for example an app-owned retry control after an initial query failure. `footer` composes pagination or retry controls below existing records; use `Widget.Action` for inline footer actions. Apps own query feedback, retry state, loading, pagination, read state, and retention. Keep loaded records when a page request fails and report failures with a toast; do not pass an empty array to disguise a failed fetch as a successful empty result. `headerEnd` remains available for custom header actions. The default read-all caption is “Mark all as read”.

`TeamSetup` is the two-step onboarding pattern in [src/patterns/auth/team-setup.tsx](../src/patterns/auth/team-setup.tsx), previewed under `Patterns / Auth / TeamSetup`. Import it from the package root or `@avgeek-oss/design-system/patterns/auth/team-setup` and supply one setup mutation.

`McpAuthorization` is the connection approval pattern in [src/patterns/auth/mcp-authorization.tsx](../src/patterns/auth/mcp-authorization.tsx), previewed under `Patterns / Auth / McpAuthorization`. Import it from the package root or `@avgeek-oss/design-system/patterns/auth/mcp-authorization`. It accepts the client identity and trust, account and team, permission and access descriptions, expiry and revocation guidance, return URL and restrictions. Cosmos controls cover read/edit permissions, unverified clients, Viewer restrictions, local apps, pending requests and failures.

Authentication screens are published components. Cosmos uses a separate fixture file for each under `Patterns / Auth`, matching `src/patterns/auth`. Screens accept a brand and app callbacks; fixtures only simulate requests and navigation. Import a screen from the package root or its `patterns/auth/<file>` subpath.

| Component                | Source                                                                                            | App callbacks and data                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SignIn`                 | [src/patterns/auth/sign-in.tsx](../src/patterns/auth/sign-in.tsx)                                 | Credential submission, externally controlled pending state, forgot-password navigation, optional verification-email navigation and passkey sign-in.     |
| `VerificationEmail`      | [src/patterns/auth/verification-email.tsx](../src/patterns/auth/verification-email.tsx)           | Verification link request, neutral acknowledgment, retry and back navigation.                                                                           |
| `EmailConfirmation`      | [src/patterns/auth/email-confirmation.tsx](../src/patterns/auth/email-confirmation.tsx)           | Controlled confirmation-link state, explicit confirmation/retry callbacks, and back navigation. Applications own token validation and success feedback. |
| `ForgotPassword`         | [src/patterns/auth/forgot-password.tsx](../src/patterns/auth/forgot-password.tsx)                 | Email submission and back navigation.                                                                                                                   |
| `ResetLinkSent`          | [src/patterns/auth/reset-link-sent.tsx](../src/patterns/auth/reset-link-sent.tsx)                 | Back navigation; neutral confirmation copy protects account privacy.                                                                                    |
| `PasswordSetup`          | [src/patterns/auth/password-setup.tsx](../src/patterns/auth/password-setup.tsx)                   | Reset/first-password variants, app password policy and submission. Matching passwords are checked before the callback.                                  |
| `AcceptInvitation`       | [src/patterns/auth/accept-invitation.tsx](../src/patterns/auth/accept-invitation.tsx)             | Team name, role, verification action and pending state.                                                                                                 |
| `InvitationVerification` | [src/patterns/auth/invitation-verification.tsx](../src/patterns/auth/invitation-verification.tsx) | Team name, name length limit, verification submission and optional resend with server cooldown.                                                         |
| `InvitationUnavailable`  | [src/patterns/auth/invitation-unavailable.tsx](../src/patterns/auth/invitation-unavailable.tsx)   | Back navigation and optional reason copy.                                                                                                               |
| `PasskeyVerification`    | [src/patterns/auth/passkey-verification.tsx](../src/patterns/auth/passkey-verification.tsx)       | Pending state, retry, cancellation, optional passkey recovery fallback and back actions. The app owns the WebAuthn ceremony.                            |
| `RecoverySignIn`         | [src/patterns/auth/recovery-sign-in.tsx](../src/patterns/auth/recovery-sign-in.tsx)               | Email, password and recovery-code submission.                                                                                                           |
| `RecoveryCodesScreen`    | [src/patterns/auth/recovery-codes-screen.tsx](../src/patterns/auth/recovery-codes-screen.tsx)     | Newly generated codes, download filename and continue action. `RecoveryCodes` remains the content component for settings modals.                        |
| `ConfirmIdentityDialog`  | [src/patterns/auth/confirm-identity-dialog.tsx](../src/patterns/auth/confirm-identity-dialog.tsx) | Controlled open state, password/passkey callbacks or custom app-owned verification content. The app closes it on success.                               |

Account settings live under `Patterns / Account Settings`, matching `src/patterns/account-settings`. Import them from the package root or `patterns/account-settings/<file>`. Apps own saved data, API calls and WebAuthn; the components supply forms, dialogs and pending/error feedback.

| Component             | Source                                                                                | App callbacks and data                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProfileSettings`     | [profile-settings.tsx](../src/patterns/account-settings/profile-settings.tsx)         | Name, label, length limit and save callback. Default and Held save fixture variants cover normal use and suspension/owner changes.                                     |
| `PreferencesSettings` | [preferences-settings.tsx](../src/patterns/account-settings/preferences-settings.tsx) | Saved preferences, format/time-zone options, optional preview formatter and save callback.                                                                             |
| `PasskeySettings`     | [passkey-settings.tsx](../src/patterns/account-settings/passkey-settings.tsx)         | Passkeys, date formatter, add/remove callbacks, optional rename and recovery-code replacement/display callbacks. Default and empty are variants of the same component. |
| `SessionsSettings`    | [sessions-settings.tsx](../src/patterns/account-settings/sessions-settings.tsx)       | Sessions, date formatter and revoke callback. The current session cannot be revoked here.                                                                              |
| `ApiKeysSettings`     | [api-keys-settings.tsx](../src/patterns/account-settings/api-keys-settings.tsx)       | Credential metadata, date formatter, optional actions and revoke callback.                                                                                             |

The `MembersTable` preview lives under `Patterns / Team Settings`, matching [src/patterns/team-settings/members-table.tsx](../src/patterns/team-settings/members-table.tsx). Its items and row-action slot come from the app. The preview uses the standard Admin/Member/Viewer roles. `MembersTable` is also exported through `patterns/settings/tables`.

The additional shared application patterns follow Towbar's common surfaces. Their typed data contracts, callback behavior, and boundaries are documented in [Shared application patterns](patterns.md). Each has its own fixture under the matching Patterns folder and is exported from the package root and the subpath below.

| Components                               | Public subpath                                                       |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `EmailChangeSettings`                    | `patterns/account-settings/email-change-settings`                    |
| `PasswordChangeSettings`                 | `patterns/account-settings/password-change-settings`                 |
| `ApiKeysTable`, `AuthorizedClientsTable` | `patterns/account-settings/api-keys-table`                           |
| `CreateApiKeyDialog`                     | `patterns/account-settings/create-api-key-dialog`                    |
| `InvitationsTable`                       | `patterns/team-settings/invitations-table`                           |
| `InviteMemberDialog`                     | `patterns/team-settings/invite-member-dialog`                        |
| `AddMemberDialog`                        | `patterns/team-settings/add-member-dialog`                           |
| `MemberEditDialog`                       | `patterns/team-settings/member-edit-dialog`                          |
| `HistoryTable`                           | `patterns/history/history-table`                                     |
| `HistorySearch`                          | `patterns/history/history-search`                                    |
| `HistoryFilter`                          | `patterns/history/history-filter`                                    |
| `EventDetailsDialog`, `EventDetail`      | `patterns/history/event-details-dialog`                              |
| `FilterDialog`                           | `patterns/filters/filter-dialog`                                     |
| `NotificationDestinationsSettings`       | `patterns/notification-settings/notification-destinations-settings`  |
| `AddNotificationDestinationDialog`       | `patterns/notification-settings/add-notification-destination-dialog` |
| `IntegrationConnectionCard`              | `patterns/integrations/integration-connection-card`                  |
| `OperationProgress`                      | `patterns/operations/operation-progress`                             |
| `ProgressChecklistItem`                  | `patterns/operations/progress-checklist-item`                        |
| `StatusIndicator`                        | `patterns/status-indicator`                                          |
| `AsyncActionButton`                      | `patterns/actions/async-action-button`                               |
| `ActionConfirmation`                     | `patterns/actions/action-confirmation`                               |
| `QueryLoading`, `QueryError`             | `patterns/feedback/query-state`                                      |
| `ChoiceField`                            | `patterns/choice-field`                                              |

| Cosmos primitive                          | Source file                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| Accordion                                 | [src/data-display/accordion.tsx](../src/data-display/accordion.tsx)                   |
| Alert                                     | [src/feedback/alert.tsx](../src/feedback/alert.tsx)                                   |
| AlertDialog                               | [src/overlays/alert-dialog.tsx](../src/overlays/alert-dialog.tsx)                     |
| Attributes                                | [src/data-display/attributes.tsx](../src/data-display/attributes.tsx)                 |
| Autocomplete                              | [src/pickers/autocomplete.tsx](../src/pickers/autocomplete.tsx)                       |
| Avatar                                    | [src/data-display/avatar.tsx](../src/data-display/avatar.tsx)                         |
| BrandLockup                               | [src/media/brand-lockup.tsx](../src/media/brand-lockup.tsx)                           |
| Breadcrumbs                               | [src/navigation/breadcrumbs.tsx](../src/navigation/breadcrumbs.tsx)                   |
| Button                                    | [src/buttons/button.tsx](../src/buttons/button.tsx)                                   |
| Primitives / Charts / ChartRangeSelection | [src/charts/chart-range-selection.tsx](../src/charts/chart-range-selection.tsx)       |
| Calendar                                  | [src/pickers/calendar.tsx](../src/pickers/calendar.tsx)                               |
| DateField                                 | [src/forms/date-field.tsx](../src/forms/date-field.tsx)                               |
| DatePicker                                | [src/pickers/date-picker.tsx](../src/pickers/date-picker.tsx)                         |
| Checkbox                                  | [src/forms/checkbox.tsx](../src/forms/checkbox.tsx)                                   |
| Chip                                      | [src/data-display/chip.tsx](../src/data-display/chip.tsx)                             |
| CodeBlock                                 | [src/typography/code-block.tsx](../src/typography/code-block.tsx)                     |
| ComboBox                                  | [src/pickers/combo-box.tsx](../src/pickers/combo-box.tsx)                             |
| Description                               | [src/forms/description.tsx](../src/forms/description.tsx)                             |
| Disclosure                                | [src/navigation/disclosure.tsx](../src/navigation/disclosure.tsx)                     |
| Drawer                                    | [src/overlays/drawer.tsx](../src/overlays/drawer.tsx)                                 |
| Dropdown                                  | [src/overlays/dropdown.tsx](../src/overlays/dropdown.tsx)                             |
| EmptyState                                | [src/data-display/empty-state.tsx](../src/data-display/empty-state.tsx)               |
| Field                                     | [src/forms/field.tsx](../src/forms/field.tsx)                                         |
| HeadingHelp                               | [src/overlays/heading-help.tsx](../src/overlays/heading-help.tsx)                     |
| InlineExternalLink                        | [src/navigation/inline-external-link.tsx](../src/navigation/inline-external-link.tsx) |
| Input                                     | [src/forms/input.tsx](../src/forms/input.tsx)                                         |
| InputGroup                                | [src/forms/input-group.tsx](../src/forms/input-group.tsx)                             |
| Label                                     | [src/forms/label.tsx](../src/forms/label.tsx)                                         |
| LineChart                                 | [src/charts/line-chart.tsx](../src/charts/line-chart.tsx)                             |
| ListBox                                   | [src/collections/list-box.tsx](../src/collections/list-box.tsx)                       |
| ListView                                  | [src/data-display/list-view.tsx](../src/data-display/list-view.tsx)                   |
| Modal                                     | [src/overlays/modal.tsx](../src/overlays/modal.tsx)                                   |
| Pagination                                | [src/navigation/pagination.tsx](../src/navigation/pagination.tsx)                     |
| PasswordInput                             | [src/forms/password-input.tsx](../src/forms/password-input.tsx)                       |
| Popover                                   | [src/overlays/popover.tsx](../src/overlays/popover.tsx)                               |
| ProgressCircle                            | [src/feedback/progress-circle.tsx](../src/feedback/progress-circle.tsx)               |
| RouteLink                                 | [src/navigation/route-link.tsx](../src/navigation/route-link.tsx)                     |
| ScrollShadow                              | [src/utilities/scroll-shadow.tsx](../src/utilities/scroll-shadow.tsx)                 |
| Select                                    | [src/forms/select.tsx](../src/forms/select.tsx)                                       |
| Skeleton                                  | [src/feedback/skeleton.tsx](../src/feedback/skeleton.tsx)                             |
| Spinner                                   | [src/feedback/spinner.tsx](../src/feedback/spinner.tsx)                               |
| Switch                                    | [src/forms/switch.tsx](../src/forms/switch.tsx)                                       |
| Table                                     | [src/data-display/table.tsx](../src/data-display/table.tsx)                           |
| TableCellText                             | [src/data-display/table-cell-text.tsx](../src/data-display/table-cell-text.tsx)       |
| Tabs                                      | [src/navigation/tabs.tsx](../src/navigation/tabs.tsx)                                 |
| Textarea                                  | [src/forms/textarea.tsx](../src/forms/textarea.tsx)                                   |
| ThemeSwitcher                             | [src/controls/theme-switcher.tsx](../src/controls/theme-switcher.tsx)                 |
| Toast                                     | [src/overlays/toast.tsx](../src/overlays/toast.tsx)                                   |
| ToggleButton                              | [src/buttons/toggle-button.tsx](../src/buttons/toggle-button.tsx)                     |
| Tooltip                                   | [src/overlays/tooltip.tsx](../src/overlays/tooltip.tsx)                               |
| Typography                                | [src/typography/typography.tsx](../src/typography/typography.tsx)                     |
| Widget                                    | [src/data-display/widget.tsx](../src/data-display/widget.tsx)                         |

Additional shared account, invitation and passkey surfaces:

| Component                     | Source                                                                                | Responsibility                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProfileImageSettings`        | [ProfileImageSettings](../src/patterns/account-settings/profile-image-settings.tsx)   | Shared Gravatar appearance widget with account email and name.                                                                                       |
| `InvitationPasswordSetup`     | [InvitationPasswordSetup](../src/patterns/auth/invitation-password-setup.tsx)         | Invite-link onboarding with name, password confirmation and app submission; use when email-code verification is not part of the invitation contract. |
| `PasskeyRecoveryVerification` | [PasskeyRecoveryVerification](../src/patterns/auth/passkey-recovery-verification.tsx) | Code-only completion of a password sign-in already gated on passkeys.                                                                                |
| `RemoveMemberDialog`          | [RemoveMemberDialog](../src/patterns/team-settings/remove-member-dialog.tsx)          | Shared removal copy and awaited access removal.                                                                                                      |
| `RevokeInvitationDialog`      | [RevokeInvitationDialog](../src/patterns/team-settings/revoke-invitation-dialog.tsx)  | Shared invitation revocation copy and awaited mutation.                                                                                              |

`TeamGeneralSettings` ([source](../src/patterns/team-settings/team-general-settings.tsx)) owns the Team details widget and Team name copy. The default mode saves a name; `mode="details"` saves name and description together for apps that support a team description.

`OverlaySuspensionScope` and `useOverlaySuspension` are exported from the package root and `overlays/overlay-suspension`. Their source is [src/overlays/overlay-suspension.tsx](../src/overlays/overlay-suspension.tsx), with the retained modal and settings previews under `Primitives / Overlays / OverlaySuspensionScope`. Use the scope to release supported native overlay locks while preserving a mounted owner’s logical state. Use ordinary controlled `isOpen` for intentional dismissal. See [Suspending retained overlays](layouts.md#suspending-retained-overlays) for cancellation, drafts, supported portals and owner-change responsibilities.

### Date/time preference catalog

The React-free `utilities/date-time-preferences` public subpath and root export provide `dateFormatOptions`, `timeFormatOptions`, `defaultDateTimePreferences`, `DateFormatId`, `TimeFormatId` and `StandardDateTimePreferences`. Use this catalog for common preference controls instead of local option lists. See [forms](forms.md#display-preferences) for defaults, persistence and serialization boundaries.

### Common settings presentation

`SettingsPageTitle` (`patterns/settings/page-title`) supplies the standard common settings title and decorative 24px icon inside an application page heading. `settingsPageLabels` supplies matching navigation labels. Use the `mcp-connections` section below API Keys; keep MCP Guide separate.

`teamRoleOptions` (`patterns/team-settings/team-role-options`) supplies Admin, Member and Viewer with 16px icons and short generic descriptions for invitation and member-edit pickers. Applications retain their existing permission enforcement.

`McpGuideSettings` (`patterns/account-settings/mcp-guide-settings`) owns the client selector, configuration code and MCP setup and troubleshooting link. Pass app-owned `configurations` and `documentationUrl`; configuration entries contain `id`, `label`, optional `icon`, `filename` and `code`. Keep additional connection prose in the documentation.

`McpConnectionsSettings` (`patterns/account-settings/mcp-connections-settings`) shows authorized MCP clients on their own account page. Pass `AuthorizedClient` items, `formatDate` and an awaited `onRevoke(id)`. A failed revocation keeps its confirmation available; refresh committed items after success. API Keys is for manually created keys.
