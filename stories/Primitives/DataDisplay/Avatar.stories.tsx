import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Avatar } from "../../../src/data-display/avatar";

function AvatarVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Avatar">
      {section === 0 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Avatar key={size} size={size} aria-label="Alex Example">
              <Avatar.Fallback>AE</Avatar.Fallback>
            </Avatar>
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Colors">
          {(["default", "accent", "danger", "success", "warning"] as const).map(
            (color) => (
              <Avatar key={color} color={color} aria-label={`${color} avatar`}>
                <Avatar.Fallback>AE</Avatar.Fallback>
              </Avatar>
            ),
          )}
        </Variant>
      )}
      {section === 2 && (
        <Variant title="Variants">
          {(["default", "soft"] as const).map((variant) => (
            <Avatar
              key={variant}
              variant={variant}
              color="accent"
              aria-label={`${variant} avatar`}
            >
              <Avatar.Fallback>AE</Avatar.Fallback>
            </Avatar>
          ))}
        </Variant>
      )}
      {section === 3 && (
        <Variant title="Image">
          <Avatar aria-label="Avgeek">
            <Avatar.Image
              alt="Avgeek"
              src={
                new URL(
                  "../../../studio/assets/avgeek-dev-light.svg",
                  import.meta.url,
                ).href
              }
            />
            <Avatar.Fallback>A</Avatar.Fallback>
          </Avatar>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Avatar",
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Avatar component from @avgeek-oss/design-system/data-display/avatar. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AvatarVariants section={0} />,
};

export const Colors: Story = {
  name: "Colors",
  render: () => <AvatarVariants section={1} />,
};

export const Variants: Story = {
  name: "Variants",
  render: () => <AvatarVariants section={2} />,
};

export const Image: Story = {
  name: "Image",
  render: () => <AvatarVariants section={3} />,
};
