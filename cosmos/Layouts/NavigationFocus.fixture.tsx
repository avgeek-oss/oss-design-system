import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AppLayout } from "../../src/navigation/app-layout";
import { RouteProvider } from "../../src/hooks/route-context";
import { Button } from "../../src/buttons/button";
import {
  SecondaryItems,
  SecondarySidebarLayout,
} from "../../src/navigation/secondary-sidebar";

function Destination({
  deliberateFocus,
  onArrive,
}: {
  deliberateFocus: boolean;
  onArrive?: () => void;
}) {
  const control = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (deliberateFocus) control.current?.focus({ preventScroll: true });
    onArrive?.();
  }, [deliberateFocus, onArrive]);
  return <Button ref={control}>Destination action</Button>;
}

function NavigationFocus({
  replaceNavbar = false,
  deliberateFocus = false,
  reopenOnArrival = false,
}: {
  replaceNavbar?: boolean;
  deliberateFocus?: boolean;
  reopenOnArrival?: boolean;
}) {
  const [pathname, setPathname] = useState("/task");
  const [open, setOpen] = useState(false);
  const [visitedBoard, setVisitedBoard] = useState(false);
  const reopen = useCallback(() => setOpen(true), []);
  useEffect(() => {
    const sync = () => setPathname(location.hash.slice(1) || "/task");
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const navigate = (href: string) => {
    history.pushState(null, "", `#${href}`);
    setVisitedBoard(true);
    setPathname(href);
  };
  return (
    <RouteProvider pathname={pathname} navigate={navigate}>
      <AppLayout
        toggleShortcut
        sidebar={<nav className="p-4">Workspace navigation</nav>}
        sidebarOpen={open}
        onSidebarOpenChange={setOpen}
        navbar={
          <header key={replaceNavbar ? pathname : "navbar"} className="p-4">
            <Button
              aria-label="Toggle navigation"
              aria-expanded={open}
              className="navigation-toggle"
              onPress={() => setOpen(!open)}
            >
              Navigation
            </Button>
          </header>
        }
      >
        <SecondarySidebarLayout>
          {pathname === "/board" ? (
            <SecondaryItems
              title="Filters"
              selected="all"
              items={[{ id: "all", label: "All status" }]}
              onSelect={() => {}}
            />
          ) : null}
          <div className="grid gap-3 p-4 text-sm">
            <h1>{pathname === "/board" ? "Board" : "Task"}</h1>
            {pathname === "/task" ? (
              <Destination
                deliberateFocus={deliberateFocus}
                onArrive={reopenOnArrival && visitedBoard ? reopen : undefined}
              />
            ) : null}
            <Button onPress={() => navigate("/board")}>Back to board</Button>
          </div>
        </SecondarySidebarLayout>
      </AppLayout>
    </RouteProvider>
  );
}

export default {
  "Stable navbar": <NavigationFocus />,
  "Replaced navbar": <NavigationFocus replaceNavbar />,
  "Destination focus": <NavigationFocus replaceNavbar deliberateFocus />,
  "Reopen on arrival": <NavigationFocus replaceNavbar reopenOnArrival />,
};
