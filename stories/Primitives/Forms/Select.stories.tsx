import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Select, ListBox } from "../../../src/forms/select";

function SelectVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Select">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant title={variant} key={variant}>
            <Select
              aria-label={`${variant} options`}
              variant={variant}
              className="w-full max-w-md"
              defaultSelectedKey="first"
            >
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {["first", "second", "third"].map((item) => (
                    <ListBox.Item key={item} id={item} textValue={item}>
                      {item}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="Disabled">
          <Select
            aria-label="Disabled options"
            isDisabled
            className="w-full max-w-md"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="first">First</ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Select component from @avgeek-oss/design-system/forms/select. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <SelectVariants section={0} />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => <SelectVariants section={1} />,
};
