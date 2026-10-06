# Avgeek OSS Design System

Shared React components, application layouts, and UI patterns for Avgeek OSS apps. Adapted from Towbar under Apache-2.0, with Mill as a compatibility reference.

## Installation

Packages are hosted on GitHub Packages. Add the scope to your application's `.npmrc`:

```ini
@avgeek-oss:registry=https://npm.pkg.github.com
```

Authenticate with `npm login --scope=@avgeek-oss --auth-type=legacy --registry=https://npm.pkg.github.com`. Use your GitHub username and a personal access token (classic) with `read:packages` as the password. GitHub requires authentication for public npm packages too; keep credentials in your user configuration or CI secrets, never in Git. See [GitHub's npm registry guide](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

```sh
pnpm add @avgeek-oss/design-system react react-dom
```

The package targets React 19 and Tailwind CSS 4. Import `@avgeek-oss/design-system/styles.css` through your Tailwind build. Keep your application source scanning enabled. Fonts, HeroUI styles, tokens, and the package's component utilities are included through this stylesheet.

```tsx
"use client";

import { Providers, SignIn } from "@avgeek-oss/design-system";
import "@avgeek-oss/design-system/styles.css";

// Mount Providers once around your app. API callbacks belong to the app.
<Providers>
  <SignIn
    brand="Avgeek"
    onSubmit={signIn}
    onForgotPassword={openPasswordReset}
  />
</Providers>;
```

The root exports common layouts and patterns. Primitives also have explicit subpaths, such as `forms/input`, `pickers/date-picker`, and `data-display/table`. See the [component catalog](docs/components.md) for the available components; do not import unpublished internal paths.

## Layers

- **Primitives:** buttons, form controls, tables, widgets, charts, overlays, typography, icons, and theme controls.
- **Layouts:** application shell, primary and secondary navigation, page headings, breadcrumbs, and content sections.
- **Patterns:** separate auth screens, two-step team setup, MCP authorization, account settings, team members, resource tables, notifications, and the account menu.

Apps supply branding, routes, navigation groups, permissions, dates, and actions. API calls, authentication policy, credential ceremonies, and persistence stay in the app. Validation builders accept existing app limits; the package does not replace server authorization.

Component usage and design rules are in [DESIGN.md](DESIGN.md).

## Routing

Wrap the shell in `RouteProvider` with the current pathname and navigation callback. Without a router callback, links use normal browser navigation. Next.js applications can use `NextNavigationProvider` from `@avgeek-oss/design-system/adapters/next`. Next.js is an optional peer dependency and is not imported by the shared runtime.

## Development

```sh
pnpm install --frozen-lockfile
pnpm cosmos
pnpm verify
pnpm pack
```

React Cosmos runs on port 5012; its Vite renderer uses 5062. Fixtures cover primitives, shell navigation, auth layouts, settings tables, empty states, and charts. Use the shared appearance control to review both themes and Cosmos responsive viewports to review mobile layouts.

Contributor rules are in [AGENTS.md](AGENTS.md). `pnpm verify` includes strict source/studio type checks, code and CSS lint, tests, clean build, Cosmos export, and a tarball installation/type/build check outside this checkout. It saves the verified candidate and report in the ignored `artifacts/` folder. Built declarations include maps to the matching packaged source.

Release notes are in [CHANGELOG.md](CHANGELOG.md). Source and third-party attribution are in `NOTICE` and `LICENSE`.

## Publishing

Pull requests and pushes to `main` run `pnpm verify`. Stable version tags (`v1.0.0`, for example) run the same checks before publishing to GitHub Packages. The tag must match `package.json` and point to a commit on `main`. Update the version and changelog through the normal review process, then tag the intended commit and push the tag to release it.

The publish job uses the repository's `GITHUB_TOKEN` with `packages: write`; no separate publishing secret is needed. It downloads the tarball verified by CI, checks its SHA-512 integrity, and publishes those exact bytes without rerunning package lifecycle scripts. A fresh registry download must match that integrity and pass the isolated Vite and Next.js consumer builds. An existing version cannot be overwritten; publish changes under a new version.

GitHub initially creates packages with private visibility. After the first publication, set the package's visibility to public in its GitHub package settings. Repository visibility and npm's `access` setting do not replace this step.

Consumer GitHub Actions jobs need `packages: read` and registry authentication through `actions/setup-node` with `registry-url: https://npm.pkg.github.com`, `scope: "@avgeek-oss"`, and `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` on installation. Grant the consuming repository access in the package's **Manage Actions access** settings if required. Local consumers use the `read:packages` token described above.
