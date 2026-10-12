import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Widget } from "../../../src/data-display/widget";

function WidgetVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Widget">
      {section === 0 && (
        <Variant title="Content only">
          <Widget className="w-full max-w-lg">
            <Widget.Content>Content</Widget.Content>
          </Widget>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Header and content">
          <Widget className="w-full max-w-lg">
            <Widget.Header endContent={<Widget.Action>Action</Widget.Action>}>
              <Widget.Title>Title</Widget.Title>
            </Widget.Header>
            <Widget.Content>Content</Widget.Content>
          </Widget>
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Footer and legend">
          <Widget className="w-full max-w-lg">
            <Widget.Header>
              <Widget.Title>Title</Widget.Title>
            </Widget.Header>
            <Widget.Content>
              <Widget.Legend>
                <Widget.LegendItem color="var(--chart-requested)">
                  First
                </Widget.LegendItem>
                <Widget.LegendItem color="var(--chart-failed)">
                  Second
                </Widget.LegendItem>
              </Widget.Legend>
            </Widget.Content>
            <Widget.Footer>
              <Widget.FooterDescription>
                Footer description
              </Widget.FooterDescription>
              <Widget.Action>Action</Widget.Action>
            </Widget.Footer>
          </Widget>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Widget",
  component: Widget,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Widget component from @avgeek-oss/design-system/data-display/widget. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <WidgetVariants section={0} />,
};

export const HeaderAndContent: Story = {
  name: "Header and content",
  render: () => <WidgetVariants section={1} />,
};

export const FooterAndLegend: Story = {
  name: "Footer and legend",
  render: () => <WidgetVariants section={2} />,
};
