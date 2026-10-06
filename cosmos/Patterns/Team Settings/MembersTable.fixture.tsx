import { useFixtureInput } from "react-cosmos/client";
import { MembersTable } from "../../../src/patterns/team-settings/members-table";
import { Button } from "../../../src/buttons/button";
import { toast } from "../../../src/overlays/toast";
export default function MembersTablePreview() {
  const [editorRole] = useFixtureInput("Editor role", false);
  return (
    <div className="p-4">
      <MembersTable
        items={[
          {
            id: "alex",
            name: "Alex",
            email: "alex@example.test",
            role: "admin",
            passkeyEnabled: true,
          },
          {
            id: "sam",
            name: "Sam with a long display name",
            email: "sam@example.test",
            role: editorRole ? "editor" : "member",
            passkeyEnabled: false,
          },
        ]}
        actions={(item) => (
          <Button
            variant="secondary"
            onPress={() => toast.info(`Edit ${item.name} preview`)}
          >
            Edit
          </Button>
        )}
      />
    </div>
  );
}
