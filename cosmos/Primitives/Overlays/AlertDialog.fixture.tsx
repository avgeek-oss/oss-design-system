import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { AlertDialog } from "../../../src/overlays/alert-dialog";
import { Button } from "../../../src/buttons/button";

export default function AlertDialogVariants() {
  const [open, setOpen] = useState(false);
  return (
    <PrimitivePreview title="AlertDialog">
      <Variant title="Confirmation">
        <Button variant="secondary" onPress={() => setOpen(true)}>
          Open alert dialog
        </Button>
        <AlertDialog.Backdrop isOpen={open} onOpenChange={setOpen}>
          <AlertDialog.Container size="sm">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Confirm action?</AlertDialog.Heading>
                <AlertDialog.CloseTrigger />
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-sm">This is an alert dialog.</p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="secondary" onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onPress={() => setOpen(false)}>
                  Confirm
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </Variant>
    </PrimitivePreview>
  );
}
