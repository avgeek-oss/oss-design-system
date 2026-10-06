# Design rules

Towbar is the baseline for shared application layouts, features, and presentation contracts. Base HeroUI primitives use the library’s default styling and native variant, color, and size APIs. App layouts and composed patterns carry their own structure. Apps own authorization, persistence, and data fetching.

- [Layouts](docs/layouts.md): page spacing, navigation, overlays, headings.
- [Forms and feedback](docs/forms.md): surface variants, validation, pending states, notifications.
- [Shared application patterns](docs/patterns.md): typed data, callbacks, and application boundaries.
- [Component catalog](docs/components.md): primitive source files and Cosmos entries.
- [Contributor rules](AGENTS.md): component ownership, APIs, lint, styles, and validation.

Use semantic tokens such as `background`, `surface`, `surface-secondary`, `foreground`, `muted`, `accent`, `danger`, and `separator`. Do not introduce raw colors in application components. Chart series use `--chart-requested`, `--chart-failed`, and `--chart-succeeded`; applications can override these semantic tokens.

Load `styles.css` through Tailwind and use the exported components. If a component is missing, add it here with an interactive Cosmos fixture before copying styles into an app.

Base primitives retain HeroUI's variants, colors and behavior. Shared CSS corrections are limited to reviewed table metadata/empty content, disclosure alignment, alert spacing, overlay padding/header alignment, and ListBox indicator spacing, as documented in the topic files. Do not add unrelated global primitive overrides. New styling needs a reviewed application requirement and a scope in the relevant pattern or an explicit opt-in variant. Cosmos fixtures may arrange examples without restyling their controls. Widget, Field and LineChart own their styles; ResourceTable composes Table for record lists.

The shared ListBox tick reservation is a layout correction: picker popover padding must not overlap the selection indicator. It applies to all rows with an indicator; native colors, sizing and selection behavior remain in place.
