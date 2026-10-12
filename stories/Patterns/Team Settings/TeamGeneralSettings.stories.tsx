import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TeamGeneralSettings } from "../../../src/patterns/team-settings/team-general-settings";

function NamePreview() {
  const [value, setValue] = useState("Avgeek");
  return (
    <div className="max-w-lg p-4">
      <TeamGeneralSettings
        value={value}
        onSave={async (name) => setValue(name)}
      />
    </div>
  );
}
function DetailsPreview() {
  const [value, setValue] = useState({
    name: "Avgeek",
    description: "Platform team",
  });
  return (
    <div className="max-w-lg p-4">
      <TeamGeneralSettings
        mode="details"
        value={value}
        onSave={async (next) => setValue(next)}
      />
    </div>
  );
}

const meta = {
  title: "Patterns/Team Settings/TeamGeneralSettings",
  component: TeamGeneralSettings,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published TeamGeneralSettings component from @avgeek-oss/design-system/patterns/team-settings/team-general-settings. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = { name: "Master", render: () => <NamePreview /> };

export const NameAndDescription: Story = {
  name: "Name and description",
  render: () => <DetailsPreview />,
};
