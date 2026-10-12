import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/ProfileImageSettings-preview";
import { ProfileImageSettings } from "../../../src/patterns/account-settings/profile-image-settings";
const meta = {
  title: "Patterns/Account Settings/ProfileImageSettings",
  component: ProfileImageSettings,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ProfileImageSettings component from @avgeek-oss/design-system/patterns/account-settings/profile-image-settings. Applications supply data and action callbacks.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
