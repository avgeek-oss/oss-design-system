import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Drawer } from "../../../src/overlays/drawer";

export default function DrawerVariants() {
  return (
    <PrimitivePreview title="Drawer">
      <Variant title="Placements">
        {(["left", "right", "top", "bottom"] as const).map((placement) => (
          <Drawer key={placement}>
            <Drawer.Trigger className="button button--secondary button--sm">
              {placement}
            </Drawer.Trigger>
            <Drawer.Backdrop>
              <Drawer.Content placement={placement}>
                <Drawer.Dialog>
                  <Drawer.Header>
                    <Drawer.Heading>Drawer heading</Drawer.Heading>
                    <Drawer.CloseTrigger />
                  </Drawer.Header>
                  <Drawer.Body>Drawer content</Drawer.Body>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}
