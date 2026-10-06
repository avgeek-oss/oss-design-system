import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { NotificationMenu } from "../src/patterns/notifications.js";

test("notification trigger announces the full unread count and caps its visual badge", () => {
  const html = renderToStaticMarkup(
    <NotificationMenu items={[]} unreadCount={125} />,
  );
  assert.match(html, /aria-label="Notifications, 125 unread"/);
  assert.match(html, />99\+<\/span>/);
});

test("an empty notification trigger has an accessible name without an unread badge", () => {
  const html = renderToStaticMarkup(
    <NotificationMenu items={[]} unreadCount={0} />,
  );
  assert.match(html, /aria-label="Notifications"/);
  assert.doesNotMatch(html, /Notifications, 0 unread/);
  assert.doesNotMatch(html, />0<\/span>/);
});
