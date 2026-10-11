import { HugeiconsIcon } from "@hugeicons/react";
import ChatGptIcon from "@hugeicons/core-free-icons/ChatGptIcon";
import type { ReactNode } from "react";

type McpClientIdentity = { name: string; id?: string; logo?: ReactNode };

function isCodexMetadataUrl(value: string) {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    url.host === "chatgpt.com" &&
    !url.username &&
    !url.password &&
    /^\/oauth\/codex\/(?:[^/]+\/)?client\.json$/.test(url.pathname)
  );
}

export function mcpClientPresentation<T extends McpClientIdentity>(client: T) {
  const isCodex =
    client.name.trim().toLowerCase() === "codex" ||
    isCodexMetadataUrl(client.name) ||
    (client.id !== undefined && isCodexMetadataUrl(client.id));
  return isCodex
    ? {
        ...client,
        name: "Codex",
        logo: <HugeiconsIcon icon={ChatGptIcon} size={20} aria-hidden="true" />,
      }
    : client;
}
