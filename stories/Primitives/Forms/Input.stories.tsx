import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Input } from "../../../src/forms/input";
import { DatePickerPreview } from "../../../studio/date-picker-preview";

function InputVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Input">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant key={variant} title={variant}>
            <div
              className={
                variant === "secondary"
                  ? "grid w-full max-w-md gap-3 rounded-2xl bg-surface p-4"
                  : "grid w-full max-w-md gap-3"
              }
            >
              {(
                ["text", "email", "url", "number", "search", "time"] as const
              ).map((type) => (
                <Input
                  key={type}
                  aria-label={`${variant} ${type}`}
                  variant={variant}
                  type={type}
                  placeholder={type}
                />
              ))}
              <DatePickerPreview
                aria-label={`${variant} date`}
                variant={variant}
              />
            </div>
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="States">
          <div className="grid w-full max-w-md gap-3">
            <Input
              aria-label="Invalid"
              aria-invalid
              data-invalid="true"
              defaultValue="Invalid"
            />
            <Input aria-label="Read only" readOnly value="Read only" />
            <Input aria-label="Disabled" disabled value="Disabled" />
          </div>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Input component from @avgeek-oss/design-system/forms/input. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <InputVariants section={0} />,
};

export const States: Story = {
  name: "States",
  render: () => <InputVariants section={1} />,
};
