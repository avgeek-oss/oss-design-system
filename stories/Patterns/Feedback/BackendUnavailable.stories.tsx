import type { Meta, StoryObj } from "@storybook/react-vite";
import { BackendUnavailable } from "../../../src/patterns/feedback/backend-unavailable";

const meta = {
  title: "Patterns/Feedback/BackendUnavailable",
  component: BackendUnavailable,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published BackendUnavailable component from @avgeek-oss/design-system/patterns/feedback/backend-unavailable. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <BackendUnavailable appName="Towbar" />,
};

export const Mill: Story = {
  name: "Mill",
  render: () => <BackendUnavailable appName="Mill" />,
};

export const Vitalog: Story = {
  name: "Vitalog",
  render: () => <BackendUnavailable appName="Vitalog" />,
};

export const Rootset: Story = {
  name: "Rootset",
  render: () => <BackendUnavailable appName="Rootset" />,
};
