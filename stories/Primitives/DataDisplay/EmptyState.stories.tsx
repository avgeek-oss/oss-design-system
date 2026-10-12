import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { EmptyState } from "../../../src/data-display/empty-state";
import { Button } from "../../../src/buttons/button";
import { Widget } from "../../../src/data-display/widget";

function EmptyStateVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="EmptyState">
      {section === 0 && (
        <Variant title="Standalone">
          <EmptyState className="w-full max-w-lg">
            <EmptyState.Header>
              <EmptyState.Title>No data</EmptyState.Title>
              <EmptyState.Description>
                There are no items to display.
              </EmptyState.Description>
            </EmptyState.Header>
            <EmptyState.Content>
              <Button>Action</Button>
            </EmptyState.Content>
          </EmptyState>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Inside widget">
          <Widget className="w-full max-w-lg">
            <Widget.Header>
              <Widget.Title>Title</Widget.Title>
            </Widget.Header>
            <Widget.Content>
              <EmptyState>
                <EmptyState.Header>
                  <EmptyState.Title>No data</EmptyState.Title>
                </EmptyState.Header>
              </EmptyState>
            </Widget.Content>
          </Widget>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/EmptyState",
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published EmptyState component from @avgeek-oss/design-system/data-display/empty-state. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <EmptyStateVariants section={0} />,
};

export const InsideWidget: Story = {
  name: "Inside widget",
  render: () => <EmptyStateVariants section={1} />,
};
