import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { McpConnectionsSettings } from "../../../src/patterns/account-settings/mcp-connections-settings.js";
import { SettingsPageTitle } from "../../../src/patterns/settings/page-title.js";
function Fixture() {
  const [items, setItems] = useState([
    {
      id: "codex",
      name: "https://chatgpt.com/oauth/codex/YddBjjAsi-xR/client.json",
      client: {
        name: "https://chatgpt.com/oauth/codex/YddBjjAsi-xR/client.json",
        id: "https://chatgpt.com/oauth/codex/YddBjjAsi-xR/client.json",
      },
      permissions: "Administrative permissions",
      createdAt: "2026-10-01T12:00:00Z",
      expiresAt: "2026-10-31T12:00:00Z",
      lastUsedAt: null,
    },
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
    <div className="grid gap-6">
      <h1>
        <SettingsPageTitle section="mcp-connections" />
      </h1>
      <McpConnectionsSettings
        items={items}
        formatDate={(value) => new Date(value).toLocaleDateString("en")}
        onRevoke={async (id) => {
          setItems((previous) => previous.filter((item) => item.id !== id));
        }}
      />
    </div>
  );
}

const meta = {
  title: "Patterns/Account Settings/McpConnectionsSettings",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive McpConnectionsSettings examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = { name: "Master", render: () => <Fixture /> };
