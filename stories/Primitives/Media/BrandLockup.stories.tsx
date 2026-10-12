import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { BrandLockup } from "../../../src/media/brand-lockup";
import { AvgeekLogo } from "../../../studio/avgeek-brand";

function BrandLockupVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="BrandLockup">
      {section === 0 && (
        <Variant title="Default">
          <BrandLockup logo={<AvgeekLogo />}>Avgeek</BrandLockup>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Long label">
          <BrandLockup className="max-w-48" logo={<AvgeekLogo />}>
            A longer application name
          </BrandLockup>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Media/BrandLockup",
  component: BrandLockup,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published BrandLockup component from @avgeek-oss/design-system/media/brand-lockup. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <BrandLockupVariants section={0} />,
};

export const LongLabel: Story = {
  name: "Long label",
  render: () => <BrandLockupVariants section={1} />,
};
