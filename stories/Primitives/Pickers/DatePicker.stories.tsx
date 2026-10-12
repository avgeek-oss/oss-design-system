import type { Meta, StoryObj } from "@storybook/react-vite";
import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { DatePickerPreview } from "../../../studio/date-picker-preview";

function DatePickerVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="DatePicker">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant key={variant} title={variant}>
            <div className="w-full max-w-md">
              <DatePickerPreview
                aria-label={`${variant} date`}
                variant={variant}
                defaultValue={parseDate("2026-10-06")}
              />
            </div>
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="States">
          <div className="grid w-full max-w-md gap-3">
            <DatePickerPreview aria-label="Empty date" />
            <DatePickerPreview aria-label="Invalid date" isInvalid />
            <DatePickerPreview
              aria-label="Read only date"
              isReadOnly
              defaultValue={parseDate("2026-10-06")}
            />
            <DatePickerPreview
              aria-label="Disabled date"
              isDisabled
              defaultValue={parseDate("2026-10-06")}
            />
          </div>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Pickers/DatePicker",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive DatePicker examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <DatePickerVariants section={0} />,
};

export const States: Story = {
  name: "States",
  render: () => <DatePickerVariants section={1} />,
};
