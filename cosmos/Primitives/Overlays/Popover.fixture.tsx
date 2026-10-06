import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Popover } from "../../../src/overlays/popover";

export default function PopoverVariants() {
  return (
    <PrimitivePreview title="Popover">
      <Variant title="Placements">
        {(["top", "bottom", "left", "right"] as const).map((placement) => (
          <Popover key={placement}>
            <Popover.Trigger className="button button--secondary button--sm">
              {placement}
            </Popover.Trigger>
            <Popover.Content placement={placement}>
              <Popover.Arrow />
              <Popover.Dialog>
                <Popover.Heading>Popover heading</Popover.Heading>
                <p className="text-sm">Popover content</p>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}
