import { ApiKeysSettingsPreview } from "../../../studio/pattern-previews";
import { Button } from "../../../src/buttons/button";
import { useState } from "react";
import { ApiKeysSettings } from "../../../src/patterns/account-settings/api-keys-settings";
import type { ApiKey } from "../../../src/patterns/account-settings/api-keys-table";
import {
  TableCellStack,
  TableCellDescription,
} from "../../../src/data-display/table-cell-text";

const keys: ApiKey[] = [
  {
    id: "automation",
    name: "Automation key with a long identifiable name for release operations",
    tokenHint: "key_••••12ab",
    permissions:
      "Read and write boards, tasks and comments across the current workspace",
    createdAt: "2026-10-01",
    expiresAt: "2026-12-30",
    lastUsedAt: "2026-10-06",
    status: { label: "Active", color: "success" },
  },
  {
    id: "reporting",
    name: "Reporting",
    permissions: "Read only",
    expiresAt: null,
    lastUsedAt: null,
  },
];

function ResponsiveApiKeys() {
  const [items, setItems] = useState(keys);
  const [requests, setRequests] = useState(0);
  return (
    <div className="grid min-w-0 gap-4 p-4">
      <h1 className="text-lg font-medium">API keys</h1>
      <p className="text-xs text-muted">Simulated requests: {requests}</p>
      <ApiKeysSettings
        items={items}
        formatDate={(value) => (
          <TableCellStack>
            <time dateTime={value}>{value}</time>
            <TableCellDescription>
              At 16:15 in your time zone
            </TableCellDescription>
          </TableCellStack>
        )}
        onRevoke={async (id) => {
          const attempt = requests + 1;
          setRequests(attempt);
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (attempt === 1)
            throw new Error("Revocation failed. Please retry.");
          setItems((current) => current.filter((item) => item.id !== id));
        }}
      />
    </div>
  );
}

function FocusReturn() {
  return (
    <div className="grid gap-4 p-4">
      <Button variant="secondary">Other action</Button>
      <ApiKeysSettings
        items={[{ id: "automation", name: "Automation", expiresAt: null }]}
        formatDate={(value) => value}
        onRevoke={async () => {}}
      />
    </div>
  );
}

export default {
  Standard: <ApiKeysSettingsPreview />,
  "Focus return": <FocusReturn />,
  "Responsive details": <ResponsiveApiKeys />,
};
