# Changelog

## Unreleased

- Support real secondary navigation links alongside action buttons, preserving native menu density, router integration, modified clicks, and mobile dismissal.
- Expose matching internal primary navigation links as the current page, with the same section boundaries and preserved child routes as visual selection.
- Await app-owned notification activation with duplicate request protection, toast-only failures, pending announcements, and retry/pagination composition slots. Use “Mark all as read” for the default header action.
### Changed

- Standardize incoming notifications on explicit Mark all as read, durable per-user receipts, complete unread pagination and 24-hour read retention.

## 1.1.0 — 2026-10-06

- Restore full-width section dividers in the sidebar account menu while retaining padded labels and actions.
- Standardize bottom-center toasts and toast-only submission failures across forms, dialogs, confirmations, and shared mutation actions. Preserve drafts and keep dialogs open for retry; inline field validation and load/policy errors remain separate.
- Shared email/password settings, expanded API-key metadata, authorized clients, and save-once API-key creation.
- Member account/security status, invitation management, and separate invite/add/edit dialogs.
- History tables, search/filter controls, event details, and a draft-based filter builder.
- Notification destination subscriptions, provider connection cards, and operation progress.
- Shared semantic status, asynchronous confirmation/actions, and loading/error feedback.
- Controlled notification-menu state and custom header actions, with optional source labels.
- Component fixtures, public contracts, and interaction regression tests for retained drafts, pending actions, and secret dismissal.

## 1.0.0 — 2026-10-06

Initial shared React design system for Avgeek OSS applications.

- HeroUI primitives, fonts, semantic styles, charts, and form controls.
- Application shell, page layouts, breadcrumbs, routing context, and optional Next.js adapter.
- Separate authentication screens, two-step team setup, MCP authorization, account settings components, team members table, and resource tables.
- Interactive Cosmos coverage, usage documentation, contributor rules, and package verification.
