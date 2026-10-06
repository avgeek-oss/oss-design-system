import { useState } from "react";
import { AuthForm } from "../../../src/patterns/auth/auth-form";
import { Modal } from "../../../src/overlays/modal";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { toast } from "../../../src/overlays/toast";
import { Button } from "../../../src/buttons/button";

function ToastVariants() {
  return (
    <PrimitivePreview title="Toast">
      <Variant title="Variants">
        {(["success", "danger", "warning", "info"] as const).map((variant) => (
          <Button
            variant="secondary"
            key={variant}
            onPress={() => toast[variant](`${variant} message`)}
          >
            {variant}
          </Button>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}

function DismissalPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid justify-start gap-4 p-4">
      <Button onPress={() => toast.danger("Persistent error", { timeout: 0 })}>
        Show error
      </Button>
      <Button
        onPress={() => {
          for (let index = 1; index <= 6; index++)
            toast.info(`Notification ${index}`, { timeout: 0 });
        }}
      >
        Show stack
      </Button>
      <Button onPress={() => setOpen(true)}>Open form</Button>
      <Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Edit record</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <AuthForm
                variant="secondary"
                fields={[{ name: "name", label: "Name", required: true }]}
                submitLabel="Save"
                onSubmit={async () => {
                  throw new Error("Save failed. Your draft is retained.");
                }}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
export default { Variants: ToastVariants, Dismissal: DismissalPreview };
