import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "../../../src/forms/field";
import { Input } from "../../../src/forms/input";

function FieldVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Field">
      {section === 0 && (
        <Variant title="Label and description">
          <Field className="max-w-md">
            <FieldLabel htmlFor="field-example" isRequired>
              Label
            </FieldLabel>
            <Input
              id="field-example"
              required
              aria-describedby="field-description"
            />
            <FieldDescription id="field-description">
              Description
            </FieldDescription>
          </Field>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Error">
          <Field className="max-w-md">
            <FieldLabel htmlFor="field-error">Label</FieldLabel>
            <Input
              id="field-error"
              aria-invalid
              aria-describedby="error-description"
            />
            <FieldError id="error-description">Error description</FieldError>
          </Field>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Field component from @avgeek-oss/design-system/forms/field. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <FieldVariants section={0} />,
};

export const Error: Story = {
  name: "Error",
  render: () => <FieldVariants section={1} />,
};
