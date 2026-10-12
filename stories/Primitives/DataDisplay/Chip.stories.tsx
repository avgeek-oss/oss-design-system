import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Chip } from "../../../src/data-display/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "../../../src/feedback/spinner";
import { Tooltip } from "../../../src/overlays/tooltip";
import { Flag01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

function ChipVariants({ section = 0 }: { section?: number }) {
  const tones = {
    default: "text-foreground",
    accent: "text-accent",
    danger: "text-danger",
    success: "text-success",
    warning: "text-warning",
  };
  return (
    <PrimitivePreview title="Chip">
      {section === 0 && (
        <Variant title="Colors">
          {(["default", "accent", "danger", "success", "warning"] as const).map(
            (color) => (
              <div key={color} className="grid gap-2" data-status-tone={color}>
                <span className={tones[color]}>1 {color}</span>
                <Chip color={color}>
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={16}
                    aria-hidden
                    className={tones[color]}
                    strokeWidth={1.5}
                  />
                  <Chip.Label>{color}</Chip.Label>
                </Chip>
              </div>
            ),
          )}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Variants">
          {(["primary", "secondary", "soft", "tertiary"] as const).map(
            (variant) => (
              <Chip variant={variant} color="accent" key={variant}>
                {variant}
              </Chip>
            ),
          )}
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Chip key={size} size={size}>
              {size}
            </Chip>
          ))}
        </Variant>
      )}
      {section === 3 && (
        <Variant title="Content">
          <Chip>
            <HugeiconsIcon
              icon={Tick02Icon}
              size={16}
              aria-hidden="true"
              strokeWidth={1.5}
            />
            <Chip.Label>Icon</Chip.Label>
          </Chip>
          <Chip aria-busy>
            <Spinner color="current" size="sm" />
            <Chip.Label>Loading</Chip.Label>
          </Chip>
          <Tooltip>
            <Tooltip.Trigger tabIndex={0}>
              <Chip>Tooltip</Chip>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              Additional information
            </Tooltip.Content>
          </Tooltip>
          <Chip>123</Chip>
        </Variant>
      )}
      {section === 4 && (
        <Variant title="Single-line labels">
          <div className="w-24">
            <Chip size="sm">
              <Chip.Label className="inline-flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Flag01Icon}
                  size={16}
                  aria-hidden
                  strokeWidth={1.5}
                />
                No priority
              </Chip.Label>
            </Chip>
          </div>
          <Chip>Waiting for review</Chip>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Chip",
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Chip component from @avgeek-oss/design-system/data-display/chip. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ChipVariants section={0} />,
};

export const Variants: Story = {
  name: "Variants",
  render: () => <ChipVariants section={1} />,
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => <ChipVariants section={2} />,
};

export const Content: Story = {
  name: "Content",
  render: () => <ChipVariants section={3} />,
};

export const SingleLineLabels: Story = {
  name: "Single-line labels",
  render: () => <ChipVariants section={4} />,
};
