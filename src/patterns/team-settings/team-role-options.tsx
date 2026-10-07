import { HugeiconsIcon } from "@hugeicons/react";
import CrownIcon from "@hugeicons/core-free-icons/CrownIcon";
import UserShield01Icon from "@hugeicons/core-free-icons/UserShield01Icon";
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon";
import type { ChoiceOption } from "../choice-field.js";

export type TeamRole = "admin" | "member" | "viewer";

export const teamRoleOptions: readonly ChoiceOption<TeamRole>[] = [
  {
    id: "admin",
    label: "Admin",
    description: "Manage the team and all resources.",
    icon: <HugeiconsIcon icon={CrownIcon} size={16} aria-hidden="true" />,
  },
  {
    id: "member",
    label: "Member",
    description: "Create and edit resources.",
    icon: (
      <HugeiconsIcon icon={UserShield01Icon} size={16} aria-hidden="true" />
    ),
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "View resources.",
    icon: <HugeiconsIcon icon={ViewIcon} size={16} aria-hidden="true" />,
  },
];
