import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Switch } from "../../../src/forms/switch";
import { Label } from "../../../src/forms/label";

function SwitchVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Switch">
      {section === 0 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Switch
              key={size}
              size={size}
              aria-label={`${size} switch`}
              defaultSelected
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="States">
          {[
            { label: "Off" },
            { label: "On", defaultSelected: true },
            { label: "Disabled", isDisabled: true },
          ].map((state) => (
            <Switch key={state.label} {...state}>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label>{state.label}</Label>
              </Switch.Content>
            </Switch>
          ))}
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Switch",
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Switch component from @avgeek-oss/design-system/forms/switch. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <SwitchVariants section={0} />,
};

export const States: Story = {
  name: "States",
  render: () => <SwitchVariants section={1} />,
};
