import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Button, ButtonLink } from "../../../src/buttons/button";
import { Spinner } from "../../../src/feedback/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";

function ButtonVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Button">
      {section === 0 && (
        <Variant title="Variants">
          {(
            [
              "primary",
              "secondary",
              "tertiary",
              "ghost",
              "outline",
              "danger",
              "danger-soft",
            ] as const
          ).map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </Variant>
      )}
      {section === 2 && (
        <Variant title="States">
          <Button isDisabled>Disabled</Button>
          <Button isPending>
            <Spinner size="sm" color="current" />
            Pending
          </Button>
          <Button variant="secondary" isIconOnly aria-label="More">
            <HugeiconsIcon
              icon={MoreHorizontalIcon}
              size={16}
              strokeWidth={1.5}
            />
          </Button>
        </Variant>
      )}
      {section === 3 && (
        <Variant title="Link">
          <ButtonLink href="#button-link">Link button</ButtonLink>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Buttons/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    isDisabled: false,
    isPending: false,
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "ghost",
        "outline",
        "danger",
        "danger-soft",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    isPending: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Button component from @avgeek-oss/design-system/buttons/button. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Master: Story = {
  name: "Master",
  render: (args: ComponentProps<typeof Button>) => (
    <div className="p-4">
      <Button {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => <ButtonVariants section={0} />,
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => <ButtonVariants section={1} />,
};

export const States: Story = {
  name: "States",
  render: () => <ButtonVariants section={2} />,
};

export const Link: Story = {
  name: "Link",
  render: () => <ButtonVariants section={3} />,
};
