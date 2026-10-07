"use client";
import { useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import { ButtonLink } from "../../buttons/button.js";
import { Widget } from "../../data-display/widget.js";
import { CodeBlock } from "../../typography/code-block.js";
import { ChoiceField } from "../choice-field.js";

export type McpClientConfiguration = {
  id: string;
  label: string;
  icon?: ReactNode;
  filename: string;
  code: string;
};
export type McpGuideSettingsProps = {
  configurations: readonly McpClientConfiguration[];
  documentationUrl: string;
};
export function McpGuideSettings({
  configurations,
  documentationUrl,
}: McpGuideSettingsProps) {
  const [clientId, setClientId] = useState(configurations[0]?.id ?? "");
  const client =
    configurations.find((entry) => entry.id === clientId) ?? configurations[0];
  return (
    <Widget aria-label="Connect your MCP client" role="region">
      <Widget.Header>
        <Widget.Title>Connect your MCP client</Widget.Title>
      </Widget.Header>
      <Widget.Content className="grid gap-4">
        <ChoiceField
          label="App"
          value={client?.id ?? ""}
          options={configurations}
          onChange={setClientId}
        />
        {client ? (
          <CodeBlock>
            <CodeBlock.Header>
              <CodeBlock.Filename>{client.filename}</CodeBlock.Filename>
              <CodeBlock.CopyButton
                code={client.code}
                aria-label="Copy MCP configuration"
              />
            </CodeBlock.Header>
            <CodeBlock.Code
              code={client.code}
              tabIndex={0}
              aria-label="MCP configuration"
            />
          </CodeBlock>
        ) : null}
        <ButtonLink
          href={documentationUrl}
          variant="secondary"
          className="w-fit"
        >
          <HugeiconsIcon icon={BookOpen01Icon} size={16} aria-hidden="true" />
          MCP setup and troubleshooting
        </ButtonLink>
      </Widget.Content>
    </Widget>
  );
}
