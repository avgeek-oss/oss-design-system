import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ChoiceField } from "../../../src/patterns/choice-field.js";
import {
  teamRoleOptions,
  type TeamRole,
} from "../../../src/patterns/team-settings/team-role-options.js";
function Fixture() {
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

const meta = {
  title: "Patterns/Team Settings/TeamRoleOptions",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive TeamRoleOptions examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = { name: "Master", render: () => <Fixture /> };
