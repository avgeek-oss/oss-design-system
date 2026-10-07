import { useState } from "react";
import { ChoiceField } from "../../../src/patterns/choice-field.js";
import {
  teamRoleOptions,
  type TeamRole,
} from "../../../src/patterns/team-settings/team-role-options.js";
export default function Fixture() {
  const [role, setRole] = useState<TeamRole>("member");
  return (
    <ChoiceField
      label="Role"
      value={role}
      options={teamRoleOptions}
      onChange={setRole}
    />
  );
}
