import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  SettingsPageTitle,
  settingsPageLabels,
} from "../../src/patterns/settings/page-title.js";
const meta = {
  title: "Patterns/SettingsPageTitle",
  component: SettingsPageTitle,
  args: { section: "profile" },
  argTypes: {
    section: { control: "select", options: Object.keys(settingsPageLabels) },
  },
} satisfies Meta<typeof SettingsPageTitle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Master: Story = {
  render: (args) => (
    <h1 className="text-lg font-medium">
      <SettingsPageTitle {...args} />
    </h1>
  ),
};
