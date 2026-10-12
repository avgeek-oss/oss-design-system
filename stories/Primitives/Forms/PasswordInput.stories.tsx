import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { PasswordInput } from "../../../src/forms/password-input";

function PasswordInputVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="PasswordInput">
      {section === 0 &&
        (["primary", "secondary"] as const).map((variant) => (
          <Variant title={variant} key={variant}>
            <div className="w-full max-w-md">
              <PasswordInput
                aria-label={`${variant} password`}
                variant={variant}
                defaultValue="preview-password"
              />
            </div>
          </Variant>
        ))}
      {section === 1 && (
        <Variant title="Disabled">
          <div className="w-full max-w-md">
            <PasswordInput
              aria-label="Disabled password"
              disabled
              value="preview-password"
            />
          </div>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/PasswordInput",
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published PasswordInput component from @avgeek-oss/design-system/forms/password-input. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PasswordInputVariants section={0} />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => <PasswordInputVariants section={1} />,
};
