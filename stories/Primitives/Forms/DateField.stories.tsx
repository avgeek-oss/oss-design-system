import type { Meta, StoryObj } from "@storybook/react-vite";
import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { DateField } from "../../../src/forms/date-field";

function DateFieldVariants() {
  return (
    <PrimitivePreview title="DateField">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <DateField
            aria-label={`${variant} date field`}
            className="w-full max-w-md"
            defaultValue={parseDate("2026-10-06")}
          >
            <DateField.Group variant={variant} fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.Group>
          </DateField>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/DateField",
  component: DateField,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published DateField component from @avgeek-oss/design-system/forms/date-field. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <DateFieldVariants />,
};
