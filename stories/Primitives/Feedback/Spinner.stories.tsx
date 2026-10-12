import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Spinner } from "../../../src/feedback/spinner";

function SpinnerVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Spinner">
      {section === 0 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Spinner key={size} size={size} aria-label={`${size} loading`} />
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Colors">
          {(["accent", "success", "warning", "danger", "current"] as const).map(
            (color) => (
              <Spinner
                key={color}
                color={color}
                aria-label={`${color} loading`}
              />
            ),
          )}
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Feedback/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Spinner component from @avgeek-oss/design-system/feedback/spinner. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <SpinnerVariants section={0} />,
};

export const Colors: Story = {
  name: "Colors",
  render: () => <SpinnerVariants section={1} />,
};
