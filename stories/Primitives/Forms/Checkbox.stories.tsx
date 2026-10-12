import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Checkbox, CheckboxGroup } from "../../../src/forms/checkbox";
import { Label } from "../../../src/forms/label";

function CheckboxVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Checkbox">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant title={variant} key={variant}>
            {[
              { label: "Unchecked" },
              { label: "Checked", defaultSelected: true },
              { label: "Indeterminate", isIndeterminate: true },
              { label: "Disabled", isDisabled: true },
            ].map((state) => (
              <Checkbox key={state.label} variant={variant} {...state}>
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>{state.label}</Label>
                </Checkbox.Content>
              </Checkbox>
            ))}
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="Group">
          <CheckboxGroup defaultValue={["first"]}>
            <Label>Options</Label>
            {["first", "second"].map((value) => (
              <Checkbox key={value} value={value}>
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>{value}</Label>
                </Checkbox.Content>
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Checkbox component from @avgeek-oss/design-system/forms/checkbox. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <CheckboxVariants section={0} />,
};

export const Group: Story = {
  name: "Group",
  render: () => <CheckboxVariants section={1} />,
};
