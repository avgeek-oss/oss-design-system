import { McpGuideSettings } from "../../../src/patterns/account-settings/mcp-guide-settings.js";
export default (
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
);
