export function AvgeekLogo() {
  return (
    <span aria-hidden="true" className="inline-grid size-8 shrink-0">
      <img
        alt=""
        className="size-8 rounded-lg dark:hidden"
        src={new URL("./assets/avgeek-dev-light.svg", import.meta.url).href}
      />
      <img
        alt=""
        className="hidden size-8 rounded-lg dark:block"
        src={new URL("./assets/avgeek-dev-dark.svg", import.meta.url).href}
      />
    </span>
  );
}
