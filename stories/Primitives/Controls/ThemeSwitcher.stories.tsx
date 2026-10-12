import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ThemeSwitcher } from "../../../src/controls/theme-switcher";

function ThemeSwitcherVariants() {
  return (
    <PrimitivePreview title="ThemeSwitcher">
      <Variant title="Default">
        <ThemeSwitcher />
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Controls/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ThemeSwitcher component from @avgeek-oss/design-system/controls/theme-switcher. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ThemeSwitcherVariants />,
};
