import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Tooltip, TooltipText } from "../../../src/overlays/tooltip";

function TooltipVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Tooltip">
      {section === 0 && (
        <Variant title="Placements">
          {(["top", "bottom", "left", "right"] as const).map((placement) => (
            <Tooltip key={placement}>
              <Tooltip.Trigger<"button">
                className="button button--secondary inline-flex"
                render={(props) => <button {...props} />}
              >
                {placement}
              </Tooltip.Trigger>
              <Tooltip.Content placement={placement}>
                <Tooltip.Arrow />
                Tooltip content
              </Tooltip.Content>
            </Tooltip>
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Truncated text">
          <TooltipText
            className="max-w-40 truncate text-sm"
            tooltip="A long label that exceeds the available width"
          >
            A long label that exceeds the available width
          </TooltipText>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Overlays/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Tooltip component from @avgeek-oss/design-system/overlays/tooltip. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <TooltipVariants section={0} />,
};

export const TruncatedText: Story = {
  name: "Truncated text",
  render: () => <TooltipVariants section={1} />,
};
