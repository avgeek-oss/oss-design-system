# Layouts

## Application shell

Use `AppShell` and `ApplicationPage` for product pages. Use `AuthScreen` for public authentication; it has a different layout and does not add page-shell padding.

Below 640px, the shared auth frame starts at the top with 32px vertical and 16px horizontal padding, plus device safe-area insets at the top and bottom. This applies to all auth screens. Desktop auth frames retain their centered layout and 24px horizontal gutters.

`AppShell.Content` owns 16px horizontal gutters, no top padding, and 80px bottom padding. `ApplicationPage` owns 20px above and below the page title. Do not add another top padding or gap around the content: it doubles the heading-to-content spacing.

```tsx
<AppShell.Content>
  <ApplicationPage title="Profile" breadcrumbAncestors={ancestors}>
    <NameSettingsForm title="Profile details" value={name} onSave={save} />
  </ApplicationPage>
</AppShell.Content>
```

Do not put a `pt-4` wrapper around `NameSettingsForm` in this example.

Page headings wrap by default. Set `titleOverflow="truncate"` on `ApplicationPage`, `ContentPage`, or `StatusPage` when the title and actions must remain on one row. The title area shrinks while actions retain their width; plain titles use `TooltipText` to reveal clipped text on hover, focus, or press. A custom `titleContent` keeps its own icon and text composition: give its text `min-w-0 truncate` and use `TooltipText` for the full title. Keep action groups compact enough to fit the narrowest supported screen; this option does not hide actions.

Set a navigation item's `activePath` when its destination is one child of a section, for example `href="/settings/profile"` with `activePath="/settings"`. Matching respects path boundaries. The default matches the destination and its descendants.

Matching internal primary links expose `aria-current="page"` using the same rule as their visual selection. Account and Team descendants retain their owning section; similar prefixes such as `/settings-archive` and `/teams` do not match. `preserveSubroute` keeps the current child route when its owning primary link is activated. External links do not expose a current-page state.

Primary and secondary sidebar items use HeroUI’s native menu-item styles, including the 36px minimum height, padding, hover and focus states. Sidebar links remain navigation links.

Import `SecondaryItems` from `@avgeek-oss/design-system/navigation/secondary-sidebar`. Give navigation items an `href`; they render `RouteLink`, use the app's `RouteProvider`, retain modified/new-tab clicks, and close the mobile drawer only on ordinary activation. `selected` marks the current link with `aria-current="page"`. An item without `href` remains an action button and calls `onSelect(id)` before closing; `onSelect` can be omitted for link-only lists. A disabled item remains a disabled button without a navigable destination, including when it has an `href`. Existing action lists retain their behavior and density.

The account menu uses labeled Account, product, and Session sections with dividers spanning the full popover width. Padding belongs inside each section, so the dividers meet both edges while labels and items remain inset. The identity header remains visually separate from the menu. The SidebarAccountMenu Cosmos fixture previews this shared component directly.

### Breadcrumbs

Use `BreadcrumbTrail` for links and current-page labels. Place `BreadcrumbDropdown.Root` or `BreadcrumbSelect.Root` in an item's `content` for navigation menus or searchable entity selectors. Both retain HeroUI's compound parts and keyboard behavior; their compact triggers inherit the current item's emphasis and show a chevron. Menus render in a portal outside the breadcrumb's truncation area.

```tsx
<BreadcrumbTrail
  items={[
    {
      label: "Account",
      content: (
        <BreadcrumbDropdown.Root>
          <BreadcrumbDropdown.Trigger>Account</BreadcrumbDropdown.Trigger>
          <BreadcrumbDropdown.Popover placement="bottom start">
            <BreadcrumbDropdown.Menu aria-label="Account pages">
              <BreadcrumbDropdown.Item id="profile" href="/settings/profile">
                Profile
              </BreadcrumbDropdown.Item>
              <BreadcrumbDropdown.Item
                id="preferences"
                href="/settings/preferences"
              >
                Preferences
              </BreadcrumbDropdown.Item>
            </BreadcrumbDropdown.Menu>
          </BreadcrumbDropdown.Popover>
        </BreadcrumbDropdown.Root>
      ),
    },
    { label: "Profile" },
  ]}
/>
```

For an entity selector, use `BreadcrumbSelect.Trigger`, `BreadcrumbSelect.Value`, and `BreadcrumbSelect.Popover` with `ListBox`; compose `Autocomplete.Filter` and `SearchField` when search is needed. Applications own the options, loading state and navigation.

Mobile drawers retain the outgoing sidebar through dismissal. Test transitions between pages with and without secondary navigation, Escape dismissal, focus return, and reopening. Controls use HeroUI’s native interaction feedback.

## Modals

Use `Modal` for forms and confirmation flows; use `Popover` for contextual content and `Dropdown` for action menus.

Modals, alert dialogs and drawers use 20px dialog padding, a 16px gap between the header and body, and 16px before the footer. The heading and close control share a grid row; long headings wrap within the space beside the close control. Omit unused body/footer sections to prevent empty spacing.

```tsx
<Modal.Dialog>
  <Modal.Header>
    <Modal.Heading>Create invitation</Modal.Heading>
    <Modal.CloseTrigger />
  </Modal.Header>
  <Modal.Body>{fields}</Modal.Body>
  <Modal.Footer>{actions}</Modal.Footer>
</Modal.Dialog>
```

Keep the close control inside the header for title alignment. HeroUI's scrolling, focus management, dismissal and surface styles remain unchanged.

## Typography and tables

Use `text-sm` for body text and labels, `text-lg leading-7 font-medium` for page titles and desktop secondary sidebar headings, and `text-xs` for descriptions and metadata. Both heading rows are 32px tall with 20px above; page titles have 20px below and secondary sidebar headings have 4px below; do not add top padding to the secondary navigation host when it has a heading. Numeric widget values use `font-medium` and tabular numbers. Navigation icons help identify destinations; widget headings do not need an icon when the page already supplies the context.

Use `Widget.Action` for inline underlined actions in widget headers and footers. Place filled buttons inside `Widget.Content` or in page actions; header and footer buttons always render as inline actions.

`Table` is the HeroUI primitive: compose its header, rows, cells and footer directly. `ResourceTable` composes `Table` from an items array and column definitions, with optional record links, navigation callbacks and an empty state. Use it for record lists such as members, passkeys, sessions and API keys. Record links use `RouteLink` with the application's navigation provider.

Use `Widget` for related form content and metrics. Right-aligned actions require a right-aligned column header. Mark a meaningful row header with `isRowHeader` if it is not the first column. Empty-state content belongs inside the content area. Table footers use `text-xs` muted metadata; the native table empty-state cell uses the same inner surface and padding as populated cells.

Use `InlineExternalLink` for external text links. It has one style, with a dashed underline offset of 2px and a new-tab marker. It opens in a new tab by default; setting another target omits the marker.
