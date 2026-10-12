import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ListBox } from "../../../src/collections/list-box";

function ListBoxVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="ListBox">
      {section === 0 && (
        <Variant title="Single selection">
          <ListBox
            aria-label="Single selection"
            selectionMode="single"
            defaultSelectedKeys={["first"]}
            disabledKeys={["disabled"]}
            className="w-full max-w-md"
          >
            {["first", "second", "disabled"].map((item) => (
              <ListBox.Item id={item} key={item} textValue={item}>
                {item}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Trailing content">
          <ListBox
            aria-label="Trailing content"
            selectionMode="single"
            defaultSelectedKeys={["first"]}
            className="w-full max-w-md"
          >
            {[
              { id: "first", label: "First", detail: "12 items" },
              { id: "second", label: "Second", detail: "24 items" },
              {
                id: "long",
                label:
                  "A longer item label that truncates when space is limited",
                detail: "1,234 items",
              },
            ].map(({ id, label, detail }) => (
              <ListBox.Item id={id} key={id} textValue={label}>
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="truncate">{label}</span>
                  <span className="ml-auto shrink-0 text-muted">{detail}</span>
                </span>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Multiple selection">
          <ListBox
            aria-label="Multiple selection"
            selectionMode="multiple"
            defaultSelectedKeys={["first"]}
            className="w-full max-w-md"
          >
            {["first", "second", "third"].map((item) => (
              <ListBox.Item id={item} key={item} textValue={item}>
                {item}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Collections/ListBox",
  component: ListBox,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ListBox component from @avgeek-oss/design-system/collections/list-box. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ListBoxVariants section={0} />,
};

export const TrailingContent: Story = {
  name: "Trailing content",
  render: () => <ListBoxVariants section={1} />,
};

export const MultipleSelection: Story = {
  name: "Multiple selection",
  render: () => <ListBoxVariants section={2} />,
};
