import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { useState } from "react";
import { Dropdown } from "../../../src/overlays/dropdown";

export default function DropdownVariants() {
  const [action, setAction] = useState("None");
  return (
    <PrimitivePreview title="Dropdown">
      <Variant title="Items">
        <Dropdown>
          <Dropdown.Trigger className="button button--secondary button--sm">
            Open dropdown
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Menu
              aria-label="Actions"
              onAction={(key) => setAction(String(key))}
            >
              <Dropdown.Item id="first" textValue="First">
                First
              </Dropdown.Item>
              <Dropdown.Item id="second" textValue="Second">
                Second
              </Dropdown.Item>
              <Dropdown.Item id="disabled" textValue="Disabled" isDisabled>
                Disabled
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        <p className="text-sm text-muted" role="status">
          Selected: {action}
        </p>
      </Variant>
    </PrimitivePreview>
  );
}
