import type { Meta, StoryObj } from "@storybook/react-vite";
import { McpGuideSettings } from "../../../src/patterns/account-settings/mcp-guide-settings.js";

const meta = {
  title: "Patterns/Account Settings/McpGuideSettings",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive McpGuideSettings examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => (
    <McpGuideSettings
      configurations={[
        {
          id: "codex",
          label: "Codex",
          filename: "~/.codex/config.toml",
          code: '[mcp_servers.example]\nurl = "https://example.test/mcp"',
        },
        {
          id: "claude",
          label: "Claude Code",
          filename: "Command",
          code: "claude mcp add --transport http example https://example.test/mcp",
        },
      ]}
      documentationUrl="https://example.test/docs/mcp"
    />
  ),
};
