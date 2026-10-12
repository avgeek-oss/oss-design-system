import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ProgressCircle } from "../../../src/feedback/progress-circle";

function ProgressCircleVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="ProgressCircle">
      {section === 0 && (
        <Variant title="Determinate">
          {[0, 50, 100].map((value) => (
            <ProgressCircle
              key={value}
              value={value}
              aria-label={`${value} percent`}
            >
              <ProgressCircle.Track>
                <ProgressCircle.TrackCircle />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Indeterminate">
          <ProgressCircle isIndeterminate aria-label="Loading">
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle />
              <ProgressCircle.FillCircle />
            </ProgressCircle.Track>
          </ProgressCircle>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Feedback/ProgressCircle",
  component: ProgressCircle,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ProgressCircle component from @avgeek-oss/design-system/feedback/progress-circle. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ProgressCircleVariants section={0} />,
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => <ProgressCircleVariants section={1} />,
};
