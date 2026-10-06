import { useState } from "react";
import { AppLayout } from "../../src/navigation/app-layout";
import { RouteProvider } from "../../src/hooks/route-context";
import {
  SecondaryItems,
  SecondarySidebarLayout,
} from "../../src/navigation/secondary-sidebar";
import { Button } from "../../src/buttons/button";

export default function SecondaryNavigation() {
  const [pathname, setPathname] = useState("/profile");
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState(0);
  return (
    <RouteProvider pathname={pathname} navigate={setPathname}>
      <AppLayout
        sidebar={<nav className="p-4">Workspace navigation</nav>}
        sidebarOpen={open}
        onSidebarOpenChange={setOpen}
        navbar={
          <header className="flex gap-4 border-b border-separator p-4">
            <Button
              aria-label="Toggle navigation"
              className="navigation-toggle"
              onPress={() => setOpen(!open)}
            >
              Navigation
            </Button>
          </header>
        }
      >
        <SecondarySidebarLayout>
          <SecondaryItems
            title="Account"
            selected={pathname.slice(1)}
            onSelect={() => setActions(actions + 1)}
            items={[
              { id: "profile", href: "/profile", label: "Profile" },
              { id: "preferences", href: "/preferences", label: "Preferences" },
              {
                id: "locked",
                href: "/locked",
                label: "Restricted",
                disabled: true,
                disabledReason: "Unavailable in this preview",
              },
              { id: "action", label: "Refresh account" },
            ]}
          />
          <div className="grid gap-3 p-4 text-sm">
            <p data-route>{pathname}</p>
            <p data-actions>Actions: {actions}</p>
            <p data-navigation-state>
              {open ? "Navigation open" : "Navigation closed"}
            </p>
          </div>
        </SecondarySidebarLayout>
      </AppLayout>
    </RouteProvider>
  );
}
