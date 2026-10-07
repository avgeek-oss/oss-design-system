import { useState } from "react";
import { McpConnectionsSettings } from "../../../src/patterns/account-settings/mcp-connections-settings.js";
export default function Fixture() {
  const [items, setItems] = useState([
    {
      id: "client",
      name: "Example app",
      client: { name: "Example app", id: "example.test" },
      permissions: "Read-only",
      createdAt: "2026-10-01T12:00:00Z",
      expiresAt: "2026-10-31T12:00:00Z",
      lastUsedAt: null,
    },
  ]);
  return (
    <McpConnectionsSettings
      items={items}
      formatDate={(value) => new Date(value).toLocaleDateString("en")}
      onRevoke={async (id) => {
        setItems((previous) => previous.filter((item) => item.id !== id));
      }}
    />
  );
}
