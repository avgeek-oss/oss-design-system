import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Textarea } from "../../../src/forms/textarea";

function TextareaVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Textarea">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant title={variant} key={variant}>
            <Textarea
              aria-label={`${variant} textarea`}
              className="w-full max-w-md"
              variant={variant}
              rows={3}
              placeholder="Text"
            />
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="States">
          <Textarea
            aria-label="Invalid textarea"
            aria-invalid
            defaultValue="Invalid"
          />
          <Textarea aria-label="Disabled textarea" disabled value="Disabled" />
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Textarea",
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Textarea component from @avgeek-oss/design-system/forms/textarea. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <TextareaVariants section={0} />,
};

export const States: Story = {
  name: "States",
  render: () => <TextareaVariants section={1} />,
};
