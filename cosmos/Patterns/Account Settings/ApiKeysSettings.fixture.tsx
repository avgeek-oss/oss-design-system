import { ApiKeysSettingsPreview } from "../../../studio/pattern-previews";
import { ApiKeysSettings } from "../../../src/patterns/account-settings/api-keys-settings";
import { Button } from "../../../src/buttons/button";

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
};
