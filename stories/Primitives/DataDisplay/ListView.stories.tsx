import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ListView } from "../../../src/data-display/list-view";

function ListViewVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="ListView">
      {section === 0 && (
        <Variant title="Items">
          <ListView
            className="w-full max-w-lg"
            items={[
              { id: "first", label: "First" },
              { id: "second", label: "Second" },
            ]}
          >
            {(item) => (
              <ListView.Item key={item.id} href={`#${item.id}`}>
                <ListView.ItemContent>
                  <span className="grid">
                    <ListView.Title>{item.label}</ListView.Title>
                    <ListView.Description>Description</ListView.Description>
                  </span>
                </ListView.ItemContent>
              </ListView.Item>
            )}
          </ListView>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Empty">
          <ListView
            className="w-full max-w-lg"
            items={[]}
            renderEmptyState={() => (
              <p className="p-5 text-sm text-muted">No data yet.</p>
            )}
          >
            {() => null}
          </ListView>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/ListView",
  component: ListView,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ListView component from @avgeek-oss/design-system/data-display/list-view. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ListViewVariants section={0} />,
};

export const Empty: Story = {
  name: "Empty",
  render: () => <ListViewVariants section={1} />,
};
