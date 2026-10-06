import { UserAvatar } from "../user-avatar.js";
import { Chip } from "../../data-display/chip.js";
import { ResourceTable, ResourceName } from "../resource-table.js";
import type { MemberRole } from "../settings/schemas.js";
import { actionColumn, type Actions } from "../settings/table-actions.js";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  passkeyEnabled?: boolean;
};
export function MembersTable({
  items,
  actions,
}: { items: Member[] } & Actions<Member>) {
  return (
    <ResourceTable
      ariaLabel="Members"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No members"
      emptyDescription=""
      columns={[
        {
          key: "member",
          header: "Member",
          cell: (item) => (
            <div className="flex items-center gap-3">
              <UserAvatar email={item.email} name={item.name} />
              <ResourceName name={item.name} description={item.email} />
            </div>
          ),
        },
        {
          key: "role",
          header: "Role",
          cell: (item) => (
            <Chip>
              {
                {
                  admin: "Admin",
                  member: "Member",
                  editor: "Editor",
                  viewer: "Viewer",
                }[item.role]
              }
            </Chip>
          ),
        },
        {
          key: "passkeys",
          header: "Passkeys",
          cell: (item) =>
            item.passkeyEnabled === undefined ? (
              "—"
            ) : (
              <Chip color={item.passkeyEnabled ? "success" : "danger"}>
                {item.passkeyEnabled ? "Enabled" : "Not enabled"}
              </Chip>
            ),
        },
        actionColumn(actions),
      ]}
    />
  );
}
