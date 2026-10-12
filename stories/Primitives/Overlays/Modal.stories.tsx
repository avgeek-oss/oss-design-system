import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { Modal } from "../../../src/overlays/modal";
import { Button } from "../../../src/buttons/button";
import { Input } from "../../../src/forms/input";
function ModalExample({
  size,
  long = false,
}: {
  size: "sm" | "md" | "lg";
  long?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onPress={() => setOpen(true)}>
        {long ? "Long heading" : size}
      </Button>
      <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Modal.Container size={size}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>
                {long
                  ? "A longer heading that wraps across multiple lines"
                  : "Modal heading"}
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <p className="mb-4 text-sm">Modal content</p>
              <Input
                variant="secondary"
                className="w-full"
                aria-label="Modal input"
                placeholder="Secondary input"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onPress={() => setOpen(false)}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
function ModalVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="Modal">
      {section === 0 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <ModalExample key={size} size={size} />
          ))}
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Long heading">
          <ModalExample size="sm" long />
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Overlays/Modal",
  component: Modal,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Modal component from @avgeek-oss/design-system/overlays/modal. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ModalVariants section={0} />,
};

export const LongHeading: Story = {
  name: "Long heading",
  render: () => <ModalVariants section={1} />,
};
