import { JSDOM } from "jsdom";
import cssEscape from "css.escape";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://example.test",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "navigator",
  "Node",
  "Element",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLButtonElement",
  "HTMLTextAreaElement",
  "HTMLSelectElement",
  "FormData",
  "SVGElement",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "InputEvent",
  "CustomEvent",
  "FocusEvent",
  "PointerEvent",
  "MutationObserver",
  "NodeFilter",
  "HTMLFormElement",
  "DocumentFragment",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: key === "window" ? dom.window : Reflect.get(dom.window, key),
  });
}
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  CSS: { escape: cssEscape },
  getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
  cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
});
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.assign(globalThis, { ResizeObserver });
Object.assign(dom.window, { ResizeObserver });
Object.defineProperty(dom.window, "matchMedia", {
  value: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
});
