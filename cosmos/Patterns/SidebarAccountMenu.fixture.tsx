import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Key01Icon,
  Logout01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { SidebarAccountMenu } from "../../src/patterns/sidebar-account-menu.js";

function AccountMenuPreview() {
  const [action, setAction] = useState("");
  return (
    <div className="flex min-h-dvh flex-col items-start justify-end p-4">
      {action ? <p role="status">Selected action: {action}</p> : null}
      <div className="w-64 max-w-full">
        <SidebarAccountMenu
          name="Alex Taylor"
          email="alex@example.test"
          teamName="Avgeek"
          onAction={setAction}
          groups={[
            {
              id: "account",
              label: "Account",
              items: [
                {
                  id: "profile",
                  label: "Profile",
                  icon: <HugeiconsIcon icon={UserAccountIcon} />,
                },
                {
                  id: "preferences",
                  label: "Preferences",
                  icon: <HugeiconsIcon icon={Settings01Icon} />,
                },
                {
                  id: "passkeys",
                  label: "Passkeys",
                  icon: <HugeiconsIcon icon={SecurityCheckIcon} />,
                },
                {
                  id: "api-keys",
                  label: "My API Keys",
                  icon: <HugeiconsIcon icon={Key01Icon} />,
                },
              ],
            },
            {
              id: "product",
              label: "Avgeek",
              items: [
                {
                  id: "documentation",
                  label: "Documentation",
                  icon: <HugeiconsIcon icon={BookOpen01Icon} />,
                },
              ],
            },
            {
              id: "session",
              label: "Session",
              items: [
                {
                  id: "sign-out",
                  label: "Sign out",
                  icon: <HugeiconsIcon icon={Logout01Icon} />,
                  destructive: true,
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default <AccountMenuPreview />;
